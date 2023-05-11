// -------- adjust later to only store meta data -------- //

// TEMPORARY ID
let globalID = 100;

const readFileContent = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
};

const readEntries = async (entry, parent, path) => {
  // adjust name to remove '/' this shouldn't be a problem, but just in case
  const regex = new RegExp("/", "g");
  const adjustedForPathname = entry.name.replace(regex, "%");

  const currentPath = path
    ? `${path}/${adjustedForPathname}`
    : adjustedForPathname;

  if (entry.isFile) {
    const nameAndType = entry.name.split(".");

    return new Promise(async (resolve) => {
      entry.file(async (file) => {
        let dataUrl = "";

        /* IMPORTANT: must replace this will file streaming. */
        if (
          ["pdf", "txt", "url", "jpeg", "jpg", "gif", "png"].includes(
            nameAndType[nameAndType.length - 1]
          )
        ) {
          dataUrl = await readFileContent(file);
        }

        const newItem = {
          id: globalID, // <-- REPLACE WITH DB GENERATED ID
          name: nameAndType[0] + "." + nameAndType[nameAndType.length - 1],
          pathname: currentPath,
          type: nameAndType[nameAndType.length - 1],
          size: file.size,
          isPinned: false,
          visibility: "Private",
          permissions: "Only you have access",
          dataUrl: dataUrl,
          items: [],
        };
        parent.items.push(newItem);

        // Add the item's size to the parent folder's size
        parent.size += newItem.size;
        resolve();
      });
    });
  } else if (entry.isDirectory) {
    const newFolder = {
      id: globalID, // <-- REPLACE WITH DB GENERATED ID
      name: entry.name,
      pathname: currentPath,
      type: "Folder",
      size: 0,
      isPinned: false,
      visibility: "Private",
      permissions: "Only you have access",
      dataUrl: "",
      items: [],
    };
    parent.items.push(newFolder);

    const reader = entry.createReader();

    const readAllEntries = async () => {
      return new Promise((resolve) => {
        reader.readEntries(async (entries) => {
          if (entries.length === 0) {
            resolve();
            return;
          }

          for (let i = 0; i < entries.length; i++) {
            const e = entries[i];
            globalID += 1;
            await readEntries(e, newFolder, currentPath);
          }
          await readAllEntries(); // Recursively call readAllEntries()
          resolve();
        });
      });
    };

    return readAllEntries();
  }
};

// ------- gets all contents of dropped item, and converts into a tree that i can render -------- //

const readDroppedFiles = async (items, currentDirectory) => {
  const relPath = JSON.parse(JSON.stringify(currentDirectory.pathname));

  const rootFolder = {
    name: "root",
    type: "Folder",
    items: [],
  };

  if (items.dataTransfer) {
    for (let i = 0; i < items.dataTransfer.items.length; i++) {
      globalID += 1;
      const item = items.dataTransfer.items[i];
      const entry = item.webkitGetAsEntry();
      if (entry) {
        await readEntries(entry, rootFolder, relPath);
      }
    }
  } else {
    // for files only
    for (let i = 0; i < items.target.files.length; i++) {
      globalID += 1;
      const file = items.target.files[i];
      const entry = {
        isFile: true,
        name: file.name,
        file: (callback) => callback(file),
      };
      await readEntries(entry, rootFolder, relPath);
    }
  }

  return rootFolder.items;
};

export default readDroppedFiles;

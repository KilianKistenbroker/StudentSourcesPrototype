// -------- adjust later to only store meta data -------- //

const readFileContent = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
};

const readEntries = async (entry, parent, path) => {
  const currentPath = path ? `${path}/${entry.name}` : entry.name;

  if (entry.isFile) {
    const nameAndType = entry.name.split(".");

    return new Promise(async (resolve) => {
      entry.file(async (file) => {
        const dataUrl = await readFileContent(file);
        const newItem = {
          name: nameAndType[0],
          pathname: currentPath,
          type: nameAndType[1],
          size: file.size,
          isPinned: false,
          visibility: "private",
          dataUrl: dataUrl,
          items: [],
        };
        parent.items.push(newItem);
        parent.size += newItem.size; // Add the item's size to the parent folder's size
        resolve();
      });
    });
  } else if (entry.isDirectory) {
    const newFolder = {
      name: entry.name,
      pathname: currentPath,
      type: "folder",
      size: 0,
      isPinned: false,
      visibility: "private",
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

// ------- gets all contents of users home folder -------- //

const readDroppedFiles = async (items, currentDirectory) => {
  const relPath = JSON.parse(JSON.stringify(currentDirectory.pathname));

  const rootFolder = {
    name: "root",
    type: "folder",
    items: [],
  };

  for (const item of items) {
    const entry = item.webkitGetAsEntry();
    if (entry) {
      await readEntries(entry, rootFolder, relPath);
    }
  }

  return rootFolder.items;
};

export default readDroppedFiles;

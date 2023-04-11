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
        parent.items.push({
          id: currentPath,
          name: nameAndType[0],
          type: nameAndType[1],
          size: file.size,
          dataUrl,
        });
        resolve();
      });
    });
  } else if (entry.isDirectory) {
    const newFolder = {
      id: currentPath,
      name: entry.name,
      type: "folder",
      items: [],
    };
    parent.items.push(newFolder);

    const reader = entry.createReader();
    return new Promise((resolve) => {
      reader.readEntries(async (entries) => {
        for (let i = 0; i < entries.length; i++) {
          const e = entries[i];
          await readEntries(e, newFolder, currentPath);
        }
        resolve();
      });
    });
  }
};

// ------- gets all contents of users home folder -------- //

const readDroppedFiles = async (items) => {
  const rootFolder = { name: "root", type: "folder", items: [] };

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const entry = item.webkitGetAsEntry();
    if (entry) {
      await readEntries(entry, rootFolder, "");
    }
  }

  return rootFolder.items;
};

export default readDroppedFiles;

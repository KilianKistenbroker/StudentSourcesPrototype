// -------- adjust later to only store meta data -------- //

const readFileContent = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
};

const readEntries = async (entry, parent) => {
  if (entry.isFile) {
    const nameAndType = entry.name.split(".");
    console.log(nameAndType);

    return new Promise(async (resolve) => {
      entry.file(async (file) => {
        const dataUrl = await readFileContent(file);
        parent.items.push({
          name: nameAndType[0],
          type: nameAndType[1],
          size: file.size,
          dataUrl, //  <--------- replace with fetch req later on.
        });
        resolve();
      });
    });
  } else if (entry.isDirectory) {
    const newFolder = { name: entry.name, type: "folder", items: [] };
    parent.items.push(newFolder);

    const reader = entry.createReader();
    return new Promise((resolve) => {
      reader.readEntries(async (entries) => {
        for (const e of entries) {
          await readEntries(e, newFolder);
        }
        resolve();
      });
    });
  }
};

// ------- gets all contents of users home folder -------- //

const readDroppedFiles = async (items) => {
  const rootFolder = { name: "root", type: "folder", items: [] };

  for (const item of items) {
    const entry = item.webkitGetAsEntry();
    if (entry) {
      await readEntries(entry, rootFolder);
    }
  }

  /* change og root name to 'Home'and store 
  og name somewhere else for reference. */

  // rootFolder.items[0].name = "Home";
  // const adjustedFolder = rootFolder.items[0];

  // return the items only
  return rootFolder.items;
};

export default readDroppedFiles;

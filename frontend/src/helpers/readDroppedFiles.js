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
          dataUrl: "",
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
    return new Promise((resolve) => {
      reader.readEntries(async (entries) => {
        for (let i = 0; i < entries.length; i++) {
          const e = entries[i];
          await readEntries(e, newFolder, currentPath);
        }
        parent.size += newFolder.size; // Add the folder's size to the parent folder's size
        resolve();
      });
    });
  }
};

// const readEntries = async (entry, parent, path) => {
//   const currentPath = path ? `${path}/${entry.name}` : entry.name;

//   if (entry.isFile) {
//     const nameAndType = entry.name.split(".");

//     return new Promise(async (resolve) => {
//       entry.file(async (file) => {
//         /* data url will be req from backend
//         and emptied when not in use to prevent
//         over allocation */

//         // const dataUrl = "";

//         // temp placement. will replace with file streaming service.
//         const dataUrl = await readFileContent(file);
//         parent.items.push({
//           name: nameAndType[0],
//           pathname: currentPath,
//           type: nameAndType[1],
//           size: file.size,
//           isPinned: false,
//           visibility: "private",
//           dataUrl: "",
//           items: [],
//         });
//         resolve();
//       });
//     });
//   } else if (entry.isDirectory) {
//     const newFolder = {
//       name: entry.name,
//       pathname: currentPath,
//       type: "folder",
//       size: 0, // this should be a summation of its childrens size
//       isPinned: false,
//       visibility: "private",
//       dataUrl: "",
//       items: [],
//     };
//     parent.items.push(newFolder);

//     const reader = entry.createReader();
//     return new Promise((resolve) => {
//       reader.readEntries(async (entries) => {
//         for (let i = 0; i < entries.length; i++) {
//           const e = entries[i];
//           await readEntries(e, newFolder, currentPath);
//         }
//         resolve();
//       });
//     });
//   }
// };

// ------- gets all contents of users home folder -------- //

const readDroppedFiles = async (items, currentDirectory) => {
  const relPath = JSON.parse(JSON.stringify(currentDirectory.pathname));

  const rootFolder = {
    name: "root",
    type: "folder",
    items: [],
  };

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const entry = item.webkitGetAsEntry();
    if (entry) {
      await readEntries(entry, rootFolder, relPath);
    }
  }

  return rootFolder.items;
};

export default readDroppedFiles;

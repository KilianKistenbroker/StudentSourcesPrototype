const initTrash = (folderData, setTrash) => {
  for (let i = 0; i < folderData.items.length; i++) {
    if (!folderData.items[i]) {
      // FATAL ERROR: attach new trash to null peice here
      folderData.items[i] = {
        id: -1,
        name: "~Trash",
        pathname: "Home/~Trash",
        type: "Folder",
        size: 0,
        isPinned: false,
        visibility: "Private",
        permissions: "Only you have access",
        dataUrl: "",
        items: [],
      };
      console.log("failed to initilize trash");
    } else if (folderData.items[i].name === "~Trash") {
      setTrash(folderData.items[i]);
      return 0;
    }
  }

  // FATAL ERROR: attach new trash here
  folderData.items.push({
    id: -1,
    name: "~Trash",
    pathname: "Home/~Trash",
    type: "Folder",
    size: 0,
    isPinned: false,
    visibility: "Private",
    permissions: "Only you have access",
    dataUrl: "",
    items: [],
  });
  console.log("failed to initilize trash");
  return 0;
};

export default initTrash;

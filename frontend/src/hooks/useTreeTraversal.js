// const finalTree = insertNode(currentDirectory, id, name, type);

const useTreeTraversal = () => {
  function insertNode(
    explorerData,
    currentDirectory,
    handleSetCurrentDirectory,
    setCurrentDirectory,
    setExplorerData,
    name,
    type
  ) {
    if (currentDirectory.items.some((item) => item.name === name)) {
      // prompt skip or replace
    } else {
      let dataUrl = "";

      // convert.com to .url file
      if (type === "url") {
        dataUrl =
          "application/octet-stream;base64," + window.btoa("URL=" + name);
      }

      const regex = new RegExp("/", "g");
      const adjustedForPathname = name.replace(regex, "%");

      currentDirectory.items.push({
        pathname: currentDirectory.pathname + "/" + adjustedForPathname,
        name,
        type,
        size: 0,
        isPinned: false,
        visibility: "Private", // <-default
        permissions: "Only you have access",
        dataUrl: dataUrl,
        items: [],
      });

      currentDirectory.items.sort((a, b) => {
        let fa = a.name.toLowerCase(),
          fb = b.name.toLowerCase();

        return fa.localeCompare(fb, undefined, { numeric: true });
      });

      let folders = [];
      let files = [];
      for (let i = 0; i < currentDirectory.items.length; i++) {
        if (currentDirectory.items[i].type === "Folder")
          folders.push(currentDirectory.items[i]);
        else files.push(currentDirectory.items[i]);
      }
      const updateitems = folders.concat(files);
      currentDirectory.items = updateitems;
    }
  }

  const deleteNode = () => {};
  const updateNode = () => {};

  return { insertNode, deleteNode, updateNode };
};

export default useTreeTraversal;

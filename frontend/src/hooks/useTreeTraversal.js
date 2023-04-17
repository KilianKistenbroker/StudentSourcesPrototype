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
        name = name + ".url";
        dataUrl =
          "application/octet-stream;base64," + window.btoa("URL=" + name);
      }

      currentDirectory.items.push({
        pathname: currentDirectory.pathname + "/" + name,
        name,
        type,
        size: 0,
        isPinned: false,
        visibility: false,
        dataUrl: dataUrl,
        items: [],
      });

      currentDirectory.items.sort((a, b) => {
        let fa = a.name.toLowerCase(),
          fb = b.name.toLowerCase();

        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });

      let folders = [];
      let files = [];
      for (let i = 0; i < currentDirectory.items.length; i++) {
        if (currentDirectory.items[i].type === "folder")
          folders.push(currentDirectory.items[i]);
        else files.push(currentDirectory.items[i]);
      }
      const updateitems = folders.concat(files);
      currentDirectory.items = updateitems;

      // remove unneccessary URL data here before parsing with stringify
      const tempObject = {
        name: currentDirectory.name,
        pathname: currentDirectory.pathname,
        type: "folder",
        size: 0,
        isPinned: false,
        visibility: "public",
        dataUrl: "",
        items: currentDirectory.items,
      };

      setCurrentDirectory(tempObject);
    }

    // const tempCurrDir = JSON.parse(JSON.stringify(currentDirectory));

    // const tempExplorer = JSON.parse(JSON.stringify(explorerData));

    // handleSetCurrentDirectory(explorerData, currentDirectory.pathname, -1);
    // setExplorerData(tempExplorer);
  }

  const deleteNode = () => {};
  const updateNode = () => {};

  return { insertNode, deleteNode, updateNode };
};

export default useTreeTraversal;

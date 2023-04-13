// const finalTree = insertNode(currentDirectory, id, name, type);

const useTreeTraversal = () => {
  function insertNode(
    explorerData,
    currentDirectory,
    setCurrentDirectory,
    setExplorerData,
    name,
    type
  ) {
    if (type === "folder") {
      currentDirectory.items.push({
        pathname: currentDirectory.pathname + "/" + name,
        name,
        type,
        size: 0,
        isPinned: false,
        visibility: false,
        dataUrl: "",
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

      const tempCurrDir = JSON.parse(JSON.stringify(currentDirectory));
      const tempExplorer = JSON.parse(JSON.stringify(explorerData));

      setCurrentDirectory(tempCurrDir);
      setExplorerData(tempExplorer);
    }
  }

  const deleteNode = () => {};
  const updateNode = () => {};

  return { insertNode, deleteNode, updateNode };
};

export default useTreeTraversal;

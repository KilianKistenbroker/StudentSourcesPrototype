const useTreeTraversal = () => {
  function insertNode(tree, folderId, item, type) {
    if (tree.id === folderId && tree.type === "folder") {
      tree.items.unshift({
        id: new Date().getTime(),
        name: item,
        type,
        items: [],
      });

      return tree;
    }

    let latestNode = [];
    latestNode = tree.items.map((obj) => {
      return insertNode(obj, folderId, item, type);
    });

    return { ...tree, items: latestNode };
  }

  const deleteNode = () => {};
  const updateNode = () => {};

  return { insertNode, deleteNode, updateNode };
};

export default useTreeTraversal;

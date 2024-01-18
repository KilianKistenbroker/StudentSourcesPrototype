import readDroppedFiles from "./readDroppedFiles";

const updateParentSize = (node, parsingArr, size) => {
  parsingArr.shift();
  if (parsingArr.length === 0) {
    node.size += size;
    return node;
  }
  node.size += size;
  for (let i = 0; i < node.items.length; i++) {
    if (node.items[i].name === parsingArr[0]) {
      node.items[i] = updateParentSize(node.items[i], parsingArr, size);
      return node;
    }
  }
};

const handleDrop = async (
  e,
  node,
  setDragOver,
  setMoveEffect,
  handleMoveFile,
  setLoading,
  tempFile,
  explorerData,
  setMessage,
  setSplashMsg,
  data,
  owner,
  setLoadingBar
) => {
  if (data.user !== owner.user) {
    return;
  }

  e.preventDefault();
  e.stopPropagation();
  setLoading(true);
  setDragOver(false);
  setMoveEffect(false);

  if (tempFile && tempFile.state === "dragging") {
    handleMoveFile(node.pathname);

    setLoading(false);
  } else {
    // uploading here
    // console.log("uploading this file");

    readDroppedFiles(
      e,
      node,
      data,
      explorerData,
      setLoading,
      setMessage,
      setSplashMsg,
      setLoadingBar
    );
  }
};

export default handleDrop;

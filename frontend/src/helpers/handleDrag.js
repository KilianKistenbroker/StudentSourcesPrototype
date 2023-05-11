const handleDragOver = (
  e,
  tempFile,
  destNode,
  setMoveEffect,
  setDragOver,
  data,
  owner
) => {
  if (
    (tempFile.content && destNode.items.includes(tempFile.content)) ||
    (tempFile.content &&
      destNode.pathname.includes(tempFile.content.pathname)) ||
    (tempFile.content && destNode.items.includes(tempFile.content)) ||
    destNode.type !== "Folder" ||
    (destNode.name === "~Trash" && !tempFile.state) ||
    data.user !== owner.user
  ) {
    return;
  }

  e.preventDefault();
  e.stopPropagation();

  if (tempFile.state && tempFile.state === "dragging") {
    setMoveEffect(true);
  } else {
    setDragOver(true);
    e.dataTransfer.dropEffect = "copy";
  }
};

export default handleDragOver;

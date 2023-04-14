import React, { useState } from "react";
import readDroppedFiles from "../helpers/readDroppedFiles";

const DropZone = ({
  explorerData,
  currentDirectory,
  setCurrentDirectory,
  setExplorerData,
  setLoading,
  loading,
}) => {
  const [dragOver, setDragOver] = useState(false);

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

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    setDragOver(false);

    console.log("transfering this data");
    console.log(e.dataTransfer.items);

    const objArr = await readDroppedFiles(
      e.dataTransfer.items,
      currentDirectory
    );

    // --- this will update and sort global currDir --- //

    let size = 0;
    for (let i = 0; i < objArr.length; i++) {
      if (currentDirectory.items.some((item) => item.name === objArr[i].name)) {
        // prompt skip or replace b/c merge is too hard to code :/
      } else {
        size += objArr[i].size;
        currentDirectory.items.push(objArr[i]);
      }
    }

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

    /* parse through tree using pathname from current directory. 
    then add size to each node in branch */

    let parsingArr = currentDirectory.pathname.split("/");

    console.log("from update parents");
    console.log(updateParentSize(explorerData, parsingArr, size));

    setLoading(false);

    console.log("snapshot");
    console.log(explorerData);

    // send req to backend to sync files in cloud
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
    e.dataTransfer.dropEffect = "copy";
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "60px",
          color: "dimgrey",
          fontSize: "22px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <>
      {dragOver ? (
        <div
          className={"dropzone dragging"}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragExit={() => setDragOver(false)}
        >
          Drop files here to upload
        </div>
      ) : (
        <div className={"dropzone"} onDragOver={handleDragOver}>
          {/* no rendering here */}
        </div>
      )}
    </>
  );
};

export default DropZone;

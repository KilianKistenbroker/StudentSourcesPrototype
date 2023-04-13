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

  const updateParentSizeAndInsert = (node, parsingArr, size, insert) => {
    let myNode = JSON.parse(JSON.stringify(node));
    parsingArr.shift();
    if (parsingArr.length === 0) {
      insert.size += size;
      myNode = insert;

      return insert;
    }
    myNode.size += size;
    for (let i = 0; i < myNode.items.length; i++) {
      if (myNode.items[i].name === parsingArr[0]) {
        myNode.items[i] = updateParentSizeAndInsert(
          myNode.items[i],
          parsingArr,
          size,
          insert
        );
        return myNode;
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
    let tempCurrDir = JSON.parse(JSON.stringify(currentDirectory));

    for (let i = 0; i < objArr.length; i++) {
      if (tempCurrDir.items.some((item) => item.name === objArr[i].name)) {
        // prompt skip or replace b/c merge is too hard to code :/
      } else {
        size += objArr[i].size;
        tempCurrDir.items.push(objArr[i]);
      }
    }

    tempCurrDir.items.sort((a, b) => {
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

    const temp = updateParentSizeAndInsert(
      explorerData,
      parsingArr,
      size,
      tempCurrDir
    );

    explorerData = temp;
    const temp2 = JSON.parse(JSON.stringify(explorerData));

    setExplorerData(temp2);
    setCurrentDirectory(tempCurrDir);

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

          {/* {folderJson && renderNode(folderJson)} */}
        </div>
      )}
    </>
  );
};

export default DropZone;

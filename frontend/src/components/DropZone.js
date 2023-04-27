import React, { useEffect, useState, useRef } from "react";
import readDroppedFiles from "../helpers/readDroppedFiles";

const DropZone = ({
  explorerData,
  currentDirectory,
  setLoading,
  loading,
  files,
  setFiles,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    if (files) {
      console.log(files);
      handleDrop(files);
      setFiles(null);
    }
  }, [files]);

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

    // console.log("transfering this data");
    // console.log(e);

    const objArr = await readDroppedFiles(e, currentDirectory);

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

      return fa.localeCompare(fb, undefined, { numeric: true });
    });

    // this may never be needed here ...
    let folders = [];
    let files = [];
    for (let i = 0; i < currentDirectory.items.length; i++) {
      if (currentDirectory.items[i].type === "Folder")
        folders.push(currentDirectory.items[i]);
      else files.push(currentDirectory.items[i]);
    }
    const updateitems = folders.concat(files);
    currentDirectory.items = updateitems;

    /* parse through tree using pathname from current directory. 
    then add size to each node in branch */

    let parsingArr = currentDirectory.pathname.split("/");
    const res = updateParentSize(explorerData, parsingArr, size);

    // console.log("from update parents");
    // console.log(res);

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
          marginTop: "10px",
          width: "100%",
          height: "70vh",
          display: "flex",
          paddingTop: "50px",
          justifyContent: "center",
          color: "dimgray",
          transition: ".2s",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <>
      {dragOver || currentDirectory.items.length === 0 ? (
        <div
          className={"dropzone dragging"}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragExit={() => setDragOver(false)}
        >
          <span style={{ padding: "10px" }}>
            <b>Drop files here to upload</b>, or use the{" "}
            <input
              type="file"
              multiple
              onChange={(e) => setFiles(e)}
              hidden
              ref={inputRef}
            />
            <span onClick={() => inputRef.current.click()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="header-icons cursor-enabled"
                style={{ width: "30px" }}
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
              </svg>{" "}
            </span>
            button.
          </span>
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

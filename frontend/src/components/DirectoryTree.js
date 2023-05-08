import { useState } from "react";
import { useEffect } from "react";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactComponent as TXT } from "../logos/icons/txt.svg";
import { ReactComponent as FOLDER } from "../logos/icons/folder.svg";
import { ReactComponent as JPG } from "../logos/icons/jpg.svg";
import { ReactComponent as PNG } from "../logos/icons/png.svg";
import { ReactComponent as GIF } from "../logos/icons/gif.svg";
import { ReactComponent as MOV } from "../logos/icons/mov.svg";
import { ReactComponent as MP3 } from "../logos/icons/mp3.svg";
import { ReactComponent as MP4 } from "../logos/icons/mp4.svg";
import { ReactComponent as PDF } from "../logos/icons/pdf.svg";
import { ReactComponent as UNKNOWN } from "../logos/icons/unknown-mail.svg";
import { ReactComponent as URL } from "../logos/icons/url.svg";
import readDroppedFiles from "../helpers/readDroppedFiles";

const DirectoryTree = ({
  setSplashMsg,
  explorerData,
  handleInsertNode,
  explorer,
  setCurrentDirectory,
  currentDirectory,
  windowDimension,
  setCurrentFile,
  loading,
  currentFile,
  owner,
  data,
  setMessage,
  tempFile,
  setTempFile,
  handleMoveFile,
}) => {
  const [expand, setExpand] = useState(false);
  const [specialExpand, setSpecialExpand] = useState(false);
  const [input, setInput] = useState("");
  const [validInput, setValidInput] = useState(true);
  const delimiters = /[./:]+/;
  const restrictedChars = /[{}|"%~#<>]/;
  const [dragOver, setDragOver] = useState(false);

  const [showInput, setShowInput] = useState({
    visible: false,
    type: "",
  });

  useEffect(() => {
    if (
      tempFile &&
      tempFile.state === "dragging" &&
      explorer.pathname === tempFile.content.pathname
    ) {
      setExpand(false);
    }
  }, [tempFile]);

  useEffect(() => {
    if (showInput.type === "Folder") {
      setValidInput(input.length > 0 && !restrictedChars.test(input));

      if (restrictedChars.test(input)) {
        setMessage({
          title: "Uh-oh!",
          body: 'Filenames cannot contain these characters: {}|"%~#<>',
        });
      } else {
        setMessage({
          title: null,
          body: null,
        });
      }
    } else {
      try {
        if (!restrictedChars.test(input)) {
          setMessage({
            title: null,
            body: null,
          });
          const res = input.split(delimiters);
          if (res.length !== 2 && !res.includes("com")) {
            setValidInput(false);
          } else {
            if (res.includes("com")) {
              setValidInput(true);
            } else {
              setValidInput(["txt"].includes(res[1]));
            }
          }
        } else {
          setMessage({
            title: "Uh-oh!",
            body: 'Filenames cannot contain these characters: {}|"%~#<>',
          });
        }
      } catch (err) {}
    }
  }, [input]);

  // init page to display home contents in dir tree
  useEffect(() => {
    if (explorer.name === "Home") setExpand(true);
  }, []);

  // update to always expand next current directory. this was made for tree traversing from the main panel.
  useEffect(() => {
    if (explorer.pathname === currentDirectory.pathname && !specialExpand) {
      setExpand(true);
      console.log("expanded");
    }
  }, [currentDirectory]);

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

  const handleDrop = async (e, node) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    if (tempFile && tempFile.state === "dragging") {
      handleMoveFile(node.pathname);
    } else {
      const objArr = await readDroppedFiles(e, explorer);

      // --- this will update and sort global currDir --- //

      // check if size meets storage limit.
      let size = 0;
      for (let i = 0; i < objArr.length; i++) {
        size += objArr[i].size;
      }

      if (explorerData.size + size > 1e9) {
        console.log("exceeded storage limit w/ : " + explorerData.size + size);
        // set failed in main message
        // setLoading(false);
        setMessage({
          title: "Uh-oh!",
          body: "Looks like this upload request exceeds the available storage space on this account. Try deleting files to free up space.",
        });
        return;
      }

      for (let i = 0; i < objArr.length; i++) {
        if (explorer.items.some((item) => item.name === objArr[i].name)) {
          // prompt skip or replace b/c merge is too hard to code :/
        } else {
          explorer.items.push(objArr[i]);
        }
      }

      explorer.items.sort((a, b) => {
        let fa = a.name.toLowerCase(),
          fb = b.name.toLowerCase();

        return fa.localeCompare(fb, undefined, { numeric: true });
      });

      // this may never be needed here ...
      let folders = [];
      let files = [];
      for (let i = 0; i < explorer.items.length; i++) {
        if (explorer.items[i].type === "Folder")
          folders.push(explorer.items[i]);
        else files.push(explorer.items[i]);
      }
      const updateitems = folders.concat(files);
      explorer.items = updateitems;

      /* parse through tree using pathname from current directory. 
      then add size to each node in branch */

      let parsingArr = explorer.pathname.split("/");
      const res = updateParentSize(explorerData, parsingArr, size);

      // console.log("from update parents");
      // console.log(res);

      // setLoading(false);

      console.log("snapshot");
      console.log(explorerData);

      // send req to backend to sync files in cloud

      console.log("updated storage limit w/ : " + explorerData.size + size);
      // set success in splash message
      setSplashMsg({
        message: "Upload successful!",
        isShowing: true,
      });
    }
  };

  const handleDragOver = (e) => {
    if (tempFile.content && tempFile.content === explorer) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);

    if (tempFile.state && tempFile.state === "dragging") {
      e.dataTransfer.dropEffect = "move";
    } else {
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const handleSetInputFalse = () => {
    setShowInput({ ...showInput, visible: false });
    setValidInput(false);
    setInput("");
  };

  const handleSetExpand = (e) => {
    // transitioning out of current file
    if (currentFile) {
      setCurrentFile(null);
      if (explorer.pathname !== currentDirectory.pathname)
        setCurrentDirectory(explorer);
      return;
    }

    // set curr dir
    if (currentDirectory.pathname !== explorer.pathname) {
      if (specialExpand) {
        setExpand(!expand);
        return;
      } else setExpand(true);
    } else {
      // set expand
      setExpand(!expand);
    }

    if (explorer.pathname !== currentDirectory.pathname)
      setCurrentDirectory(explorer);
  };

  const handleNewFolder = (e, type) => {
    e.stopPropagation();

    setCurrentDirectory(explorer);
    setExpand(true);

    setShowInput({
      visible: true,
      type,
    });
  };

  const onAddFolder = (e) => {
    if (e.keyCode === 13 && e.target.value && validInput) {
      if (showInput.type === "file") {
        const temp = input.split(delimiters);
        if (temp.includes("com")) {
          if (temp.includes("https:")) handleInsertNode(e.target.value, "url");
          else handleInsertNode("https://" + e.target.value, "url");
        } else {
          handleInsertNode(e.target.value, temp[1]);
        }
      } else {
        handleInsertNode(e.target.value, showInput.type);
      }
      setShowInput({ ...showInput, visible: false });
      setValidInput(false);
      setInput("");
    } else if (e.keyCode === 13) {
      // set error message here
      if (showInput.type === "file") {
        if (!validInput) {
          setMessage({
            title: "Uh-oh!",
            body: "Supported file extensions include: [txt, com]. For example: [file.txt, website.com].",
          });
        }
      } else {
        if (input.length === 0) {
          setMessage({
            title: "Uh-oh!",
            body: "Folder name cannot be empty.",
          });
        }
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (explorer.type === "Folder") {
    return (
      <div>
        <div
          draggable
          className={
            explorer.pathname === currentDirectory.pathname &&
            windowDimension.winWidth > 1200
              ? "folder select-folder max-folder"
              : explorer.pathname !== currentDirectory.pathname &&
                windowDimension.winWidth > 1200
              ? "folder max-folder"
              : explorer.pathname === currentDirectory.pathname
              ? "folder select-folder medium-folder"
              : "folder medium-folder"
          }
          onClick={() => handleSetExpand(explorer)}
          onDragStart={() => {
            setExpand(false);
            setTempFile({ state: "dragging", content: explorer });
          }}
          onDrop={(e) => handleDrop(e, explorer)}
          onDragOver={handleDragOver}
          onDragLeave={() => setDragOver(false)}
          style={dragOver ? { backgroundColor: "#e0e0e0" } : {}}
        >
          <span
            className="cursor-enabled"
            style={
              windowDimension.winWidth > 1200
                ? {
                    width: "fit-content",
                    maxWidth: "260px",
                    overflow: "hidden",
                    textOverflow: "ellipses",
                    whiteSpace: "nowrap",
                    transition: ".1s",
                  }
                : {
                    width: "fit-content",
                    maxWidth: "160px",
                    overflow: "hidden",
                    textOverflow: "ellipses",
                    whiteSpace: "nowrap",
                  }
            }
          >
            {" "}
            {expand ? (
              <div
                onMouseEnter={() => setSpecialExpand(true)}
                onMouseLeave={() => setSpecialExpand(false)}
                className="folder-icon"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="tree-icon"
                  style={{ paddingTop: "5px", width: "18px", height: "18px" }}
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                </svg>
              </div>
            ) : (
              <div
                onMouseEnter={() => setSpecialExpand(true)}
                onMouseLeave={() => setSpecialExpand(false)}
                className="folder-icon"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="tree-icon"
                  style={{ paddingTop: "5px", width: "18px", height: "18px" }}
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </div>
            )}{" "}
            <div style={{ float: "left", marginRight: "10px" }}>
              <FOLDER style={{ width: "16px", height: "16px" }} />{" "}
            </div>{" "}
            {explorer.name}
          </span>

          <div style={{ whiteSpace: "nowrap" }}>
            {owner.user === data.user && (
              <button onClick={(e) => handleNewFolder(e, "Folder")}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="tree-icon"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="m.5 3 .04.87a1.99 1.99 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14H9v-1H2.826a1 1 0 0 1-.995-.91l-.637-7A1 1 0 0 1 2.19 4h11.62a1 1 0 0 1 .996 1.09L14.54 8h1.005l.256-2.819A2 2 0 0 0 13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2zm5.672-1a1 1 0 0 1 .707.293L7.586 3H2.19c-.24 0-.47.042-.683.12L1.5 2.98a1 1 0 0 1 1-.98h3.672z" />
                  <path d="M13.5 10a.5.5 0 0 1 .5.5V12h1.5a.5.5 0 1 1 0 1H14v1.5a.5.5 0 1 1-1 0V13h-1.5a.5.5 0 0 1 0-1H13v-1.5a.5.5 0 0 1 .5-.5z" />
                </svg>
              </button>
            )}
            {owner.user === data.user && (
              <button onClick={(e) => handleNewFolder(e, "file")}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="tree-icon"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5z" />
                  <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z" />
                </svg>
              </button>
            )}
            {/* adjust this to where user can seslct filetype to create */}
          </div>
        </div>

        <div style={{ display: expand ? "block" : "none", paddingLeft: 15 }}>
          {showInput.visible && (
            <div className="inputContainer">
              <span> {showInput.type === "Folder" ? "📁" : "📄"} </span>

              <input
                style={{ fontSize: "14px" }}
                type="text"
                onKeyDown={onAddFolder}
                onBlur={() => handleSetInputFalse()}
                className="inputContainer__input"
                placeholder={showInput.type !== "Folder" ? "example.txt" : ""}
                onChange={(e) => setInput(e.target.value.trim(" "))}
                autoFocus
              />
              {validInput && (
                <div className="inputValid">
                  <FontAwesomeIcon icon={faCheck} />
                </div>
              )}
            </div>
          )}

          {explorer.items.map((exp, index) => {
            if (expand) {
              // <--------  this if statement is VERY important for time complexity !!!
              return (
                <DirectoryTree
                  setSplashMsg={setSplashMsg}
                  explorerData={explorerData}
                  handleInsertNode={handleInsertNode}
                  explorer={exp}
                  key={index}
                  setCurrentDirectory={setCurrentDirectory}
                  currentDirectory={currentDirectory}
                  windowDimension={windowDimension}
                  setCurrentFile={setCurrentFile}
                  currentFile={currentFile}
                  owner={owner}
                  data={data}
                  setMessage={setMessage}
                  tempFile={tempFile}
                  setTempFile={setTempFile}
                  handleMoveFile={handleMoveFile}
                />
              );
            }
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div
        draggable
        className={
          currentFile && currentFile.pathname === explorer.pathname
            ? "file file-selected cursor-disabled"
            : "file cursor-enabled"
        }
        onClick={() => setCurrentFile(explorer)}
        onDragStart={() => {
          setExpand(false);
          setTempFile({ state: "dragging", content: explorer });
        }}
      >
        <div
          className=""
          style={
            windowDimension.winWidth > 1200
              ? {
                  width: "fit-content",
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipses",
                  whiteSpace: "nowrap",
                  transition: ".1s",
                }
              : {
                  width: "fit-content",
                  maxWidth: "100px",
                  overflow: "hidden",
                  textOverflow: "ellipses",
                  whiteSpace: "nowrap",
                }
          }
        >
          {["jpeg", "jpg"].includes(explorer.type) ? (
            <div style={{ float: "left", marginRight: "10px" }}>
              <JPG style={{ width: "16px", height: "16px" }} />
            </div>
          ) : "gif" === explorer.type ? (
            <div style={{ float: "left", marginRight: "10px" }}>
              <GIF style={{ width: "16px", height: "16px" }} />
            </div>
          ) : "png" === explorer.type ? (
            <div style={{ float: "left", marginRight: "10px" }}>
              <PNG style={{ width: "16px", height: "16px" }} />
            </div>
          ) : "txt" === explorer.type ? (
            <div style={{ float: "left", marginRight: "10px" }}>
              <TXT style={{ width: "16px", height: "16px" }} />
            </div>
          ) : "pdf" === explorer.type ? (
            <div style={{ float: "left", marginRight: "10px" }}>
              <PDF style={{ width: "16px", height: "16px" }} />
            </div>
          ) : "mp4" === explorer.type ? (
            <div style={{ float: "left", marginRight: "10px" }}>
              <MP4 style={{ width: "16px", height: "16px" }} />
            </div>
          ) : "mp3" === explorer.type ? (
            <div style={{ float: "left", marginRight: "10px" }}>
              <MP3 style={{ width: "16px", height: "16px" }} />
            </div>
          ) : "mov" === explorer.type ? (
            <div style={{ float: "left", marginRight: "10px" }}>
              <MOV style={{ width: "16px", height: "16px" }} />
            </div>
          ) : "url" === explorer.type ? (
            <div style={{ float: "left", marginRight: "10px" }}>
              <URL style={{ width: "16px", height: "16px" }} />
            </div>
          ) : (
            <div style={{ float: "left", marginRight: "10px" }}>
              <UNKNOWN style={{ width: "16px", height: "16px" }} />
            </div>
          )}
          {explorer.name}
        </div>
      </div>
    );
  }
};

export default DirectoryTree;

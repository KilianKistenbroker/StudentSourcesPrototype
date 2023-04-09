import { useState } from "react";
import { useEffect } from "react";

const DirectoryTree = ({
  handleInsertNode,
  explorer,
  setCurrentDirectory,
  currentDirectory,
  windowDimension,
}) => {
  const [expand, setExpand] = useState(false);
  const [showInput, setShowInput] = useState({
    visible: false,
    type: "",
  });

  // init page to display home contents in dir tree
  useEffect(() => {
    if (explorer.name === "Home") setExpand(true);
  }, []);

  const handleSetExpand = (e) => {
    // set curr dir
    if (currentDirectory.name !== explorer.name) {
      setExpand(true);
    } else {
      // set expand
      setExpand(!expand);
    }

    setCurrentDirectory(explorer);
  };

  const handleNewFolder = (e, type) => {
    e.stopPropagation();
    setExpand(true);

    setShowInput({
      visible: true,
      type,
    });
  };

  const onAddFolder = (e) => {
    if (e.keyCode === 13 && e.target.value) {
      console.log("onAddFolder executed");
      handleInsertNode(explorer.id, e.target.value, showInput.type);
      setShowInput({ ...showInput, visible: false });
    }
  };

  if (explorer.type === "folder") {
    return (
      <div>
        <div
          className={
            explorer.name === currentDirectory.name &&
            windowDimension.winWidth > 1200
              ? "folder select-folder max-folder"
              : explorer.name !== currentDirectory.name &&
                windowDimension.winWidth > 1200
              ? "folder max-folder"
              : explorer.name === currentDirectory.name
              ? "folder select-folder medium-folder"
              : "folder medium-folder"
          }
          onClick={() => handleSetExpand(explorer)}
        >
          <span>📁 {explorer.name}</span>

          <div>
            <button onClick={(e) => handleNewFolder(e, "folder")}>
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
            {/* adjust this to where user can seslct filetype to create */}
            <button onClick={(e) => handleNewFolder(e, "txt")}>
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
          </div>
        </div>

        <div style={{ display: expand ? "block" : "none", paddingLeft: 15 }}>
          {showInput.visible && (
            <div className="inputContainer">
              <span> {showInput.type === "folder" ? "📁" : "📄"} </span>
              <input
                type="text"
                onKeyDown={onAddFolder}
                onBlur={() => setShowInput({ ...showInput, visible: false })}
                className="inputContainer__input"
                autoFocus
              />
            </div>
          )}

          {explorer.items.map((exp) => {
            return (
              <DirectoryTree
                handleInsertNode={handleInsertNode}
                explorer={exp}
                key={exp.id}
                setCurrentDirectory={setCurrentDirectory}
                currentDirectory={currentDirectory}
                windowDimension={windowDimension}
              />
            );
          })}
        </div>
      </div>
    );
  } else {
    return <span className="file"> 📄 {explorer.name} </span>;
  }
};

export default DirectoryTree;

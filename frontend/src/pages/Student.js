import { useState } from "react";
import DirectoryTree from "../components/DirectoryTree";
import folderData from "../data/folderData";
import useTreeTraversal from "../hooks/useTreeTraversal";
import StudentSearch from "../components/StudentSearch";
import CurrentDirectory from "../components/CurrentDirectory";
import { useEffect } from "react";
import DropZone from "../components/DropZone";
import Sources from "./Sources";

const Student = (data, windowDimension) => {
  const [explorerData, setExplorerData] = useState(folderData);
  const [currentDirectory, setCurrentDirectory] = useState({});
  const [loading, setLoading] = useState(true);

  const { insertNode } = useTreeTraversal();
  const handleInsertNode = (folderId, item, isFolder) => {
    const finalTree = insertNode(explorerData, folderId, item, isFolder);
    setExplorerData(finalTree);
  };

  useEffect(() => {
    // init current directory

    if (!currentDirectory.items) handleSetCurrentDirectory(explorerData);
    console.log("this was fired");

    setLoading(false);
  }, []);

  async function handleSetCurrentDirectory(event) {
    setCurrentDirectory(event);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page">
      <StudentSearch currentDirectory={currentDirectory} />

      <div className="grid-foundation">
        <div className="left-panel-grid">
          <div className="left-panel-title">EXPLORER</div>
          <div
            className="header-tab"
            style={{ marginTop: "67.5px", direction: "ltr" }}
          >
            Files
          </div>
          <div className="left-panel-tree">
            <DirectoryTree
              handleInsertNode={handleInsertNode}
              explorer={explorerData}
              setCurrentDirectory={handleSetCurrentDirectory}
              currentDirectory={currentDirectory}
              // currentDirectory={currentDirectory}
              // loading={loading}
            />
            {/* spacing */}
            <div style={{ height: "20px", width: "20px" }}> </div>
          </div>
          <div className="header-tab" style={{ direction: "ltr" }}>
            Ask Chatbot
          </div>
          <div className="left-panel-chatbot">{/* ask chatbot */}</div>
          <div className="left-panel-textbox">textbox</div>
        </div>

        <div className="right-panel-grid">
          <div className="right-panel-title">
            {currentDirectory.name.toUpperCase()}
          </div>
          <div className="header-tab" style={{ marginTop: "67.5px" }}>
            Info
          </div>
          <div className="right-panel-info">{/* info */}</div>
          <div className="header-tab">Notes</div>
          <div className="right-panel-notes">{/* notes */}</div>
          <div className="header-tab">Comments</div>
          <div className="right-panel-coments">{/* comments */}</div>
          <div className="right-panel-textbox">textbox</div>
        </div>

        <div className="main-panel-grid">
          {/* <StudentSearch currentDirectory={currentDirectory} /> */}
          <div className="main-panel-content">
            {/* main content */}

            {loading ? (
              <div>loading...</div>
            ) : (
              <CurrentDirectory currentDirectory={currentDirectory} />
            )}
          </div>

          <DropZone />

          <div className="tiny-footer">
            {/* trash */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              // className="header-icons"
              style={{ width: "30px", height: "30px", color: "grey" }}
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M14 3a.702.702 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225A.703.703 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2zM3.215 4.207l1.493 8.957a1 1 0 0 0 .986.836h4.612a1 1 0 0 0 .986-.836l1.493-8.957C11.69 4.689 9.954 5 8 5c-1.954 0-3.69-.311-4.785-.793z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Student;

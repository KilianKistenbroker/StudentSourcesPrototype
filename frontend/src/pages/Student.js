import { useState } from "react";
import DirectoryTree from "../components/DirectoryTree";
import folderData from "../data/folderData";
import useTreeTraversal from "../hooks/useTreeTraversal";
import StudentSearch from "../components/StudentSearch";
import FolderContent from "../components/FolderContent";
import FileContent from "../components/FileContent";
import { saveAs } from "file-saver";
import explorer from "../data/folderData";

const Student = ({ windowDimension }) => {
  // ----------- move to app.js later (maybe) ------------ //
  const [explorerData, setExplorerData] = useState(folderData);
  const [currentDirectory, setCurrentDirectory] = useState(folderData);
  const [showingRightPanel, setShowingRightPanel] = useState(true);
  const [currentFile, setCurrentFile] = useState(null);
  const [loading, setLoading] = useState(null);

  const [pinSelected, setPinSelected] = useState(false);
  const [format, setFormat] = useState("list");

  const { insertNode } = useTreeTraversal();
  const handleInsertNode = (name, type) => {
    const finalTree = insertNode(
      explorerData,
      currentDirectory,
      setCurrentDirectory,
      setExplorerData,
      name,
      type
    );
  };

  // ---------------------------------------------- //

  const parseTree = (node, pathname, state) => {
    // setup parsing array
    let parsingArr = [];
    if (state === -1) {
      // init parsing array
      parsingArr = pathname.split("/");
    } else {
      parsingArr = pathname;
    }
    console.log(parsingArr);

    parsingArr.shift(); // remove the first one

    console.log(parsingArr);

    if (parsingArr.length === 0) {
      return node;
    }

    console.log(node.items.length);

    for (let i = 0; i < node.items.length; i++) {
      if (node.items[i].name === parsingArr[0]) {
        const myNodeRef = parseTree(node.items[i], parsingArr, 0);
        console.log(myNodeRef);
        console.log(currentDirectory);
        return myNodeRef;
      }
    }
  };

  async function handleSetCurrentDirectory(node, pathname, state) {
    const temp = parseTree(node, pathname, state);
    setCurrentDirectory(temp);
  }

  const [textURL, setTextURL] = useState("");

  const handleDownload = () => {
    if (currentFile.type === "txt") {
      const updatedContent = textURL;
      const blob = new Blob([updatedContent], {
        type: "text/plain;charset=utf-8",
      });

      saveAs(blob, currentFile.name + "." + currentFile.type);
    } else if (
      [["jpeg", "jpg", "gif", "png", "pdf"].includes(currentFile.type)]
    ) {
      const imgURL = currentFile.dataUrl;
      const imgDataUrlParts = imgURL.split(",");
      const byteString = window.atob(imgDataUrlParts[1]);
      const mimeString = imgDataUrlParts[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([ab], { type: mimeString });
      saveAs(blob, currentFile.name + "." + currentFile.type);
    }
  };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="page">
      <StudentSearch
        currentDirectory={currentDirectory}
        windowDimension={windowDimension}
        showingRightPanel={showingRightPanel}
        currentFile={currentFile}
        setCurrentFile={setCurrentFile}
        handleDownload={handleDownload}
        setPinSelected={setPinSelected}
        pinSelected={pinSelected}
      />

      <span
        style={{
          right: "0",
          position: "fixed",
          zIndex: "1",
          marginRight: "10px",
          marginTop: "90px",
        }}
        onClick={() => setShowingRightPanel(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="header-icons cursor-enabled"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M11.854 3.646a.5.5 0 0 1 0 .708L8.207 8l3.647 3.646a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708 0zM4.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 1 0v-13a.5.5 0 0 0-.5-.5z" />
        </svg>
      </span>

      <div className="grid-foundation">
        <div
          className={
            windowDimension.winWidth > 1200
              ? "left-panel-grid max-panel-width"
              : windowDimension.winWidth > 800
              ? "left-panel-grid medium-panel-width"
              : "left-panel-grid  min-left-panel"
          }
        >
          <div
            className={
              windowDimension.winWidth > 1200
                ? "left-panel-title max-panel-width"
                : "left-panel-title medium-panel-width"
            }
          >
            EXPLORER
          </div>
          <div
            className="header-tab"
            style={{ marginTop: "67.5px", direction: "ltr" }}
          >
            Files
            {/* more options button */}
            <span style={{ float: "right" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="header-icons cursor-enabled"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
              </svg>
            </span>
          </div>

          <div className="left-panel-tree">
            <DirectoryTree
              handleInsertNode={handleInsertNode}
              explorer={explorerData}
              setCurrentDirectory={setCurrentDirectory}
              currentDirectory={currentDirectory}
              windowDimension={windowDimension}
              setCurrentFile={setCurrentFile}
            />
            {/* spacing */}
            <div style={{ height: "20px", width: "20px" }}> </div>
          </div>
          <div className="header-tab" style={{ direction: "ltr" }}>
            Ask Chatbot
            {/* more options button */}
            <span style={{ float: "right" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="header-icons cursor-enabled"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
              </svg>
            </span>
          </div>
          <div className="left-panel-chatbot">
            {/* add CHATBOT components here */}
          </div>
          <div
            className={
              windowDimension.winWidth > 1200
                ? "left-panel-textbox max-panel-width"
                : "left-panel-textbox medium-panel-width"
            }
          >
            {/* add INPUT FIELD for CHATBOT here */}
            chatbot input field
          </div>
        </div>

        <div
          className={
            windowDimension.winWidth > 1200 && showingRightPanel
              ? "right-panel-grid max-panel-width"
              : showingRightPanel
              ? "right-panel-grid medium-panel-width"
              : "right-panel-grid min-right-panel"
          }
        >
          <div
            className={
              windowDimension.winWidth > 1200
                ? "right-panel-title max-panel-width"
                : "right-panel-title medium-panel-width"
            }
          >
            <div
              style={{
                width: "300px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {currentFile
                ? currentFile.name.toUpperCase()
                : currentDirectory.name.toUpperCase()}
            </div>

            {/* collapse right panel button */}
            <div onClick={() => setShowingRightPanel(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="header-icons cursor-enabled"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M4.146 3.646a.5.5 0 0 0 0 .708L7.793 8l-3.647 3.646a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708 0zM11.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z" />
              </svg>
            </div>
          </div>
          <div className="header-tab" style={{ marginTop: "67.5px" }}>
            Info
            {/* more options button */}
            <span style={{ float: "right" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="header-icons cursor-enabled"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
              </svg>
            </span>
          </div>
          <div className="right-panel-info">
            {/* add INFO components here */}
          </div>
          <div className="header-tab">
            Notes
            {/* more options button */}
            <span style={{ float: "right" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="header-icons cursor-enabled"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
              </svg>
            </span>
          </div>
          <div className="right-panel-notes">
            {/* add NOTES components here */}
          </div>
          <div className="header-tab">
            Comments
            {/* more options button */}
            <span style={{ float: "right" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="header-icons cursor-enabled"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
              </svg>
            </span>
          </div>
          <div className="right-panel-coments">
            {/* add COMMENTS components here */}
          </div>
          <div
            className={
              windowDimension.winWidth > 1200
                ? "right-panel-textbox max-panel-width"
                : "right-panel-textbox medium-panel-width"
            }
          >
            {/* add INPUT FIELD for COMMENTS here */}
            comments input field
          </div>
        </div>

        <div
          className={
            windowDimension.winWidth > 1200
              ? "main-panel-grid max-margin"
              : "main-panel-grid medium-margin"
          }
          style={
            windowDimension.winWidth < 800
              ? { margin: "0px" }
              : !showingRightPanel
              ? { marginRight: "0px" }
              : {}
          }
        >
          {/* add MAIN CONTENT components here */}

          {/* if a file is selected, then load file here */}
          {currentFile ? (
            <FileContent
              currentFile={currentFile}
              setCurrentFile={setCurrentFile}
              windowDimension={windowDimension}
              showingRightPanel={showingRightPanel}
              textURL={textURL}
              setTextURL={setTextURL}
            />
          ) : (
            <FolderContent
              windowDimension={windowDimension}
              currentDirectory={currentDirectory}
              setCurrentDirectory={handleSetCurrentDirectory}
              explorerData={explorerData}
              setExplorerData={setExplorerData}
              showingRightPanel={showingRightPanel}
              setCurrentFile={setCurrentFile}
              explorer={explorer}
              loading={loading}
              setLoading={setLoading}
              pinSelected={pinSelected}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Student;

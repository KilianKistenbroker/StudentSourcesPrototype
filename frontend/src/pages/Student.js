import { useState } from "react";
import DirectoryTree from "../components/DirectoryTree";
import folderData from "../data/folderData";
import useTreeTraversal from "../hooks/useTreeTraversal";
import StudentSearch from "../components/StudentSearch";
import CurrentDirectory from "../components/CurrentDirectory";
import { useEffect } from "react";
import DropZone from "../components/DropZone";
import Sources from "./Sources";

const Student = ({ windowDimension }) => {
  // ----------- move to app.js later ------------ //

  const [explorerData, setExplorerData] = useState(folderData);
  const [currentDirectory, setCurrentDirectory] = useState(folderData);
  const [showingRightPanel, setShowingRightPanel] = useState(true);

  const { insertNode } = useTreeTraversal();
  const handleInsertNode = (folderId, item, isFolder) => {
    const finalTree = insertNode(explorerData, folderId, item, isFolder);
    setExplorerData(finalTree);
  };

  // ---------------------------------------------- //

  async function handleSetCurrentDirectory(event) {
    setCurrentDirectory(event);
  }

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="page">
      <StudentSearch
        currentDirectory={currentDirectory}
        windowDimension={windowDimension}
        showingRightPanel={showingRightPanel}
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
          className="header-icons"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M11.854 3.646a.5.5 0 0 1 0 .708L8.207 8l3.647 3.646a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708 0zM4.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 1 0v-13a.5.5 0 0 0-.5-.5z"
          />
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
                className="header-icons"
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
              setCurrentDirectory={handleSetCurrentDirectory}
              currentDirectory={currentDirectory}
              windowDimension={windowDimension}
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
                className="header-icons"
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
            {currentDirectory.name.toUpperCase()}

            {/* collapse right panel button */}
            <span
              style={{ float: "right" }}
              onClick={() => setShowingRightPanel(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="header-icons"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.146 3.646a.5.5 0 0 0 0 .708L7.793 8l-3.647 3.646a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708 0zM11.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z"
                />
              </svg>
            </span>
          </div>
          <div className="header-tab" style={{ marginTop: "67.5px" }}>
            Info
            {/* more options button */}
            <span style={{ float: "right" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="header-icons"
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
                className="header-icons"
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
                className="header-icons"
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
          <div
            className={
              windowDimension.winWidth > 1200
                ? "main-panel-content max-margin"
                : "main-panel-content medium-margin"
            }
          >
            {/* add MAIN CONTENT components here */}

            {/* display header */}
            <div className="box" style={{ overflow: "hidden" }}>
              <div
                className=""
                style={{
                  margin: "0px",
                  width: "150px",
                  padding: "5px",
                  fontSize: "16px",
                  overflow: "hidden",
                  color: "dimgray",
                  fontWeight: "bolder",
                }}
              >
                Name
              </div>

              <div
                style={{
                  margin: "0px",
                  padding: "5px",
                  fontSize: "16px",
                  overflow: "hidden",
                  color: "dimgray",
                  fontWeight: "bolder",
                }}
              >
                Pinned
              </div>

              <div
                style={{
                  margin: "0px",
                  padding: "5px",
                  fontSize: "16px",
                  overflow: "hidden",
                  color: "dimgray",
                  fontWeight: "bolder",
                }}
              >
                Visibility
              </div>
            </div>

            <CurrentDirectory currentDirectory={currentDirectory} />
          </div>

          <DropZone />

          <div
            className={
              windowDimension.winWidth > 1200
                ? "tiny-footer max-margin"
                : "tiny-footer medium-margin"
            }
            style={
              windowDimension.winWidth < 800 || !showingRightPanel
                ? { margin: "0px" }
                : {}
            }
          >
            {windowDimension.winWidth < 800 ? (
              <span
                style={{
                  float: "left",
                  color: "dimgrey",
                  fontSize: "18px",
                  fontWeight: "bolder",
                  paddingLeft: "20px",
                }}
              >
                {" "}
                {"<"} Back
              </span>
            ) : (
              ""
            )}
            {/* trashbin */}
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

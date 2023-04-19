import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DirectoryTree from "../components/DirectoryTree";
import folderData from "../data/folderData";
import useTreeTraversal from "../hooks/useTreeTraversal";
import StudentSearch from "../components/StudentSearch";
import FolderContent from "../components/FolderContent";
import FileContent from "../components/FileContent";
import { saveAs } from "file-saver";
import explorer from "../data/folderData";
import Comments from "../components/Comments";
import CommentBox from "../components/CommentBox";
import commentsData from "../data/commentsData";
import Notes from "../components/Notes";
import Info from "../components/Info";

const Student = ({
  data,
  windowDimension,
  owner,
  setOwner,
  explorerData,
  setExplorerData,
}) => {
  const navigate = useNavigate();

  // ----------- move to app.js later (maybe) ------------ //
  // const [explorerData, setExplorerData] = useState(folderData);
  const [currentDirectory, setCurrentDirectory] = useState(explorerData);
  const [showingRightPanel, setShowingRightPanel] = useState(true);
  const [currentFile, setCurrentFile] = useState(null);
  const [loading, setLoading] = useState(null);

  const [pinSelected, setPinSelected] = useState(false);
  const [format, setFormat] = useState("list");
  const [textURL, setTextURL] = useState("");

  const [notesData, setNotesData] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(commentsData);
  const [files, setFiles] = useState(null);
  const [loadingPDF, setLoadingPDF] = useState(null);
  const [scale, setScale] = useState({
    render: 1,
    width: 800,
    height: 500,
  });

  const [searchResults, setSearchResults] = useState([]);
  const [pdfController, setPdfController] = useState({
    currentPage: 0,
    pageLimit: 0,
  });

  const handleSetScale = (multiplier, state) => {
    if (state === "pdf") {
      const weight = 0.1;
      const temp = scale.render + weight * multiplier;
      if (temp < 0.5)
        setScale({
          render: 0.5,
          width: scale.width,
          height: scale.height,
        });
      else if (temp > 3) {
        setScale({
          render: 3,
          width: scale.width,
          height: scale.height,
        });
      } else {
        setScale({
          render: temp,
          width: scale.width,
          height: scale.height,
        });
      }
    } else {
      const weight1 = 100;
      const weight2 = 62.5;
      const temp1 = scale.width + weight1 * multiplier;
      const temp2 = scale.height + weight2 * multiplier;

      if (temp1 < 600)
        setScale({
          render: scale.render,
          width: 600,
          height: 375,
        });
      else if (temp1 > 1500) {
        setScale({
          render: scale.render,
          width: 1500,
          height: 937.5,
        });
      } else {
        setScale({
          render: scale.render,
          width: temp1,
          height: temp2,
        });
      }
    }
  };

  const { insertNode } = useTreeTraversal();
  const handleInsertNode = (name, type) => {
    const finalTree = insertNode(
      explorerData,
      currentDirectory,
      handleSetCurrentDirectory,
      setCurrentDirectory,
      setExplorerData,
      name,
      type
    );
  };

  useEffect(() => {
    if (!data.isLoggedIn) {
      data.currentPoint = "login";
      navigate("/login");
      return;
    }
  }, []);

  useEffect(() => {
    setPinSelected(false);
    // setCurrentFile(null);
    setSearchResults([]);
  }, [currentDirectory]);

  useEffect(() => {
    const element = document.documentElement;

    if (windowDimension.winWidth < 800 && showingRightPanel) {
      element.style.height = "100%";
      element.style.overflow = "hidden";
    } else {
      element.style.height = "";
      element.style.overflow = "";
    }
  }, [showingRightPanel, windowDimension.mobileMode]);

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
    parsingArr.shift(); // remove the first one
    if (parsingArr.length === 0) {
      return node;
    }
    for (let i = 0; i < node.items.length; i++) {
      if (node.items[i].name === parsingArr[0]) {
        const myNodeRef = parseTree(node.items[i], parsingArr, 0);
        return myNodeRef;
      }
    }
  };

  async function handleSetCurrentDirectory(node, pathname, state) {
    const temp = parseTree(node, pathname, state);
    setCurrentDirectory(temp);
  }

  const handleDownload = () => {
    if (currentFile.type === "txt") {
      const updatedContent = textURL;
      const blob = new Blob([updatedContent], {
        type: "text/plain;charset=utf-8",
      });

      saveAs(blob, currentFile.name);
    } else if (currentFile.type === "url") {
      const fileURL = currentFile.dataUrl;
      const fileURLParts = fileURL.split(",");
      const byteString = window.atob(fileURLParts[1]);

      console.log(byteString);

      const urlFileContent = `[InternetShortcut]\n${byteString}\n`;
      const blob = new Blob([urlFileContent], {
        type: "application/internet-shortcut",
      });

      const fileName = currentFile.name.endsWith(".url")
        ? currentFile.name
        : `${currentFile.name}.url`;

      saveAs(blob, fileName);
    } else if (
      [["jpeg", "jpg", "gif", "png", "pdf"].includes(currentFile.type)]
    ) {
      console.log(currentFile);
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
      saveAs(blob, currentFile.name);
    }
  };

  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const month = monthNames[monthIndex];

    return `${day} ${month} ${year}`;
  }

  const addComment = () => {
    //TODO: Instead of manipulating local data, use api's
    if (comment.trim(" ").length === 0) return;
    else {
      const commentsCopy = comments.slice();
      console.log(commentsCopy.length);
      commentsCopy.push({
        // id: commentsCopy.slice(-1).id + 1,
        commenterImage: "http://placekitten.com/50/50", // replace with avatar from db
        username: data.user,
        commentText: comment,
        date: formatDate(new Date()),
      });
      setComments(commentsCopy);
      setComment("");
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
        setFiles={setFiles}
        handleSetScale={handleSetScale}
        setSearchResults={setSearchResults}
        owner={owner}
        data={data}
        setOwner={setOwner}
        setExplorerData={setExplorerData}
      />

      <span
        style={{
          right: "0",
          position: "fixed",
          zIndex: "2",
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
              ? "left-panel-title max-panel-width2"
              : windowDimension.winWidth > 800
              ? "left-panel-title medium-panel-width2"
              : "left-panel-title min-left-panel"
          }
        >
          EXPLORER
        </div>
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

          <div
            className="left-panel-tree"
            style={owner.user !== data.user ? { height: "90%" } : {}}
          >
            <DirectoryTree
              handleInsertNode={handleInsertNode}
              explorer={explorerData}
              setCurrentDirectory={setCurrentDirectory}
              currentDirectory={currentDirectory}
              windowDimension={windowDimension}
              setCurrentFile={setCurrentFile}
              currentFile={currentFile}
              owner={owner}
              data={data}
            />
            {/* spacing */}
            <div
              style={
                owner.user === data.user
                  ? { height: "20px", width: "20px" }
                  : { height: "150px", width: "20px" }
              }
            >
              {" "}
            </div>
          </div>

          {owner.user === data.user && (
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
          )}
          {owner.user === data.user && (
            <div className="left-panel-chatbot">
              {/* add CHATBOT components here */}
            </div>
          )}
        </div>
        {owner.user === data.user && (
          <div
            className={
              windowDimension.winWidth > 1200
                ? "left-panel-textbox max-panel-width"
                : windowDimension.winWidth > 800
                ? "left-panel-textbox medium-panel-width"
                : "left-panel-textbox min-left-panel"
            }
          >
            {/* add INPUT FIELD for CHATBOT here */}
            chatbot input field
          </div>
        )}

        <div
          className={
            windowDimension.winWidth > 1200 && showingRightPanel
              ? "right-panel-title max-panel-width2"
              : showingRightPanel
              ? "right-panel-title medium-panel-width2"
              : "right-panel-title min-right-panel"
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

        <div
          className={
            windowDimension.winWidth > 1200 && showingRightPanel
              ? "right-panel-grid max-panel-width"
              : showingRightPanel
              ? "right-panel-grid medium-panel-width"
              : "right-panel-grid min-right-panel"
          }
        >
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
          <div
            className="right-panel-info"
            style={owner.user !== data.user ? { height: "19.5%" } : {}}
          >
            {/* add INFO components here */}
            <Info
              currentDirectory={currentDirectory}
              currentFile={currentFile}
            />
          </div>

          {owner.user === data.user && (
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
          )}
          {owner.user === data.user && (
            <div className="right-panel-notes">
              {/* add NOTES components here */}
              <Notes notesData={notesData} setNotesData={setNotesData} />
            </div>
          )}

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
          <div
            className="right-panel-coments"
            style={owner.user !== data.user ? { height: "58%" } : {}}
          >
            {/* add COMMENTS components here */}
            <Comments commentsData={comments} data={data} />
          </div>
        </div>

        <div
          className={
            windowDimension.winWidth > 1200 && showingRightPanel
              ? "right-panel-textbox max-panel-width"
              : showingRightPanel
              ? "right-panel-textbox medium-panel-width"
              : "right-panel-textbox min-right-panel"
          }
        >
          {/* add INPUT FIELD for COMMENTS here */}
          <CommentBox
            comment={comment}
            setComment={setComment}
            addComment={addComment}
          />
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
              scale={scale}
              owner={owner}
              data={data}
              pdfController={pdfController}
              setPdfController={setPdfController}
              setScale={setScale}
              loadingPDF={loadingPDF}
              setLoadingPDF={setLoadingPDF}
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
              files={files}
              setFiles={setFiles}
              searchResults={searchResults}
              setSearchResults={setSearchResults}
              owner={owner}
              data={data}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Student;

import CurrentDirectory from "./CurrentDirectory";
import DropZone from "./DropZone";
import Message from "./Window";
import TinyFooter from "./TinyFooter";
import Window from "./Window";
import { useState } from "react";

const FolderContent = ({
  windowDimension,
  currentDirectory,
  setCurrentDirectory,
  explorerData,
  setExplorerData,
  showingRightPanel,
  setCurrentFile,
  explorer,
  loading,
  setLoading,
  pinSelected,
  files,
  setFiles,
  searchResults,
  setSearchResults,
  owner,
  data,
  message,
  setMessage,
  showingLeftPanel,
  splashMsg,
  setSplashMsg,
}) => {
  const [tempFile, setTempFile] = useState({});

  const handleSetCurrentFile = async (file) => {
    await setCurrentFile(file);
  };

  return (
    <div style={{ marginTop: "150px" }}>
      {/* Add msg here */}

      {/* place search results here */}

      <div
        className={
          windowDimension.winWidth > 1200
            ? "main-panel-content max-margin"
            : "main-panel-content medium-margin"
        }
        style={{ marginTop: "50px" }}
      >
        <Window
          data={data}
          message={message}
          setMessage={setMessage}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          setCurrentDirectory={setCurrentDirectory}
          explorerData={explorerData}
          handleSetCurrentFile={handleSetCurrentFile}
          splashMsg={splashMsg}
          setSplashMsg={setSplashMsg}
          tempFile={tempFile}
        />
        {/* display header */}
        <div className="box box-hover" style={{ overflow: "hidden" }}>
          <div
            className=""
            style={{
              margin: "0px",
              width: "165px",
              padding: "5px",
              fontSize: "16px",
              overflow: "hidden",
              color: "#202020",
              fontWeight: "bolder",
            }}
          >
            Name
          </div>

          {owner.user === data.user && (
            <div
              style={{
                margin: "0px",
                padding: "5px",
                fontSize: "16px",
                overflow: "hidden",
                color: "#202020",
                fontWeight: "bolder",
              }}
            >
              Pinned
            </div>
          )}
          {owner.user === data.user && (
            <div
              style={{
                margin: "0px",
                padding: "5px",
                fontSize: "16px",
                overflow: "hidden",
                color: "#202020",
                fontWeight: "bolder",
                marginRight: "10px",
              }}
            >
              Visibility
            </div>
          )}
        </div>

        <CurrentDirectory
          currentDirectory={currentDirectory}
          setCurrentDirectory={setCurrentDirectory}
          setCurrentFile={setCurrentFile}
          explorerData={explorerData}
          setExplorerData={setExplorerData}
          pinSelected={pinSelected}
          owner={owner}
          data={data}
          message={message}
          setMessage={setMessage}
          setTempFile={setTempFile}
        />
      </div>
      {owner.user === data.user && (
        <DropZone
          explorerData={explorerData}
          currentDirectory={currentDirectory}
          setCurrentDirectory={setCurrentDirectory}
          setExplorerData={setExplorerData}
          loading={loading}
          setLoading={setLoading}
          files={files}
          setFiles={setFiles}
          setMessage={setMessage}
          setSplashMsg={setSplashMsg}
        />
      )}

      <TinyFooter
        windowDimension={windowDimension}
        showingRightPanel={showingRightPanel}
        owner={owner}
        data={data}
        message={message}
        setMessage={setMessage}
        showingLeftPanel={showingLeftPanel}
      />
    </div>
  );
};

export default FolderContent;

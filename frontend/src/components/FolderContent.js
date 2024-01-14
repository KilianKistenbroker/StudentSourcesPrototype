import CurrentDirectory from "./CurrentDirectory";
import DropZone from "./DropZone";
import Window from "./Window";

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
  tempFile,
  setTempFile,
  handleMoveFile,
  setTrashItems,
  setLoadingBar,
}) => {
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
          windowDimension={windowDimension}
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

          <div></div>

          {/* {owner.user === data.user && (
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
          )} */}
          {owner.user === data.user && (
            <div
              style={{
                margin: "0px",
                padding: "5px",
                fontSize: "16px",
                overflow: "hidden",
                color: "#202020",
                fontWeight: "bolder",
                marginRight: "15px",
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
          tempFile={tempFile}
          handleMoveFile={handleMoveFile}
          setSplashMsg={setSplashMsg}
          setLoadingBar={setLoadingBar}
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
          tempFile={tempFile}
          setTempFile={setTempFile}
          handleMoveFile={handleMoveFile}
          data={data}
          owner={owner}
          setLoadingBar={setLoadingBar}
        />
      )}

      {/* <TinyFooter
        windowDimension={windowDimension}
        showingRightPanel={showingRightPanel}
        owner={owner}
        data={data}
        message={message}
        setMessage={setMessage}
        showingLeftPanel={showingLeftPanel}
      /> */}
    </div>
  );
};

export default FolderContent;

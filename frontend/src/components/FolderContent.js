import CurrentDirectory from "./CurrentDirectory";
import DropZone from "./DropZone";
import Message from "./Window";
import TinyFooter from "./TinyFooter";
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
        {/* {searchResults.length > 0 ? (
          <div className="search-results show-message">
            <div
              style={{
                backgroundColor: "#3d3d3d",
                padding: "10px",
                borderTopLeftRadius: "5px",
                borderTopRightRadius: "5px",
                display: "grid",
                gridTemplateColumns: "repeat(2, auto)",
              }}
            >
              <b style={{ color: "#fafafa", paddingLeft: "5px" }}>
                Search Results ~
              </b>
              <span style={{ justifySelf: "right" }}>
                <div
                  className="header-icons cursor-enabled exit"
                  onClick={() => setSearchResults([])}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z" />
                  </svg>
                </div>
              </span>
            </div>
            <div
              style={{ padding: "20px", overflow: "scroll", height: "170px" }}
            >
              {searchResults.map((loadData, index) => (
                <div className="" key={index}>
                  <div
                    className="main-panel-filename cursor-enabled"
                    style={{ width: "fit-content" }}
                    onClick={
                      loadData.type === "Folder"
                        ? () =>
                            setCurrentDirectory(
                              explorerData,
                              loadData.pathname,
                              -1
                            )
                        : // change below func to display file contents
                          () => {
                            handleSetCurrentFile(loadData);
                          }
                    }
                  >
                    <b>Location:</b> {loadData.pathname}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="search-results hide-window"></div>
        )} */}
        <Window
          data={data}
          message={message}
          setMessage={setMessage}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          setCurrentDirectory={setCurrentDirectory}
          explorerData={explorerData}
          handleSetCurrentFile={handleSetCurrentFile}
        />
        {/* display header */}
        <div className="box" style={{ overflow: "hidden" }}>
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

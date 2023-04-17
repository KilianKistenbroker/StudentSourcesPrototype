import CurrentDirectory from "./CurrentDirectory";
import DropZone from "./DropZone";
import TinyFooter from "./TinyFooter";

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
}) => {
  return (
    <div>
      <div
        className={
          windowDimension.winWidth > 1200
            ? "main-panel-content max-margin"
            : "main-panel-content medium-margin"
        }
      >
        {/* place search results here */}
        {searchResults.length > 0 && (
          <div className="search-results">
            <div
              style={{
                backgroundColor: "dimgrey",
                padding: "10px",
                borderTopLeftRadius: "5px",
                borderTopRightRadius: "5px",
              }}
            >
              <b style={{ color: "whitesmoke" }}> Results:</b>
              <span style={{ float: "right" }}>
                <div
                  className="header-icons cursor-enabled"
                  style={{ color: "whitesmoke" }}
                  onClick={() => setSearchResults([])}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
                  </svg>
                </div>
              </span>
            </div>
            <div style={{ padding: "20px" }}>
              {searchResults.map((loadData, index) => (
                <div className="box" style={{ overflow: "hidden" }} key={index}>
                  <div
                    className="main-panel-filename cursor-enabled"
                    style={{ width: "100%" }}
                    onClick={
                      loadData.type === "folder"
                        ? () =>
                            setCurrentDirectory(
                              explorerData,
                              loadData.pathname,
                              -1
                            )
                        : // change below func to display file contents
                          () => setCurrentFile(loadData)
                    }
                  >
                    <b>Location:</b> {loadData.pathname}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* display header */}
        <div className="box" style={{ overflow: "hidden" }}>
          <div
            className=""
            style={{
              margin: "0px",
              width: "180px",
              padding: "5px",
              fontSize: "16px",
              overflow: "hidden",
              color: "dimgray",
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
                color: "dimgray",
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
                color: "dimgray",
                fontWeight: "bolder",
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
      />
    </div>
  );
};

export default FolderContent;

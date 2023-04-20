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
    <div style={{ marginTop: "150px" }}>
      {/* place search results here */}
      {searchResults.length > 0 && (
        <div className="search-results">
          <div
            style={{
              backgroundColor: "#3d3d3d",
              padding: "10px",
              borderTopLeftRadius: "5px",
              borderTopRightRadius: "5px",
            }}
          >
            <b style={{ color: "#fafafa", paddingLeft: "5px" }}>
              Search Results ~
            </b>
            <span style={{ float: "right" }}>
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

                {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
                  </svg> */}
              </div>
            </span>
          </div>
          <div style={{ padding: "20px", overflow: "scroll" }}>
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

      <div
        className={
          windowDimension.winWidth > 1200
            ? "main-panel-content max-margin"
            : "main-panel-content medium-margin"
        }
        style={{ marginTop: "50px" }}
      >
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
        owner={owner}
        data={data}
      />
    </div>
  );
};

export default FolderContent;

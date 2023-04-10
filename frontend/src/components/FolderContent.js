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

        <CurrentDirectory
          currentDirectory={currentDirectory}
          setCurrentDirectory={setCurrentDirectory}
          setCurrentFile={setCurrentFile}
        />
      </div>

      <DropZone
        explorerData={explorerData}
        currentDirectory={currentDirectory}
        setCurrentDirectory={setCurrentDirectory}
        setExplorerData={setExplorerData}
      />

      <TinyFooter
        windowDimension={windowDimension}
        showingRightPanel={showingRightPanel}
      />
    </div>
  );
};

export default FolderContent;

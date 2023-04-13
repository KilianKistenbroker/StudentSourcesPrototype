import { useEffect } from "react";

const CurrentDirectory = ({
  currentDirectory,
  setCurrentDirectory,
  setCurrentFile,
}) => {
  return currentDirectory.items.map((loadData, index) => (
    // <div> {loadData.name} </div>
    <div className="box" style={{ overflow: "hidden" }} key={index}>
      {/* file type and file name */}
      <div
        className="main-panel-filename cursor-enabled"
        onClick={
          loadData.type === "folder"
            ? () => setCurrentDirectory(loadData)
            : // change below func to display file contents
              () => setCurrentFile(loadData)
        }
      >
        {loadData.type === "folder" ? (
          <span style={{ marginRight: "5px" }}>📁</span>
        ) : (
          <span style={{ marginRight: "5px" }}>
            {["jpeg", "jpg", "gif", "png"].includes(loadData.type)
              ? "🖼️"
              : "txt" === loadData.type
              ? "📑"
              : "pdf" === loadData.type
              ? "📖"
              : "mp4" === loadData.type
              ? "📺"
              : "💀"}
          </span>
        )}
        {loadData.name}
      </div>
      {/* pinned icon */}
      <div className="box-star">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="header-icons cursor-enabled"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146zm.122 2.112v-.002.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a4.507 4.507 0 0 0-.288-.076 4.922 4.922 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a4.924 4.924 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034.114 0 .23-.011.343-.04L9.927 2.028c-.029.113-.04.23-.04.343a1.779 1.779 0 0 0 .062.46z" />
        </svg>
      </div>

      <div style={{ display: "flex", width: "70px", marginLeft: "5px" }}>
        <div className="box-star">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="header-icons cursor-enabled"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM2.04 4.326c.325 1.329 2.532 2.54 3.717 3.19.48.263.793.434.743.484-.08.08-.162.158-.242.234-.416.396-.787.749-.758 1.266.035.634.618.824 1.214 1.017.577.188 1.168.38 1.286.983.082.417-.075.988-.22 1.52-.215.782-.406 1.48.22 1.48 1.5-.5 3.798-3.186 4-5 .138-1.243-2-2-3.5-2.5-.478-.16-.755.081-.99.284-.172.15-.322.279-.51.216-.445-.148-2.5-2-1.5-2.5.78-.39.952-.171 1.227.182.078.099.163.208.273.318.609.304.662-.132.723-.633.039-.322.081-.671.277-.867.434-.434 1.265-.791 2.028-1.12.712-.306 1.365-.587 1.579-.88A7 7 0 1 1 2.04 4.327Z" />
          </svg>
        </div>
        <div className="box-star">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="header-icons cursor-enabled"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          </svg>
        </div>
      </div>
    </div>
  ));
};

export default CurrentDirectory;

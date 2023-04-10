import React, { useState } from "react";
import readDroppedFiles from "../helpers/readDroppedFiles";
// import { Document, Page, pdfjs } from "react-pdf";
// import "pdfjs-dist/web/pdf_viewer.css";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DropZone = ({
  explorerData,
  currentDirectory,
  setCurrentDirectory,
  setExplorerData,
}) => {
  const [folderJson, setFolderJson] = useState(null);
  const [pdfDataUrl, setPdfDataUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [imgURL, setImgURL] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [textURL, setTextURL] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);

    setDragOver(false);

    const objArr = await readDroppedFiles(e.dataTransfer.items);
    // setFolderJson(json);

    // --- this will update and sort global currDir --- //

    for (let i = 0; i < objArr.length; i++) {
      if (currentDirectory.items.some((item) => item.name === objArr[i].name)) {
        // prompt skip or replace b/c merge is too hard to code :/
      } else {
        currentDirectory.items.push(objArr[i]);
      }
    }

    currentDirectory.items.sort((a, b) => {
      let fa = a.name.toLowerCase(),
        fb = b.name.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });

    let tempCurrDir = JSON.parse(JSON.stringify(currentDirectory));
    let tempExplorer = JSON.parse(JSON.stringify(explorerData));

    setCurrentDirectory(tempCurrDir);
    setExplorerData(tempExplorer);

    setLoading(false);

    // send req to backend to sync files in cloud

    // check contents of dropped items
    console.log("from fdz");
    console.log(objArr);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragOver(true);

    e.dataTransfer.dropEffect = "copy";
  };

  const renderNode = (node) => {
    if (node.type !== "folder") {
      return (
        <div
          key={node.name}
          onClick={() => {
            if (["jpeg", "jpg", "gif", "png"].includes(node.type)) {
              setImgURL(node.dataUrl);
            } else if ("pdf" === node.type) {
              setPdfDataUrl(node.dataUrl);
            } else if ("txt" === node.type) {
              const txtContent = window.atob(node.dataUrl.split(",")[1]);
            } else if ("mp4" === node.type) {
              const videoData = window.atob(node.dataUrl.split(",")[1]);
              const byteArray = new Uint8Array(videoData.length);
              for (let i = 0; i < videoData.length; i++) {
                byteArray[i] = videoData.charCodeAt(i);
              }
              const blob = new Blob([byteArray.buffer], { type: "video/mp4" });
              setVideoURL(URL.createObjectURL(blob));
            }
          }}
        >
          {node.name}
        </div>
      );
    } else if (node.type === "folder") {
      return (
        <div key={node.name}>
          <div>{node.name}</div>
          <div style={{ paddingLeft: "20px" }}>
            {node.items.map(renderNode)}
          </div>
        </div>
      );
    }
  };

  const renderAllPages = (scale = 1) => {
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      //   pages.push(<Page key={`page_${i}`} pageNumber={i} scale={scale} />);
    }
    return pages;
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "60px",
          color: "dimgrey",
          fontSize: "22px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <>
      {dragOver ? (
        <div
          className={"dropzone dragging"}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragExit={() => setDragOver(false)}
        >
          Drop files here to upload
        </div>
      ) : (
        <div className={"dropzone"} onDragOver={handleDragOver}>
          {/* no rendering here */}

          {/* {folderJson && renderNode(folderJson)} */}
        </div>
      )}
    </>
  );
};

export default DropZone;

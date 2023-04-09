import React, { useState } from "react";
import readDroppedFiles from "../helpers/readDroppedFiles";
// import { Document, Page, pdfjs } from "react-pdf";
// import "pdfjs-dist/web/pdf_viewer.css";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DropZone = ({ folderData }) => {
  const [folderJson, setFolderJson] = useState(null);
  const [pdfDataUrl, setPdfDataUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [imgURL, setImgURL] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [textURL, setTextURL] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragOver(false);

    const json = await readDroppedFiles(e.dataTransfer.items);
    setFolderJson(json);

    console.log("from fdz");
    console.log(json);
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

  return (
    <div
      className={dragOver ? "dropzone dragging" : "dropzone"}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragExit={() => setDragOver(false)}
    >
      {folderJson && renderNode(folderJson)}
    </div>
  );
};

export default DropZone;

import { useState } from "react";
import TinyFooter from "./TinyFooter";
import { useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "pdfjs-dist/web/pdf_viewer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const FileContent = ({
  windowDimension,
  currentFile,
  setCurrentFile,
  showingRightPanel,
  textURL,
  setTextURL,
}) => {
  const [numPages, setNumPages] = useState(null);
  const [videoURL, setVideoURL] = useState(null);

  useEffect(() => {
    if (!currentFile) return;
    else if (currentFile.type === "txt") {
      let temp = "";
      try {
        temp = window.atob(currentFile.dataUrl.split(",")[1]);
        setTextURL(temp);
      } catch (err) {
        console.log(
          "ERROR: could not decode: " +
            currentFile.name +
            "." +
            currentFile.type
        );
        console.log(err);
        setTextURL("");
      }
    } else if (currentFile.type === "mp4") {
      try {
        // convert to streaming data from backend.

        const videoData = window.atob(currentFile.dataUrl.split(",")[1]);
        const byteArray = new Uint8Array(videoData.length);
        for (let i = 0; i < videoData.length; i++) {
          byteArray[i] = videoData.charCodeAt(i);
        }
        const blob = new Blob([byteArray.buffer], { type: "video/mp4" });
        setVideoURL(URL.createObjectURL(blob)); // this is for rendering the video
        setTextURL(URL.createObjectURL(blob)); // this  is for downloading the video
      } catch (err) {
        console.log(
          "ERROR: could not decode: " +
            currentFile.name +
            "." +
            currentFile.type
        );
        console.log(err);
        setTextURL("");
      }
    }
  }, [currentFile]);

  const renderAllPages = (scale = 1) => {
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      pages.push(<Page key={`page_${i}`} pageNumber={i} scale={scale} />);
    }
    return pages;
  };

  const handleSaveChanges = () => {
    let temp = "application/octet-stream;base64," + window.btoa(textURL);
    currentFile.dataUrl = temp;
  };

  return (
    <div className={"main-panel-content"} style={{ maxWidth: "800px" }}>
      {["jpeg", "jpg", "gif", "png"].includes(currentFile.type) ? (
        <img
          src={currentFile.dataUrl}
          style={{ width: "100%", borderRadius: "2px" }}
        ></img>
      ) : "txt" === currentFile.type ? (
        <textarea
          onBlur={() => handleSaveChanges()}
          style={{
            width: "100%",
            height: "55vh",
            marginBottom: "100px",
            border: "1px solid lightgrey",
            borderRadius: "2px",
            color: "dimgray",
          }}
          value={textURL}
          onChange={(e) => setTextURL(e.target.value)}
        ></textarea>
      ) : "pdf" === currentFile.type ? (
        <Document
          file={currentFile.dataUrl}
          onLoadSuccess={({ numPages }) => {
            console.log(`PDF loaded with ${numPages} pages.`);

            // load more when user scrolls near bottom of page
            setNumPages(20);
          }}
        >
          {renderAllPages(1.75)}
        </Document>
      ) : "mp4" === currentFile.type ? (
        <video
          src={videoURL}
          style={{ width: "100%", padding: "10px" }}
          controls
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        "💀"
      )}

      <TinyFooter
        windowDimension={windowDimension}
        showingRightPanel={showingRightPanel}
      />
    </div>
  );
};

export default FileContent;

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
  const [scale, setScale] = useState(1);
  const [containerStyle, setContainerStyle] = useState({});

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (currentFile && currentFile.type === "txt") {
      let temp = "";
      try {
        console.log("recieved txt file");
        console.log(currentFile.dataUrl);

        temp = window.atob(currentFile.dataUrl.split(",")[1]);
        setTextURL(temp);
      } catch (err) {
        console.log("ERROR: could not decode this");
        setTextURL(currentFile.dataUrl);
      }
    }
  }, [currentFile]);

  const handleResize = () => {
    const newScale = Math.max(window.innerWidth / 880, 0);
    if (newScale > 0.95) {
      setContainerStyle({
        transform: `scale(${0.95})`,
        transformOrigin: "0 0",
      });
    } else {
      setContainerStyle({
        transform: `scale(${newScale})`,
        transformOrigin: "0 0",
      });
    }
  };

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
    console.log("saved these changes");
    console.log(currentFile.dataUrl);
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
        <div style={containerStyle}>
          <Document
            file={currentFile.dataUrl}
            onLoadSuccess={({ numPages }) => {
              console.log(`PDF loaded with ${numPages} pages.`);

              // load more when user scrolls near bottom of page
              setNumPages(50);
            }}
          >
            {renderAllPages(1.75)}
          </Document>
        </div>
      ) : "mp4" === currentFile.type ? (
        "📺"
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

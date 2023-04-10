import { useState } from "react";
import TinyFooter from "./TinyFooter";
import { useEffect } from "react";
import { saveAs } from "file-saver";

const FileContent = ({
  windowDimension,
  currentFile,
  setCurrentFile,
  showingRightPanel,
}) => {
  const [textURL, setTextURL] = useState("");

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

  //   Downloads file from file viewer
  const handleDownload = () => {
    if (currentFile.type === "txt") {
      const updatedContent = textURL;
      const blob = new Blob([updatedContent], {
        type: "text/plain;charset=utf-8",
      });

      saveAs(blob, currentFile.name + "." + currentFile.type);
    } else if ([["jpeg", "jpg", "gif", "png"].includes(currentFile.type)]) {
      const imgURL = currentFile.dataUrl;
      const imgDataUrlParts = imgURL.split(",");
      const byteString = window.atob(imgDataUrlParts[1]);
      const mimeString = imgDataUrlParts[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([ab], { type: mimeString });
      saveAs(blob, currentFile.name + "." + currentFile.type);
    }
  };

  const handleSaveChanges = () => {
    let temp = "application/octet-stream;base64," + window.btoa(textURL);
    currentFile.dataUrl = temp;
    console.log("saved these changes");
    console.log(currentFile.dataUrl);
  };

  return (
    <div className={"main-panel-content"} style={{ maxWidth: "800px" }}>
      <div
        className="selection nested nested-content "
        style={{
          marginTop: "-50px",
          float: "right",
          width: "fit-content",
        }}
        onClick={() => handleDownload()}
      >
        Download
      </div>

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
        "📖"
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

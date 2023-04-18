import TinyFooter from "./TinyFooter";
import { useEffect, useState } from "react";
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
  scale,
  owner,
  data,
  // pdfController,
  // setPdfController,
}) => {
  const [numPages, setNumPages] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [videoType, setVideoType] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(null);

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
    } else if (["mp4", "mov"].includes(currentFile.type)) {
      try {
        // convert to streaming data from backend.

        const videoData = window.atob(currentFile.dataUrl.split(",")[1]);
        const byteArray = new Uint8Array(videoData.length);
        for (let i = 0; i < videoData.length; i++) {
          byteArray[i] = videoData.charCodeAt(i);
        }
        let blob = null;
        if (currentFile.type === "mp4")
          blob = new Blob([byteArray.buffer], { type: "video/mp4" });
        else blob = new Blob([byteArray.buffer], { type: "video/mov" });

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
    } else if (currentFile.type === "mp3") {
      try {
        const audioData = window.atob(currentFile.dataUrl.split(",")[1]);
        const byteArray = new Uint8Array(audioData.length);
        for (let i = 0; i < audioData.length; i++) {
          byteArray[i] = audioData.charCodeAt(i);
        }
        const blob = new Blob([byteArray.buffer], { type: "audio/mp3" });
        setAudioURL(URL.createObjectURL(blob)); // this is for rendering the audio
        setTextURL(URL.createObjectURL(blob)); // this is for downloading the audio
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
    } else if (currentFile.type === "url") {
      try {
        const urlData = window.atob(currentFile.dataUrl.split(",")[1]);
        const urlContent = urlData
          .split("\n")
          .find((line) => line.startsWith("URL="));
        if (urlContent) {
          const url = urlContent.replace("URL=", "").trim();
          setTextURL(url);

          const youtubeId = getYoutubeVideoId(url);
          const vimeoId = getVimeoVideoId(url);
          if (youtubeId) {
            setVideoType("youtube");
            setVideoId(youtubeId);
          } else if (vimeoId) {
            setVideoType("vimeo");
            setVideoId(vimeoId);
          } else {
            setVideoType(null);
            setVideoId(null);
          }
        } else {
          setTextURL("");
        }
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

  const getYoutubeVideoId = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getVimeoVideoId = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // update to load a parameter of pages that updates with a scroll listener
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

  const loadPages = (numPages) => {
    if (numPages > 20) return 20;
    else return numPages;
  };

  if (loading) {
    return <div className={"main-panel-content"}>Loading...</div>;
  }

  return (
    <div
      className={"main-panel-content"}
      style={{ maxWidth: `${scale}px`, height: "600px" }}
    >
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
            setNumPages(() => loadPages(numPages));
            // setPdfController({
            //   currentPage: 1,
            //   pageLimit: numPages,
            // });
          }}
        >
          {/* {<Page pageNumber={pdfController.currentPage} scale={3} />} */}
          {renderAllPages(3)}
        </Document>
      ) : "mp4" === currentFile.type || "mov" === currentFile.type ? (
        <video
          src={videoURL}
          style={{ width: "100%", padding: "10px" }}
          controls
        >
          Your browser does not support the video tag.
        </video>
      ) : "mp3" === currentFile.type ? (
        <audio
          src={audioURL}
          style={{ width: "100%", padding: "10px" }}
          controls
        >
          Your browser does not support the audio tag.
        </audio>
      ) : "url" === currentFile.type ? (
        videoType === "youtube" && videoId ? (
          <iframe
            title="YouTube Video"
            style={{ width: "100%", height: "100%", marginBottom: "100px" }}
            src={`https://www.youtube.com/embed/${videoId}`}
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        ) : videoType === "vimeo" && videoId ? (
          <iframe
            title="Vimeo Video"
            style={{ width: "100%", height: "100%", marginBottom: "100px" }}
            src={`https://player.vimeo.com/video/${videoId}`}
            allow="autoplay; fullscreen"
            allowFullScreen
          ></iframe>
        ) : (
          <div>
            <p>
              URL Shortcut:{" "}
              <a href={textURL} target="_blank" rel="noreferrer">
                {textURL}
              </a>
            </p>
          </div>
        )
      ) : (
        "💀"
      )}

      <TinyFooter
        windowDimension={windowDimension}
        showingRightPanel={showingRightPanel}
        owner={owner}
        data={data}
        // pdfController={pdfController}
        // currentFile={currentFile}
        // setPdfController={setPdfController}
      />
    </div>
  );
};

export default FileContent;

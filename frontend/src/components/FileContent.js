import TinyFooter from "./TinyFooter";
import { useEffect, useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "pdfjs-dist/web/pdf_viewer.css";
import Window from "./Window";
import axios from "../api/axios";
import uploadFile from "../helpers/uploadFile";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const FileContent = ({
  windowDimension,
  currentFile,
  setCurrentFile,
  showingRightPanel,
  scale,
  owner,
  data,
  pdfController,
  setPdfController,
  setScale,
  message,
  setMessage,
  showingLeftPanel,
  loadingBar,
  setLoadingBar,
  dataUrl,
  setDataUrl,
  videoSrc,
  setVideoSrc,
}) => {
  const [numPages, setNumPages] = useState(null);
  const [videoType, setVideoType] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDataUrl(null);
    if (!currentFile) {
      return;
    } else if (currentFile.type === "txt") {
      getFileData().then((res) => {
        console.log("res: ");
        console.log(res);
        setDataUrl(res);
        setLoading(false);
      });
    } else if (["mp4", "mov"].includes(currentFile.type)) {
      try {
        const adjustedKey = currentFile.id + "." + currentFile.type;
        setVideoSrc(`http://54.219.131.2:8080/streamVideo/${adjustedKey}`);
        setLoading(false);
      } catch (err) {
        console.log(
          "ERROR: could not decode: " +
            currentFile.name +
            "." +
            currentFile.type
        );
        console.log(err);
      }
    } else if (currentFile.type === "mp3") {
      try {
        getFileData().then((res) => {
          setDataUrl(res);
          setLoading(false);
        });
      } catch (err) {
        console.log(
          "ERROR: could not decode: " +
            currentFile.name +
            "." +
            currentFile.type
        );
        console.log(err);
      }
    } else if (currentFile.type === "url") {
      try {
        const urlData = window.atob(currentFile.dataUrl.split(",")[1]);
        const urlContent = urlData
          .split("\n")
          .find((line) => line.startsWith("URL="));
        if (urlContent) {
          const url = urlContent.replace("URL=", "").trim();
          setDataUrl(url);

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
        }
        setLoading(false);
      } catch (err) {
        console.log(
          "ERROR: could not decode: " +
            currentFile.name +
            "." +
            currentFile.type
        );
        console.log(err);
      }
    } else if (currentFile.type === "pdf") {
      // get pdf file

      getFileData().then((res) => {
        setDataUrl(res);

        setScale({
          render: windowDimension.winWidth / 1050,
          width: 1500,
          height: scale.height,
        });

        setLoading(false);
      });
    } else if (["jpeg", "jpg", "gif", "png"].includes(currentFile.type)) {
      getFileData().then((res) => {
        setDataUrl(res);
        setLoading(false);
      });
    }
  }, [currentFile]);

  const handlePageManager = (num) => {
    const temp = pdfController.currentPage + num;
    if (temp > pdfController.pageLimit || temp < 1) {
      return;
    } else {
      setPdfController({
        currentPage: temp,
        pageLimit: pdfController.pageLimit,
      });
      window.scrollTo(0, 0);
    }
  };

  const getFileData = async () => {
    try {
      const key = currentFile.id + "." + currentFile.type;
      const res = await axios.get(`downloadFile/${key}`, {
        responseType: "arraybuffer",
      });

      const blob = new Blob([res.data]);

      if (currentFile.type === "txt") {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsText(blob);
        });
      } else {
        const url = URL.createObjectURL(blob);
        return url;
      }
    } catch (error) {
      console.log(error);
      const res = await insertTxtFile(`${currentFile.dataUrl}`);
      if (res === -1) {
        console.log("Failed to upload new file");
      }
      return currentFile.dataUrl;
    }
  };

  const insertTxtFile = async (dataUrl) => {
    try {
      // insert txt file into s3 bucket
      console.log("Inserting new file");

      const updatedContent =
        "application/octet-stream;base64," + window.btoa(dataUrl);
      const fileURLParts = updatedContent.split(",");
      const byteString = window.atob(fileURLParts[1]);

      const blob = new Blob([byteString], {
        type: "text/plain;charset=utf-8",
      });

      // Create a File object from the Blob
      const file = new File([blob], `${currentFile.name}`, {
        type: "text/plain",
        lastModified: new Date(),
      });

      const res = await uploadFile(
        currentFile.id,
        file,
        setLoadingBar,
        currentFile.pathname,
        data
      );

      setLoadingBar({
        filename: null,
        progress: null,
        pathname: null,
      });
      return res;
    } catch (error) {
      console.log("Could not insert in bucket");
      console.log(error);
    }
  };

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

  const handleSaveChanges = async () => {
    let temp = "application/octet-stream;base64," + window.btoa(dataUrl);
    currentFile.dataUrl = temp;

    const res = await insertTxtFile(dataUrl);
  };

  if (loading) {
    return <div className={"main-panel-content"}>Getting file...</div>;
  }

  return (
    <div
      className={"main-panel-content"}
      style={{ maxWidth: `${scale.width}px` }}
    >
      <Window data={data} message={message} setMessage={setMessage} />

      <div className="background"></div>
      <div
        className=""
        style={{
          height: `${scale.height}px`,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          padding: "10px",
        }}
      >
        {["jpeg", "jpg", "gif", "png"].includes(currentFile.type) ? (
          <img
            src={dataUrl}
            style={{ width: "auto", borderRadius: "2px" }}
          ></img>
        ) : "txt" === currentFile.type ? (
          <textarea
            autoFocus
            spellCheck={false}
            onBlur={
              data.user === owner.user ? () => handleSaveChanges() : () => {}
            }
            readOnly={data.user !== owner.user}
            style={{
              width: "100%",
              height: "100%",
              marginBottom: "100px",
              border: "none",
              borderRadius: "2px",
              color: "dimgray",
            }}
            value={dataUrl}
            onChange={(e) => setDataUrl(e.target.value)}
          />
        ) : "pdf" === currentFile.type ? (
          <div>
            {/* pdf controller */}
            <div
              className={
                windowDimension.winWidth > 1200
                  ? "pdf-controller max-margin"
                  : "pdf-controller min-margin"
              }
              style={
                windowDimension.winWidth < 800 ||
                (!showingRightPanel && !showingLeftPanel)
                  ? { margin: "0px" }
                  : windowDimension.winWidth > 800 && !showingRightPanel
                  ? { marginRight: "0" }
                  : windowDimension.winWidth > 800 && !showingLeftPanel
                  ? { marginLeft: "0" }
                  : {}
              }
            >
              <div
                style={{ float: "left" }}
                onClick={() => handlePageManager(-1)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="pdf-button"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                </svg>
              </div>
              <div
                style={{ float: "right" }}
                onClick={() => handlePageManager(1)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="pdf-button"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </div>
            </div>

            {dataUrl && (
              <Document
                file={dataUrl}
                onLoadSuccess={({ numPages }) => {
                  console.log(`PDF loaded with ${numPages} pages.`);
                  setNumPages(numPages);
                  setPdfController({
                    currentPage: 1,
                    pageLimit: numPages,
                  });
                }}
              >
                <div className="pdfPlaceholder"></div>
                <Page
                  loading={""}
                  renderMode="svg"
                  pageNumber={pdfController.currentPage}
                  scale={scale.render}
                />
              </Document>
            )}
          </div>
        ) : "mp4" === currentFile.type || "mov" === currentFile.type ? (
          <video
            controlsList="nodownload"
            src={videoSrc}
            type={`video/${currentFile.type}`}
            style={{ width: "100%", padding: "10px" }}
            controls
          >
            Your browser does not support the video tag.
          </video>
        ) : "mp3" === currentFile.type ? (
          <audio
            src={dataUrl}
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
                <a href={dataUrl} target="_blank" rel="noreferrer">
                  {dataUrl}
                </a>
              </p>
            </div>
          )
        ) : (
          "Unsupported File"
        )}
      </div>

      {/* {loadingPDF && (
        <div className="loadingScreen">
        </div>
      )} */}

      <TinyFooter
        windowDimension={windowDimension}
        showingRightPanel={showingRightPanel}
        owner={owner}
        data={data}
        pdfController={pdfController}
        currentFile={currentFile}
        setPdfController={setPdfController}
        setMessage={setMessage}
        showingLeftPanel={showingLeftPanel}
        loadingBar={loadingBar}
      />
    </div>
  );
};

export default FileContent;

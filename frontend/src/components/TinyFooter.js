import handleDrop from "../helpers/handleDrop";
import handleDragOver from "../helpers/handleDrag";
import { useState } from "react";

const TinyFooter = ({
  windowDimension,
  showingRightPanel,
  owner,
  data,
  // pdfController,
  currentFile,
  // setPdfController,
  // message,
  setMessage,
  showingLeftPanel,
  showTrash,
  setShowTrash,
  setTrashItems,
  trashItems,
  handleMoveFile,
  tempFile,
  explorerData,
  setSplashMsg,
}) => {
  // const handlePageManager = (num) => {
  //   // setLoadingPDF(true);
  //   const temp = pdfController.currentPage + num;
  //   if (temp > pdfController.pageLimit || temp < 1) {
  //     return;
  //   } else {
  //     setPdfController({
  //       currentPage: temp,
  //       pageLimit: pdfController.pageLimit,
  //     });
  //   }
  // };

  const [dragOver, setDragOver] = useState(false);
  const [moveEffect, setMoveEffect] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div
      className={
        windowDimension.winWidth > 1200 && currentFile
          ? "tiny-footer max-margin tiny-footer-hide"
          : currentFile
          ? "tiny-footer medium-margin tiny-footer-hide"
          : windowDimension.winWidth > 1200
          ? "tiny-footer max-margin tiny-footer-show"
          : "tiny-footer medium-margin tiny-footer-show"
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
      {/* trashbin */}
      {owner.user === data.user && !showTrash ? (
        <svg
          onDrop={(e) =>
            handleDrop(
              e,
              trashItems,
              setDragOver,
              setMoveEffect,
              handleMoveFile,
              setLoading,
              tempFile,
              explorerData,
              setMessage,
              setSplashMsg,
              data,
              owner
            )
          }
          onDragOver={(e) =>
            handleDragOver(
              e,
              tempFile,
              trashItems,
              setMoveEffect,
              setDragOver,
              data,
              owner
            )
          }
          onClick={() => setShowTrash(true)}
          xmlns="http://www.w3.org/2000/svg"
          className="header-icons cursor-enabled"
          style={{
            width: "30px",
            height: "30px",
            marginTop: "5px",
            justifySelf: "right",
          }}
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M14 3a.702.702 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225A.703.703 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2zM3.215 4.207l1.493 8.957a1 1 0 0 0 .986.836h4.612a1 1 0 0 0 .986-.836l1.493-8.957C11.69 4.689 9.954 5 8 5c-1.954 0-3.69-.311-4.785-.793z" />
        </svg>
      ) : (
        <svg
          onClick={() => setShowTrash(false)}
          xmlns="http://www.w3.org/2000/svg"
          className="header-icons cursor-enabled"
          style={{
            width: "30px",
            height: "30px",
            marginTop: "5px",
            justifySelf: "right",
          }}
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
        </svg>
      )}
    </div>
  );
};

export default TinyFooter;

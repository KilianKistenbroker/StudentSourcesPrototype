const TinyFooter = ({
  windowDimension,
  showingRightPanel,
  owner,
  data,
  // pdfController,
  // currentFile,
  // setPdfController,
}) => {
  // const handlePageManager = (num) => {
  //   const temp = pdfController.currentPage + 1;
  //   if (temp > pdfController.pageLimit || temp < 0) {
  //     return;
  //   } else {
  //     setPdfController({
  //       currentPage: temp,
  //       pageLimit: pdfController.pageLimit,
  //     });
  //   }
  // };

  return (
    <div
      className={
        windowDimension.winWidth > 1200
          ? "tiny-footer max-margin"
          : "tiny-footer medium-margin"
      }
      style={
        windowDimension.winWidth > 800 && !showingRightPanel
          ? { marginRight: "0" }
          : windowDimension.winWidth < 800 || !showingRightPanel
          ? { margin: "0px" }
          : {}
      }
    >
      {windowDimension.winWidth < 800 ? (
        <div
          style={{
            color: "dimgrey",
            fontSize: "18px",
            fontWeight: "bolder",
            paddingLeft: "20px",
            justifySelf: "left",
          }}
        >
          {" "}
          {"<"} Back
        </div>
      ) : (
        <div></div>
      )}

      {/* if viewing a pdf */}
      {/* {currentFile && currentFile.type === "pdf" ? (
        <div className="page-manager">
          <div onClick={() => handlePageManager(-1)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="header-icons cursor-enabled"
              style={{ width: "30px", height: "30px", color: "#3d3d3d" }}
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
            </svg>
          </div>

          <div style={{ paddingTop: "5px", color: "#3d3d3d" }}>
            {pdfController.currentPage} / {pdfController.pageLimit}
          </div>

          <div onClick={() => handlePageManager(1)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="header-icons cursor-enabled"
              style={{ width: "30px", height: "30px", color: "#3d3d3d" }}
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
            </svg>
          </div>
        </div>
      ) : (
        <div></div>
      )} */}

      <div></div>

      {/* trashbin */}
      {owner.user === data.user ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="header-icons"
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
        <div></div>
      )}
    </div>
  );
};

export default TinyFooter;

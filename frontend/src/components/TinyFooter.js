const TinyFooter = ({ windowDimension, showingRightPanel, owner, data }) => {
  return (
    <div
      className={
        windowDimension.winWidth > 1200
          ? "tiny-footer max-margin"
          : "tiny-footer medium-margin"
      }
      style={
        windowDimension.winWidth < 800 || !showingRightPanel
          ? { margin: "0px" }
          : {}
      }
    >
      {windowDimension.winWidth < 800 ? (
        <span
          style={{
            float: "left",
            color: "dimgrey",
            fontSize: "18px",
            fontWeight: "bolder",
            paddingLeft: "20px",
          }}
        >
          {" "}
          {"<"} Back
        </span>
      ) : (
        ""
      )}

      {/* trashbin */}
      {owner.user === data.user && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="header-icons"
          style={{ width: "30px", height: "30px", marginTop: "5px" }}
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M14 3a.702.702 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225A.703.703 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2zM3.215 4.207l1.493 8.957a1 1 0 0 0 .986.836h4.612a1 1 0 0 0 .986-.836l1.493-8.957C11.69 4.689 9.954 5 8 5c-1.954 0-3.69-.311-4.785-.793z" />
        </svg>
      )}
    </div>
  );
};

export default TinyFooter;

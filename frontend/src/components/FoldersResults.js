import { ReactComponent as TXT } from "../logos/icons/txt.svg";
import { ReactComponent as FOLDER } from "../logos/icons/folder.svg";
import { ReactComponent as JPG } from "../logos/icons/jpg.svg";
import { ReactComponent as PNG } from "../logos/icons/png.svg";
import { ReactComponent as GIF } from "../logos/icons/gif.svg";
import { ReactComponent as MOV } from "../logos/icons/mov.svg";
import { ReactComponent as MP3 } from "../logos/icons/mp3.svg";
import { ReactComponent as MP4 } from "../logos/icons/mp4.svg";
import { ReactComponent as PDF } from "../logos/icons/pdf.svg";
import { ReactComponent as UNKNOWN } from "../logos/icons/unknown-mail.svg";
import { ReactComponent as URL } from "../logos/icons/url.svg";

const FolderResults = ({
  data,
  loadFolders,
  savedFolders,
  insertSaved,
  removeSaved,
  getSpecificFolder,
}) => {
  return loadFolders
    .filter(function (loadData) {
      return loadData.fk_owner_id !== data.id;
    })
    .map((loadData, index) => (
      <div
        className={"box box-hover"}
        style={{
          display: "grid",
          overflow: "hidden",
          justifyContent: "space-between",
        }}
        key={index}
      >
        {/* file type and file name */}
        <div
          className="main-panel-filename cursor-enabled"
          style={{ width: "100%" }}

          //  nav to this folder on click
        >
          {loadData.type === "Folder" ? (
            <span style={{ marginRight: "10px", float: "left" }}>
              <FOLDER style={{ width: "40px", height: "40px" }} />
            </span>
          ) : (
            <span style={{ marginRight: "10px", float: "left" }}>
              {["jpeg", "jpg"].includes(loadData.type) ? (
                <JPG style={{ width: "40px", height: "40px" }} />
              ) : "gif" === loadData.type ? (
                <GIF style={{ width: "40px", height: "40px" }} />
              ) : "png" === loadData.type ? (
                <PNG style={{ width: "40px", height: "40px" }} />
              ) : "txt" === loadData.type ? (
                <TXT style={{ width: "40px", height: "40px" }} />
              ) : "pdf" === loadData.type ? (
                <PDF style={{ width: "40px", height: "40px" }} />
              ) : "mp4" === loadData.type ? (
                <MP4 style={{ width: "40px", height: "40px" }} />
              ) : "mp3" === loadData.type ? (
                <MP3 style={{ width: "40px", height: "40px" }} />
              ) : "mov" === loadData.type ? (
                <MOV style={{ width: "40px", height: "40px" }} />
              ) : "url" === loadData.type ? (
                <URL style={{ width: "40px", height: "40px" }} />
              ) : (
                <UNKNOWN style={{ width: "40px", height: "40px" }} />
              )}
            </span>
          )}

          {/* padding is used to center. temp solution */}

          <div
            className=""
            style={{
              paddingTop: "10px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              userSelect: "none",
            }}
            onClick={() => getSpecificFolder(loadData)}
          >
            {loadData.filename}
          </div>
        </div>
        {/* pinned icon */}
        <div></div>
        <div></div>
      </div>

      //   return loadFolders.map((loadData, index) => (
      //     <div className="box box-hover" key={index}>
      //       <div className="user-grid">
      //         <div className="box-icon">
      //           <svg
      //             xmlns="http://www.w3.org/2000/svg"
      //             fill="currentColor"
      //             viewBox="0 0 16 16"
      //           >
      //             <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      //           </svg>
      //         </div>

      //         <div
      //           className="box-username cursor-enabled"
      //           onClick={() => getUsersPage(loadData)}
      //         >
      //           {loadData.filename}
      //         </div>
      //       </div>

      //       <div
      //         className="box-star cursor-enabled"
      //         onClick={() => insertSaved(true, loadData.id)}
      //       >
      //         <svg
      //           xmlns="http://www.w3.org/2000/svg"
      //           fill="currentColor"
      //           viewBox="0 0 16 16"
      //         >
      //           <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
      //           <path d="M8 4a.5.5 0 0 1 .5.5V6H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V7H6a.5.5 0 0 1 0-1h1.5V4.5A.5.5 0 0 1 8 4z" />
      //         </svg>
      //       </div>

      //       <div className="box-friend">
      //         {/* check if this user is a friend or pending */}

      //         <div className="box-friend-content cursor-enabled">
      //           <div
      //             className="center"
      //             // onClick={() => handleFriendRequest("remove", loadData.id)}
      //           >
      //             Download
      //           </div>
      //         </div>
      //       </div>
      //     </div>
    ));
};

export default FolderResults;

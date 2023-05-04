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
import { useState } from "react";

const VisibilityPermissions = ({ tempFile }) => {
  const [visibility, setVisibility] = useState(tempFile.visibility);

  return (
    <div className="visibility-container">
      <div className="visibility-header">
        <div
          className="box"
          style={{
            display: "grid",
            overflow: "hidden",
            justifyContent: "space-between",
          }}
        >
          {/* file type and file name */}
          <div className="main-panel-filename" style={{ width: "225px" }}>
            {tempFile.type === "Folder" ? (
              <span style={{ marginRight: "10px", float: "left" }}>
                <FOLDER style={{ width: "40px", height: "40px" }} />
              </span>
            ) : (
              <span style={{ marginRight: "10px", float: "left" }}>
                {["jpeg", "jpg"].includes(tempFile.type) ? (
                  <JPG style={{ width: "40px", height: "40px" }} />
                ) : "gif" === tempFile.type ? (
                  <GIF style={{ width: "40px", height: "40px" }} />
                ) : "png" === tempFile.type ? (
                  <PNG style={{ width: "40px", height: "40px" }} />
                ) : "txt" === tempFile.type ? (
                  <TXT style={{ width: "40px", height: "40px" }} />
                ) : "pdf" === tempFile.type ? (
                  <PDF style={{ width: "40px", height: "40px" }} />
                ) : "mp4" === tempFile.type ? (
                  <MP4 style={{ width: "40px", height: "40px" }} />
                ) : "mp3" === tempFile.type ? (
                  <MP3 style={{ width: "40px", height: "40px" }} />
                ) : "mov" === tempFile.type ? (
                  <MOV style={{ width: "40px", height: "40px" }} />
                ) : "url" === tempFile.type ? (
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
              }}
            >
              {tempFile.name}
            </div>
          </div>

          <div>{/* pinned icon was here */}</div>

          {/* visibility */}

          {tempFile.visibility === "Private" ? (
            <div
              style={{
                display: "flex",
                //   flexDirection: "column",
                marginLeft: "10px",
                alignItems: "center",
                color: "dimgray",
              }}
            >
              <b>private</b>
              <div style={{ marginLeft: "10px" }} className="box-star">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                </svg>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                //   flexDirection: "column",
                marginLeft: "10px",
                alignItems: "center",
                color: "dimgray",
              }}
            >
              <b>public</b>
              <div style={{ marginLeft: "10px" }} className="box-star">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="header-icons"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM2.04 4.326c.325 1.329 2.532 2.54 3.717 3.19.48.263.793.434.743.484-.08.08-.162.158-.242.234-.416.396-.787.749-.758 1.266.035.634.618.824 1.214 1.017.577.188 1.168.38 1.286.983.082.417-.075.988-.22 1.52-.215.782-.406 1.48.22 1.48 1.5-.5 3.798-3.186 4-5 .138-1.243-2-2-3.5-2.5-.478-.16-.755.081-.99.284-.172.15-.322.279-.51.216-.445-.148-2.5-2-1.5-2.5.78-.39.952-.171 1.227.182.078.099.163.208.273.318.609.304.662-.132.723-.633.039-.322.081-.671.277-.867.434-.434 1.265-.791 2.028-1.12.712-.306 1.365-.587 1.579-.88A7 7 0 1 1 2.04 4.327Z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        <div className="visibility-selection">
          <label style={{ color: "dimgray" }}>
            {/* custom checkbox */}
            <div
              onClick={() => setVisibility("Public")}
              className={
                visibility === "Public"
                  ? "visibility-checkbox visibility-selected"
                  : "visibility-checkbox cursor-enabled"
              }
            ></div>
            <div>Public</div>
          </label>

          <label style={{ color: "dimgray" }}>
            {/* custom checkbox */}
            <div
              onClick={() => setVisibility("Private")}
              className={
                visibility === "Private"
                  ? "visibility-checkbox visibility-selected"
                  : "visibility-checkbox cursor-enabled"
              }
            ></div>
            <div>Private</div>
          </label>

          <label style={{ color: "dimgray" }}>
            {/* custom checkbox */}
            <div
              onClick={() => setVisibility("Shared-Private")}
              className={
                visibility === "Shared-Private"
                  ? "visibility-checkbox visibility-selected"
                  : "visibility-checkbox cursor-enabled"
              }
            ></div>
            <div>Shared-Private</div>
          </label>
        </div>
      </div>

      <div className="visibility-footer">footer</div>
    </div>
  );
};

export default VisibilityPermissions;

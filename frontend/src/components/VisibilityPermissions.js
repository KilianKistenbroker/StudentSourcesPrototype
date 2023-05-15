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
import axios from "../api/axios";
import uploadJson from "../helpers/uploadJson";
import { useEffect } from "react";

const VisibilityPermissions = ({
  tempFile,
  setMessage,
  data,
  explorerData,
  windowDimension,
}) => {
  const [visibility, setVisibility] = useState(tempFile.content.visibility);
  const [permissions, setPermissions] = useState(tempFile.content.permissions);
  const [input, setInput] = useState("");

  useEffect(() => {
    // testing changes
    if (visibility === "Public" || visibility === "Shared-Private") {
      setPermissions("Can view & download");
    } else {
      setPermissions("Only you have access");
    }
    console.log(visibility);
    console.log(permissions);
  }, [visibility]);

  const handleSetVisibilty = async () => {
    const oldVisibility = tempFile.content.visibility;
    const oldPermissions = tempFile.content.permissions;

    try {
      tempFile.content.visibility = visibility;
      tempFile.content.permissions = permissions;

      const res = axios.put(`/file/${tempFile.content.id}`, {
        id: null,
        fk_owner_id: null,
        fk_comments_id: null,
        fk_chatbot_id: null,
        filename: tempFile.content.name,
        visibility: visibility,
      });

      const res1 = uploadJson(data.id, explorerData);
      if (res1 === -1) {
        console.log("Failed to save home directory.");
      }
    } catch (error) {
      console.log(error);

      // undo changes
      tempFile.content.visibility = oldVisibility;
      tempFile.content.permissions = oldPermissions;
    }

    setMessage({
      title: null,
      body: null,
    });
  };

  return (
    <div className="visibility-container">
      <div className="visibility-header">
        <div
          className="box"
          style={{
            display: "grid",
            overflow: "hidden",
            justifyContent: "space-between",
            backgroundColor: "white",
            border: "1px solid lightgrey",
          }}
        >
          {/* file type and file name */}
          <div className="main-panel-filename" style={{ width: "225px" }}>
            {tempFile.content.type === "Folder" ? (
              <span style={{ marginRight: "10px", float: "left" }}>
                <FOLDER style={{ width: "40px", height: "40px" }} />
              </span>
            ) : (
              <span style={{ marginRight: "10px", float: "left" }}>
                {["jpeg", "jpg"].includes(tempFile.content.type) ? (
                  <JPG style={{ width: "40px", height: "40px" }} />
                ) : "gif" === tempFile.content.type ? (
                  <GIF style={{ width: "40px", height: "40px" }} />
                ) : "png" === tempFile.content.type ? (
                  <PNG style={{ width: "40px", height: "40px" }} />
                ) : "txt" === tempFile.content.type ? (
                  <TXT style={{ width: "40px", height: "40px" }} />
                ) : "pdf" === tempFile.content.type ? (
                  <PDF style={{ width: "40px", height: "40px" }} />
                ) : "mp4" === tempFile.content.type ? (
                  <MP4 style={{ width: "40px", height: "40px" }} />
                ) : "mp3" === tempFile.content.type ? (
                  <MP3 style={{ width: "40px", height: "40px" }} />
                ) : "mov" === tempFile.content.type ? (
                  <MOV style={{ width: "40px", height: "40px" }} />
                ) : "url" === tempFile.content.type ? (
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
              {tempFile.content.name}
            </div>
          </div>

          <div>{/* pinned icon was here */}</div>

          {/* visibility */}

          {tempFile.content.visibility === "Private" ? (
            <div
              style={{
                display: "flex",
                //   flexDirection: "column",
                marginLeft: "10px",
                alignItems: "center",
                color: "dimgray",
              }}
            >
              <b>Private</b>
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
              <b>Public</b>
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

      <div className="visibility-footer">
        {/* footer */}
        {visibility === "Public" ? (
          <div>
            <div style={{ whiteSpace: "nowrap" }}>
              <b>Note:</b> everyone can access this file.
            </div>

            <div
              className="visibility-footer-grid"
              style={
                windowDimension.winWidth < 600
                  ? { gridTemplateColumns: "repeat(1, auto)" }
                  : { gridTemplateColumns: "repeat(2, auto)" }
              }
            >
              <label>Usernames</label>
              <div></div>
              <form>
                <input
                  style={{
                    height: "50px",
                    color: "dimgrey",
                    cursor: "default",
                    marginTop: "10px",
                  }}
                  type="text"
                  readOnly
                  value={"@Everyone"}
                />
              </form>
              <select
                style={{
                  textAlign: "center",
                  fontSize: "14px",
                  minWidth: "150px",
                  minHeight: "50px",
                  marginTop: "10px",
                }}
              >
                <option
                  value="Can view & download"
                  onClick={(e) => {
                    setPermissions(e.target.value);
                  }}
                >
                  Can view & download
                </option>
                <option
                  value="Can view only"
                  onClick={(e) => {
                    setPermissions(e.target.value);
                  }}
                >
                  Can view only
                </option>
              </select>
              <button style={{ marginTop: "10px" }}>Copy URL</button>
              <button
                onClick={() => {
                  handleSetVisibilty();
                }}
                style={{ marginTop: "10px" }}
              >
                Done
              </button>
            </div>
          </div>
        ) : visibility === "Private" ? (
          <div>
            <b>Note:</b> only you can access this file.
          </div>
        ) : (
          <div>
            <div style={{ whiteSpace: "nowrap" }}>
              <b>Note:</b> only certain users can access this file.
            </div>

            <div
              className="visibility-footer-grid"
              style={
                windowDimension.winWidth < 800
                  ? { gridTemplateColumns: "repeat(1, auto)" }
                  : { gridTemplateColumns: "repeat(2, auto)" }
              }
            >
              <label>Usernames</label>
              <div></div>
              <form>
                <input
                  style={{
                    height: "50px",
                    color: "dimgrey",
                    marginTop: "10px",
                  }}
                  type="text"
                  autoFocus={true}
                  placeholder={"@Username"}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </form>
              <select
                style={{
                  textAlign: "center",
                  fontSize: "14px",
                  minWidth: "150px",
                  minHeight: "50px",
                  marginTop: "10px",
                }}
              >
                <option
                  value="Can view & download"
                  onClick={(e) => {
                    setPermissions(e.target.value);
                  }}
                >
                  Can view & download
                </option>
                <option
                  value="Can view only"
                  onClick={(e) => {
                    setPermissions(e.target.value);
                  }}
                >
                  Can view only
                </option>
              </select>
              <button style={{ marginTop: "10px" }}>Copy URL</button>
              <button
                onClick={() =>
                  setMessage({
                    title: null,
                    body: null,
                  })
                }
                style={{ marginTop: "10px" }}
              >
                Done
              </button>
              <div
                style={{
                  color: "dimgray",
                  fontSize: "14px",
                  marginTop: "10px",
                }}
              >
                <b>Hint:</b> seperate handles with spaces
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisibilityPermissions;

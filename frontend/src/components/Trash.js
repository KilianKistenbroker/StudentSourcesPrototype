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
import Window from "./Window";
import handleDragOver from "../helpers/handleDrag";
import handleDrop from "../helpers/handleDrop";
import { useState } from "react";
import { useEffect } from "react";

const Trash = ({
  data,
  message,
  setMessage,
  splashMsg,
  setSplashMsg,
  trashItems,
  setTrashItems,
  windowDimension,
  setTempFile,
  handleMoveFile,
  tempFile,
  explorerData,
  owner,
  currentDirectory,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [moveEffect, setMoveEffect] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tempFile.state && tempFile.state === "restore")
      handleMoveFile(currentDirectory.pathname);
  }, [tempFile.state]);

  const deleteThisItem = (loadData) => {
    let tempTrash = {
      id: -1,
      name: "~Trash",
      pathname: "Home/~Trash",
      type: "Folder",
      size: 0,
      isPinned: false,
      visibility: "Private",
      permissions: "Only you have access",
      dataUrl: "",
      items: [],
    };

    for (let i = 0; i < trashItems.items.length; i++) {
      if (trashItems.items[i].id !== loadData.id) {
        tempTrash.items.push(trashItems.items[i]);
      }
    }

    for (let i = 0; i < explorerData.items.length; i++) {
      if (explorerData.items[i].name === "~Trash") {
        console.log("first");
        explorerData.items[i] = tempTrash;
        setTrashItems(tempTrash);
      }
    }
  };

  return (
    <div className="page">
      <div
        className={
          windowDimension.winWidth > 1200
            ? "main-panel-content max-margin"
            : "main-panel-content medium-margin"
        }
      >
        <Window
          data={data}
          message={message}
          setMessage={setMessage}
          splashMsg={splashMsg}
          setSplashMsg={setSplashMsg}
        />

        <h1
          style={{
            marginBottom: "40px",
            fontFamily: "sans-serif",
            color: "#3d3d3d",
            fontSize: "30px",
            fontWeight: "lighter",
          }}
        >
          Deleted
        </h1>

        <div className="box box-hover" style={{ overflow: "hidden" }}>
          <div
            className=""
            style={{
              margin: "0px",
              width: "165px",
              padding: "5px",
              fontSize: "16px",
              overflow: "hidden",
              color: "#202020",
              fontWeight: "bolder",
            }}
          >
            Name
          </div>
        </div>

        {trashItems.items.map((loadData, index) => (
          <div
            draggable
            className="box box-hover"
            style={{
              display: "grid",
              overflow: "hidden",
              justifyContent: "space-between",
            }}
            key={index}
            onDragStart={() => {
              setTempFile({
                state: "dragging",
                content: loadData,
              });
            }}
          >
            {/* file type and file name */}
            <div
              className="main-panel-filename cursor-enabled"
              style={{ width: "100%", maxWidth: "300px", minWidth: "100px" }}
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
              >
                {loadData.name}
              </div>
            </div>

            <div></div>

            <div
              className="box-friend"
              style={{ width: "200px", paddingTop: "2.5px" }}
            >
              <div
                className="box-friend-content cursor-enabled"
                // onClick={() => handleFriendRequest("accept", loadData.id)}
                onClick={() => {
                  setTempFile({
                    state: "restore",
                    content: loadData,
                  });
                }}
              >
                Restore
              </div>
              <div
                className="box-friend-content cursor-enabled"
                // onClick={() => handleFriendRequest("deny", loadData.id)}
                onClick={() => {
                  deleteThisItem(loadData);
                }}
              >
                Delete
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* limited dropzone for moving items into trash */}
      {trashItems.items.length === 0 && !moveEffect ? (
        <div
          className={"dropzone dragging"}
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
          onDragLeave={() => {
            setDragOver(false);
            setMoveEffect(false);
          }}
        >
          <span style={{ padding: "10px" }}>
            <b>Drop files here</b> to delete them.
          </span>
        </div>
      ) : moveEffect ? (
        <div
          className={"dropzone dragging"}
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
          onDragLeave={() => {
            setDragOver(false);
            setMoveEffect(false);
          }}
        >
          <span style={{ padding: "10px" }}>
            Move{" "}
            <b>
              <i>{tempFile.content.name}</i>
            </b>{" "}
            to{" "}
            <b>
              <i>{trashItems.name}</i>
            </b>{" "}
            .
          </span>
        </div>
      ) : (
        <div
          className={"dropzone"}
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
        >
          {/* no rendering here */}
        </div>
      )}
    </div>
  );
};

export default Trash;

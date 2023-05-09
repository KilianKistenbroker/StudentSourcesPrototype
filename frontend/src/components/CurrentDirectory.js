import { useState } from "react";
import { useEffect } from "react";
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
import readDroppedFiles from "../helpers/readDroppedFiles";
import handleDrop from "../helpers/handleDrop";
import handleDragOver from "../helpers/handleDrag";

const CurrentDirectory = ({
  currentDirectory,
  setCurrentDirectory,
  setCurrentFile,
  explorerData,
  setExplorerData,
  pinSelected,
  owner,
  data,
  message,
  setMessage,
  tempFile,
  setTempFile,
  handleMoveFile,
  setSplashMsg,
}) => {
  const [pinnedItems, setPinnedItems] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [moveEffect, setMoveEffect] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // gather pins and store them in an array
    let temp = [];
    for (let i = 0; i < currentDirectory.items.length; i++) {
      if (currentDirectory.items[i].isPinned) {
        temp.push(currentDirectory.items[i].name);
      }
    }
    setPinnedItems(temp);
  }, [currentDirectory]);

  const updateParentSize = (node, parsingArr, size) => {
    parsingArr.shift();
    if (parsingArr.length === 0) {
      node.size += size;
      return node;
    }
    node.size += size;
    for (let i = 0; i < node.items.length; i++) {
      if (node.items[i].name === parsingArr[0]) {
        node.items[i] = updateParentSize(node.items[i], parsingArr, size);
        return node;
      }
    }
  };

  const setPinned = (loadData) => {
    let index = 0;
    console.log(loadData.pathname);
    for (let i = 0; i < currentDirectory.items.length; i++) {
      if (currentDirectory.items[i].pathname === loadData.pathname) {
        currentDirectory.items[i].isPinned =
          !currentDirectory.items[i].isPinned;
        index = i;
      }
    }

    console.log(index);

    let temp = JSON.parse(JSON.stringify(pinnedItems));

    if (currentDirectory.items[index].isPinned) {
      temp.push(currentDirectory.items[index].name);
      setPinnedItems(temp);
    } else {
      let temp2 = [];
      for (let i = 0; i < temp.length; i++) {
        if (currentDirectory.items[index].name != temp[i]) temp2.push(temp[i]);
        setPinnedItems(temp2);
      }
    }

    console.log(pinnedItems);
  };

  // ------------------ pin is not selected ----------------- //

  if (!pinSelected) {
    return currentDirectory.items.map((loadData, index) => (
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
        onDrop={(e) =>
          handleDrop(
            e,
            loadData,
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
            loadData,
            setMoveEffect,
            setDragOver,
            data,
            owner
          )
        }
      >
        {/* file type and file name */}
        <div
          className="main-panel-filename cursor-enabled"
          style={owner.user !== data.user ? { width: "100%" } : {}}
          onClick={
            loadData.type === "Folder"
              ? () => setCurrentDirectory(explorerData, loadData.pathname, -1)
              : // change below func to display file contents
                () => setCurrentFile(loadData)
          }
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
        {/* pinned icon */}
        {owner.user === data.user && (
          <div
            className="box-star cursor-enabled"
            style={{ justifySelf: "left" }}
            onClick={() => setPinned(loadData)}
          >
            {pinnedItems.includes(loadData.name) ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="header-icons cursor-enabled"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="header-icons cursor-enabled"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146zm.122 2.112v-.002.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a4.507 4.507 0 0 0-.288-.076 4.922 4.922 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a4.924 4.924 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034.114 0 .23-.011.343-.04L9.927 2.028c-.029.113-.04.23-.04.343a1.779 1.779 0 0 0 .062.46z" />
              </svg>
            )}
          </div>
        )}

        {/* visibility */}
        {owner.user === data.user && (
          <div
            style={{
              display: "flex",
              // width: "70px",
              marginLeft: "10px",
            }}
          >
            <div
              className="box-star cursor-enabled"
              style={{ marginLeft: "10px" }}
              onClick={() => {
                setTempFile({ state: null, content: loadData });
                setMessage({
                  title: "Visibility and Permissions",
                  body: null,
                });
              }}
            >
              {loadData.visibility === "Private" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="header-icons cursor-enabled"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM2.04 4.326c.325 1.329 2.532 2.54 3.717 3.19.48.263.793.434.743.484-.08.08-.162.158-.242.234-.416.396-.787.749-.758 1.266.035.634.618.824 1.214 1.017.577.188 1.168.38 1.286.983.082.417-.075.988-.22 1.52-.215.782-.406 1.48.22 1.48 1.5-.5 3.798-3.186 4-5 .138-1.243-2-2-3.5-2.5-.478-.16-.755.081-.99.284-.172.15-.322.279-.51.216-.445-.148-2.5-2-1.5-2.5.78-.39.952-.171 1.227.182.078.099.163.208.273.318.609.304.662-.132.723-.633.039-.322.081-.671.277-.867.434-.434 1.265-.791 2.028-1.12.712-.306 1.365-.587 1.579-.88A7 7 0 1 1 2.04 4.327Z" />
                </svg>
              )}
            </div>
            <div
              className="box-star cursor-enabled"
              style={{ marginLeft: "10px" }}
              onClick={() =>
                setMessage({
                  title: "More Options for Folders/Files",
                  body: "This feature shall provide more options to download or share the selected folder or file.",
                })
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="header-icons cursor-enabled"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
              </svg>
            </div>
          </div>
        )}
      </div>
    ));

    // -------------------- pin is selected ------------------ //
  } else {
    return currentDirectory.items
      .filter(function (loadData) {
        return pinnedItems.includes(loadData.name);
      })
      .map((loadData, index) => (
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
          onDrop={(e) =>
            handleDrop(
              e,
              loadData,
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
              loadData,
              setMoveEffect,
              setDragOver,
              data,
              owner
            )
          }
        >
          {/* file type and file name */}
          <div
            className="main-panel-filename cursor-enabled"
            style={owner.user !== data.user ? { width: "100%" } : {}}
            onClick={
              loadData.type === "Folder"
                ? () => setCurrentDirectory(explorerData, loadData.pathname, -1)
                : // change below func to display file contents
                  () => setCurrentFile(loadData)
            }
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
              }}
            >
              {loadData.name}
            </div>
          </div>
          {/* pinned icon */}
          {owner.user === data.user && (
            <div
              className="box-star cursor-enabled"
              style={{ justifySelf: "left" }}
              onClick={() => setPinned(loadData)}
            >
              {pinnedItems.includes(loadData.name) ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="header-icons cursor-enabled"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="header-icons cursor-enabled"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146zm.122 2.112v-.002.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a4.507 4.507 0 0 0-.288-.076 4.922 4.922 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a4.924 4.924 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034.114 0 .23-.011.343-.04L9.927 2.028c-.029.113-.04.23-.04.343a1.779 1.779 0 0 0 .062.46z" />
                </svg>
              )}
            </div>
          )}

          {/* visibility */}
          {owner.user === data.user && (
            <div
              style={{
                display: "flex",
                marginLeft: "10px",
              }}
            >
              <div
                style={{ marginLeft: "10px" }}
                className="box-star cursor-enabled"
                onClick={() => {
                  setTempFile({ state: null, content: loadData });
                  setMessage({
                    title: "Visibility and Permissions",
                    body: null,
                  });
                }}
              >
                {loadData.visibility === "Private" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="header-icons cursor-enabled"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM2.04 4.326c.325 1.329 2.532 2.54 3.717 3.19.48.263.793.434.743.484-.08.08-.162.158-.242.234-.416.396-.787.749-.758 1.266.035.634.618.824 1.214 1.017.577.188 1.168.38 1.286.983.082.417-.075.988-.22 1.52-.215.782-.406 1.48.22 1.48 1.5-.5 3.798-3.186 4-5 .138-1.243-2-2-3.5-2.5-.478-.16-.755.081-.99.284-.172.15-.322.279-.51.216-.445-.148-2.5-2-1.5-2.5.78-.39.952-.171 1.227.182.078.099.163.208.273.318.609.304.662-.132.723-.633.039-.322.081-.671.277-.867.434-.434 1.265-.791 2.028-1.12.712-.306 1.365-.587 1.579-.88A7 7 0 1 1 2.04 4.327Z" />
                  </svg>
                )}
              </div>
              <div
                style={{ marginLeft: "10px" }}
                className="box-star cursor-enabled"
                onClick={() =>
                  setMessage({
                    title: "More Options for Folders/Files",
                    body: "This feature shall provide more options to download or share the selected folder or file.",
                  })
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="header-icons cursor-enabled"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      ));
  }
};

export default CurrentDirectory;

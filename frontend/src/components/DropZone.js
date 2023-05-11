import React, { useEffect, useState, useRef } from "react";
import readDroppedFiles from "../helpers/readDroppedFiles";
import handleDrop from "../helpers/handleDrop";
import handleDragOver from "../helpers/handleDrag";

const DropZone = ({
  explorerData,
  currentDirectory,
  setLoading,
  loading,
  files,
  setFiles,
  setMessage,
  setSplashMsg,
  tempFile,
  setTempFile,
  handleMoveFile,
  setCurrentDirectory,
  data,
  owner,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [moveEffect, setMoveEffect] = useState(false);
  const inputRef = useRef();

  // not sure what this is for
  useEffect(() => {
    if (files) {
      console.log(files);
      handleDrop(
        files,
        currentDirectory,
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
      );
      setFiles(null);
    }
  }, [files]);

  if (loading) {
    return (
      <div
        style={{
          marginTop: "10px",
          width: "100%",
          height: "70vh",
          display: "flex",
          paddingTop: "50px",
          justifyContent: "center",
          color: "dimgray",
          transition: ".2s",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div>
      {dragOver ||
      (currentDirectory.items.length === 0 && !moveEffect) ||
      (explorerData.items.length === 1 && !moveEffect) ? (
        <div
          className={"dropzone dragging"}
          onDrop={(e) =>
            handleDrop(
              e,
              currentDirectory,
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
              currentDirectory,
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
            <b>Drop files here to upload</b>, or use the{" "}
            <input
              type="file"
              multiple
              onChange={(e) => setFiles(e)}
              hidden
              ref={inputRef}
            />
            <span onClick={() => inputRef.current.click()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="header-icons cursor-enabled"
                style={{ width: "30px" }}
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
              </svg>{" "}
            </span>
            button.
          </span>
        </div>
      ) : moveEffect ? (
        <div
          className={"dropzone dragging"}
          onDrop={(e) =>
            handleDrop(
              e,
              currentDirectory,
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
              currentDirectory,
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
              <i>{currentDirectory.name}</i>
            </b>{" "}
            .
            <input
              type="file"
              multiple
              onChange={(e) => setFiles(e)}
              hidden
              ref={inputRef}
            />
          </span>
        </div>
      ) : (
        <div
          className={"dropzone"}
          onDragOver={(e) =>
            handleDragOver(
              e,
              tempFile,
              currentDirectory,
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

export default DropZone;

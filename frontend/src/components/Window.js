import { useEffect } from "react";
import Account from "./Account";
import Inbox from "./Inbox";
import VisibilityPermissions from "./VisibilityPermissions";

const Window = ({
  data,
  message,
  setMessage,
  searchResults,
  setSearchResults,
  setCurrentDirectory,
  explorerData,
  handleSetCurrentFile,
  splashMsg,
  setSplashMsg,
  tempFile,
  windowDimension,
}) => {
  useEffect(() => {
    if (message.title) {
      // clear search results if window changes
      if (searchResults && message.title !== "search") setSearchResults([]);

      // auto scrolls up to view message
      var element = document.getElementById("message");
      element.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [message]);

  if (searchResults && searchResults.length > 0) {
    return (
      <div className="search-results show-message" id="message">
        <div className="window-header">
          <b style={{ color: "#fafafa", paddingLeft: "5px" }}>Search Results</b>
          <span style={{ justifySelf: "right" }}>
            <div
              className="header-icons cursor-enabled exit"
              onClick={() => {
                setSearchResults([]);
                setMessage({ title: null, body: null });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z" />
              </svg>
            </div>
          </span>
        </div>
        <div style={{ padding: "20px", overflow: "scroll", height: "170px" }}>
          {searchResults.map((loadData, index) => (
            <div className="" key={index}>
              <div
                className="main-panel-filename cursor-enabled"
                style={{ width: "fit-content" }}
                onClick={
                  loadData.type === "Folder"
                    ? () =>
                        setCurrentDirectory(explorerData, loadData.pathname, -1)
                    : // change below func to display file contents
                      () => {
                        handleSetCurrentFile(loadData);
                      }
                }
              >
                <b>Location:</b> {loadData.pathname}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else if (message.title && message.title === "Account") {
    return (
      <div
        className="search-results show-window"
        id="message"
        style={{
          transition: ".4s",
        }}
      >
        <div className="window-header">
          <b style={{ color: "#fafafa", paddingLeft: "5px" }}>
            {message.title}
          </b>
          <span style={{ justifySelf: "right" }}>
            <div
              className="header-icons cursor-enabled exit"
              onClick={() => {
                // setSearchResults([]);
                setMessage({ title: null, body: null });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z" />
              </svg>
            </div>
          </span>
        </div>
        <div
          style={{ padding: "20px", height: "500.5px", overflowY: "scroll" }}
        >
          {/* add ACCOUNT component here */}
          <Account
            data={data}
            splashMsg={splashMsg}
            setSplashMsg={setSplashMsg}
            explorerData={explorerData}
          />
        </div>
      </div>
    );
  } else if (message.title && message.title === "Inbox") {
    return (
      <div
        className="search-results show-window"
        id="message"
        style={{
          transition: ".4s",
        }}
      >
        <div className="window-header">
          <b style={{ color: "#fafafa", paddingLeft: "5px" }}>
            {message.title}
          </b>
          <span style={{ justifySelf: "right" }}>
            <div
              className="header-icons cursor-enabled exit"
              onClick={() => {
                // setSearchResults([]);
                setMessage({ title: null, body: null });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z" />
              </svg>
            </div>
          </span>
        </div>
        <div style={{ height: "500.5px" }}>
          {/* add INBOX component here */}
          <Inbox data={data} />
        </div>
      </div>
    );
  } else if (message.title && message.title === "Visibility and Permissions") {
    return (
      <div
        className="search-results show-window"
        id="message"
        style={{
          transition: ".4s",
        }}
      >
        <div className="window-header">
          <b style={{ color: "#fafafa", paddingLeft: "5px" }}>
            {message.title}
          </b>
          <span style={{ justifySelf: "right" }}>
            <div
              className="header-icons cursor-enabled exit"
              onClick={() => {
                // setSearchResults([]);
                setMessage({ title: null, body: null });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z" />
              </svg>
            </div>
          </span>
        </div>
        <div style={{ height: "500.5px" }}>
          {/* add INBOX component here */}
          <VisibilityPermissions
            data={data}
            tempFile={tempFile}
            setMessage={setMessage}
            explorerData={explorerData}
            windowDimension={windowDimension}
          />
        </div>
      </div>
    );
  } else if (message.title && message.title === "Uh-oh!") {
    return (
      <div className="search-results show-message" id="message">
        <div className="window-header">
          <b style={{ color: "#fafafa", paddingLeft: "5px" }}>
            {message.title}
          </b>
          <span style={{ justifySelf: "right" }}>
            <div
              className="header-icons cursor-enabled exit"
              onClick={() => {
                // setSearchResults([]);
                setMessage({ title: null, body: null });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z" />
              </svg>
            </div>
          </span>
        </div>
        <div style={{ padding: "20px" }}>{message.body}</div>
      </div>
    );
  } else if (message.title) {
    return (
      <div className="search-results show-message" id="message">
        <div className="window-header">
          <b style={{ color: "#fafafa", paddingLeft: "5px" }}>
            To be implemented ~ {message.title}
          </b>
          <span style={{ justifySelf: "right" }}>
            <div
              className="header-icons cursor-enabled exit"
              onClick={() => {
                // setSearchResults([]);
                setMessage({ title: null, body: null });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z" />
              </svg>
            </div>
          </span>
        </div>
        <div style={{ padding: "20px" }}>{message.body}</div>
      </div>
    );
  } else {
    return <div className="search-results hide-window" id="message"></div>;
  }
};

export default Window;

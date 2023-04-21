import { useState, useRef } from "react";

const StudentSearch = ({
  currentDirectory,
  windowDimension,
  showingRightPanel,
  currentFile,
  setCurrentFile,
  handleDownload,
  setPinSelected,
  pinSelected,
  setFiles,
  handleSetScale,
  setSearchResults,
  owner,
  data,
  setOwner,
  setExplorerData,
  message,
  setMessage,
}) => {
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const inputRef = useRef();

  const handleExit = () => {
    setOwner(null);
    setExplorerData(null);
  };

  const searchFromCurrentDirectory = (node, arr, search) => {
    let temp = arr;
    const lowerString1 = search.toLowerCase().trim(" ");
    for (let i = 0; i < node.items.length; i++) {
      const lowerString2 = node.items[i].name.toLowerCase().trim(" ");
      if (lowerString2.includes(lowerString1)) {
        temp.push(node.items[i]);
      }
      temp = searchFromCurrentDirectory(node.items[i], temp, search);
    }

    return temp;
  };

  // this will populate searchResults
  const searchHelper = async (e) => {
    e.preventDefault();

    if (search.length === 0) {
      setSearchResults([]);
    } else {
      setSearchResults(
        searchFromCurrentDirectory(currentDirectory, [], search)
      );
    }
  };

  return (
    <div className="sub-navbar" style={currentFile ? { marginTop: "0px" } : {}}>
      <div></div>
      <div
        className={
          windowDimension.winWidth > 1200
            ? "main-pain-searchbar max-margin"
            : "main-pain-searchbar medium-margin"
        }
        style={
          windowDimension.winWidth < 800
            ? { marginLeft: "0px", marginRight: "30px" }
            : !showingRightPanel
            ? { marginRight: "30px" }
            : {}
        }
      >
        <form id="search_form" onSubmit={searchHelper}>
          <button
            type="submit"
            id="search_button"
            disabled={
              selected === "saved" || selected === "friends" ? true : false
            }
          >
            {selected === "saved" || selected === "friends" ? (
              <svg
                id="filter_icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
              </svg>
            ) : (
              <svg
                id="search_icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            )}
          </button>

          {selected === "saved" || selected === "friends" ? (
            <input
              type="text"
              name="searchbar"
              placeholder="Filter"
              id="search_bar"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          ) : (
            <input
              type="text"
              name="searchbar"
              placeholder={
                currentFile ? "Search" : `Search /${currentDirectory.name}`
              }
              id="search_bar"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
        </form>

        {currentFile ? (
          <div className="selection">
            <div
              className={
                selected === "saved" ? "selected" : "selection-content"
              }
              onClick={() => handleDownload()}
            >
              {/* download*/}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="header-icons cursor-enabled"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
              </svg>
            </div>

            <div
              className={
                selected === "saved" ? "selected" : "selection-content"
              }
              onClick={() => handleSetScale(1, currentFile.type)}
            >
              {/* zoom in */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="header-icons cursor-enabled"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />
                <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z" />
                <path d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5z" />
              </svg>
            </div>

            <div
              className={
                selected === "friends" ? "selected" : "selection-content"
              }
              onClick={() => handleSetScale(-1, currentFile.type)}
            >
              {/* zoom out */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="header-icons cursor-enabled"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />
                <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z" />
                <path d="M3 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z" />
              </svg>
            </div>

            <div
              onClick={() => setCurrentFile(null)}
              className={
                selected === "users" ? "selected" : "selection-content"
              }
            >
              {/* undo / go back */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="header-icons cursor-enabled"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
              </svg>
            </div>
          </div>
        ) : owner.user === data.user ? (
          <div className="selection">
            <div
              className={
                selected === "users" ? "selected" : "selection-content"
              }
            >
              {/* Upload */}
              <input
                type="file"
                multiple
                onChange={(e) => setFiles(e)}
                hidden
                ref={inputRef}
              />
              <div onClick={() => inputRef.current.click()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="header-icons cursor-enabled"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                  <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
                </svg>
              </div>
            </div>

            <div
              className={
                selected === "saved" ? "selected" : "selection-content"
              }
              onClick={() => setPinSelected(!pinSelected)}
            >
              {/* Pinned */}

              {pinSelected ? (
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

            <div
              className={
                selected === "friends" ? "selected" : "selection-content"
              }
              onClick={() =>
                setMessage({
                  title: "Format",
                  body: "This feature shall allow the user to swap between list and grid layout.",
                })
              }
            >
              {/* Format */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="header-icons cursor-enabled"
                style={{ marginTop: "5px" }}
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
              </svg>
            </div>
          </div>
        ) : (
          <div
            className="selection"
            style={{
              justifyContent: "space-between",
              textAlign: "left",
              paddingTop: "4px",
              paddingLeft: "15px",
            }}
          >
            <div className="user-grid">
              <div
                className="box-icon"
                style={{ paddingTop: "2px", height: "45px" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                </svg>
              </div>

              <div className="box-username">
                @{owner.user} <br />
                {owner.firstName} {owner.lastName}
              </div>
            </div>

            <div
              className="header-icons cursor-enabled"
              style={{ paddingTop: "5px", width: "30px" }}
              onClick={() => handleExit()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSearch;

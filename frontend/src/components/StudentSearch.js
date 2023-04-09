import { useState } from "react";

const StudentSearch = ({ currentDirectory, windowDimension }) => {
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  return (
    <div className="sub-navbar">
      <div></div>
      <div
        className={
          windowDimension.winWidth > 1200
            ? "main-pain-searchbar max-margin"
            : "main-pain-searchbar medium-margin"
        }
        style={windowDimension.winWidth < 800 ? { margin: "0px" } : {}}
      >
        <form id="search_form">
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
              placeholder={`Search from /${currentDirectory.name}`}
              id="search_bar"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
        </form>

        <div className="selection">
          <div
            className={selected === "users" ? "selected" : "selection-content"}
          >
            {/* Upload */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="header-icons"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
              <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
            </svg>
          </div>

          {/* <div
          className={selected === "folders" ? "selected" : "selection-content"}
        >
          Create
        </div> */}

          <div
            className={selected === "saved" ? "selected" : "selection-content"}
          >
            {/* Pinned */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="header-icons"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146zm.122 2.112v-.002.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a4.507 4.507 0 0 0-.288-.076 4.922 4.922 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a4.924 4.924 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034.114 0 .23-.011.343-.04L9.927 2.028c-.029.113-.04.23-.04.343a1.779 1.779 0 0 0 .062.46z" />
            </svg>
          </div>

          <div
            className={
              selected === "friends" ? "selected" : "selection-content"
            }
          >
            {/* Format */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="header-icons"
              style={{ marginTop: "5px" }}
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSearch;

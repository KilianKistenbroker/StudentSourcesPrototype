import { useState } from "react";

const StudentSearch = () => {
  const [selected, setSelected] = useState("users");
  const [friends, setFriends] = useState("all");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  return (
    <div className="main-pain-searchbar">
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
            placeholder={"Search from /Home"}
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
          Upload
        </div>

        <div
          className={selected === "folders" ? "selected" : "selection-content"}
        >
          Create
        </div>

        <div
          className={selected === "saved" ? "selected" : "selection-content"}
        >
          Pinned
        </div>

        <div
          className={selected === "friends" ? "selected" : "selection-content"}
        >
          Format
        </div>
      </div>
    </div>
  );
};

export default StudentSearch;

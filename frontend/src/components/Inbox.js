import { useState } from "react";

const Inbox = ({ data }) => {
  // options will either be 'create dm' or the most recent conversation
  const [selection, setSelection] = useState("conversations");
  const [textMessage, setTextMessage] = useState("");

  // ------------------- TEMPORARY ------------------- //
  const commentsData = [
    {
      // id: 1,
      commenterImage: "http://placekitten.com/50/50",
      username: "parthfloyd",
      commentText:
        "Hello this is a test comment. Add comments in the text field below",
      date: "March 5th, 2014",
    },
    {
      // id: 2,
      commenterImage: "http://placekitten.com/50/50",
      username: "parthfloyd",
      commentText:
        "Hello this is a test comment what happens if this one gets too long.",
      date: "March 5th, 2014",
    },
    {
      // id: 3,
      commenterImage: "http://placekitten.com/50/50",
      username: "parthfloyd",
      commentText:
        "Hello this is a test comment what happens if this one gets too long.",
      date: "March 5th, 2014",
    },
    {
      // id: 4,
      commenterImage: "http://placekitten.com/50/50",
      username: "parthfloyd",
      commentText:
        "Hello this is a test comment what happens if this one gets too long.",
      date: "March 5th, 2014",
    },
    {
      // id: 1,
      commenterImage: "http://placekitten.com/50/50",
      username: "parthfloyd",
      commentText:
        "Hello this is a test comment. Add comments in the text field below",
      date: "March 5th, 2014",
    },
    {
      // id: 2,
      commenterImage: "http://placekitten.com/50/50",
      username: "parthfloyd",
      commentText:
        "Hello this is a test comment what happens if this one gets too long.",
      date: "March 5th, 2014",
    },
    {
      // id: 3,
      commenterImage: "http://placekitten.com/50/50",
      username: "parthfloyd",
      commentText:
        "Hello this is a test comment what happens if this one gets too long.",
      date: "March 5th, 2014",
    },
    {
      // id: 4,
      commenterImage: "http://placekitten.com/50/50",
      username: "parthfloyd",
      commentText:
        "Hello this is a test comment what happens if this one gets too long.",
      date: "March 5th, 2014",
    },
  ];

  // ------------------ taken from student.js --------------- //
  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const month = monthNames[monthIndex];

    return `${day} ${month} ${year}`;
  }

  const [conversation, setConversation] = useState(commentsData);

  const addToConversation = () => {
    //TODO: Instead of manipulating local data, use api's
    if (textMessage.trim(" ").length === 0) return;
    else {
      const tempCopy = conversation.slice();
      tempCopy.push({
        commenterImage: "http://placekitten.com/50/50", // replace with avatar from db
        username: data.user,
        commentText: textMessage,
        date: formatDate(new Date()),
      });
      setConversation(tempCopy);
      setTextMessage("");
    }
  };

  const commentItems = conversation.map((comment, index) => (
    <li
      key={index}
      style={
        comment.username === data.user ? { backgroundColor: "#ededed" } : {}
      }
    >
      <div className="commenterImage">
        <img src={comment.commenterImage} />
      </div>
      <div className="commentText">
        <p className="">
          {" "}
          <a className="commenterUsername link">{comment.username}</a>
          <br />
          {comment.commentText}
        </p>{" "}
        <span className="date sub-text">{comment.date}</span>
      </div>
    </li>
  ));

  return (
    <div className="inbox-container">
      <div className="left-inbox">
        <div className="inbox-create-dm">
          Create DM
          <svg
            onClick={() => setSelection("create-dm")}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="header-icons cursor-enabled"
            style={{ width: "18px", height: "18px", float: "right" }}
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
        </div>

        {/* map through friends list for now, but will prob have a seperate dm table to store conversations */}

        <div className="left-inbox-contacts">
          <div
            className="inbox-contact cursor-enabled"
            onClick={() => setSelection("conversations")}
          >
            <div className="commenterImage">
              <img src={"http://placekitten.com/50/50"} />
            </div>
            {/* temp username */}
            <div className="inbox-username">{conversation[0].username}</div>
          </div>
        </div>
      </div>
      <div className="right-inbox">
        {/* conversation body */}
        {selection === "create-dm" ? (
          <div>
            <div className="inbox-search">
              <form
                id="search_form"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <button type="submit" id="search_button">
                  <svg
                    id="search_icon"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                  </svg>
                </button>

                <input
                  type="text"
                  name="searchbar"
                  placeholder={"Search Users"}
                  id="search_bar"
                  // value={search}
                  // onChange={(e) => setSearch(e.target.value)}
                  autoComplete="off"
                />
              </form>
            </div>
            <div
              style={{
                marginTop: "45px",
                padding: "15px",
                fontSize: "15px",
                width: "100%",
                color: "#3d3d3d",
              }}
            >
              <b>Hint: </b>Find a user to start a conversation with.
            </div>
          </div>
        ) : (
          <div>
            <div className="right-panel-coments" style={{ height: "423px" }}>
              <div className="commentsContainer" id="comment">
                <ul className="commentList">{commentItems}</ul>
              </div>
            </div>

            <div className="inbox-textarea">
              <form
                className="form-inline"
                onSubmit={(e) => {
                  e.preventDefault();
                  addToConversation();
                }}
              >
                <input
                  className="comment-input"
                  type="text"
                  value={textMessage}
                  // temp username
                  placeholder={`Message @${conversation[0].username}`}
                  onChange={(e) => setTextMessage(e.target.value)}
                />
                <button
                  className="comment-send-button"
                  type="button"
                  onClick={addToConversation}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="header-icons"
                    style={{ width: "20px", height: "20px", marginTop: "10px" }}
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;

import { useEffect } from "react";

const Message = ({ message, setMessage }) => {
  useEffect(() => {
    if (message.title) {
      //   // auto scrolls up to view message
      var element = document.getElementById("message");
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }, [message]);

  if (message.title) {
    return (
      <div className="search-results" id="message">
        <div
          style={{
            backgroundColor: "#3d3d3d",
            padding: "10px",
            borderTopLeftRadius: "5px",
            borderTopRightRadius: "5px",
          }}
        >
          <b style={{ color: "#fafafa", paddingLeft: "5px" }}>
            To be implemented ~ {message.title}
          </b>
          <span style={{ float: "right" }}>
            <div
              className="header-icons cursor-enabled exit"
              onClick={() =>
                setMessage({
                  title: null,
                  body: null,
                })
              }
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
  }
};

export default Message;

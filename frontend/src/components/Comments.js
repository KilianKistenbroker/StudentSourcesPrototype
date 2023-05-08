import { useEffect } from "react";

const Comments = ({ data, commentsData }) => {
  // useEffect(() => {
  //   // auto scrolls down right-panel
  //   var element = document.getElementById("comment");
  //   element.scrollIntoView({
  //     behavior: "smooth",
  //     block: "end",
  //     inline: "nearest",
  //   });
  // }, [commentsData]);

  const commentItems = commentsData.map((comment, index) => (
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
    <div className="commentsContainer" id="comment">
      <ul className="commentList">{commentItems}</ul>
    </div>
  );
};

export default Comments;

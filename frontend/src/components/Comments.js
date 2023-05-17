const Comments = ({ data, commentsData }) => {
  const commentItems = commentsData.map((comment, index) => (
    <li
      key={index}
      style={comment.user === data.user ? { backgroundColor: "#ededed" } : {}}
    >
      {/* <img src={comment.commenterImage} /> */}
      <div className="box-icon"></div>

      <div className="commentText" style={{ paddingLeft: "10px" }}>
        <p className="">
          {" "}
          <a className="commenterUsername link">{comment.user}</a>
          <br />
          {comment.message}
        </p>{" "}
        <span className="date sub-text">{comment.date_posted}</span>
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

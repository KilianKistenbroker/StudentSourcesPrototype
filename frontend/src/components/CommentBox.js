const CommentBox = ({ comment, setComment, addComment }) => {
  return (
    <form
      className="form-inline"
      onSubmit={(e) => {
        e.preventDefault();
        addComment();
      }}
    >
      <input
        className="comment-input"
        type="text"
        value={comment}
        placeholder="Leave a comment"
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        className="comment-send-button"
        type="button"
        // onClick={addComment}
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
  );
};

export default CommentBox;

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
        onClick={addComment}
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
        {/* <svg
          className="header-icons"
          style={{ width: "25px", height: "25px", marginTop: "10px" }}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.33 3.66996C20.1408 3.48213 19.9035 3.35008 19.6442 3.28833C19.3849 3.22659 19.1135 3.23753 18.86 3.31996L4.23 8.19996C3.95867 8.28593 3.71891 8.45039 3.54099 8.67255C3.36307 8.89471 3.25498 9.16462 3.23037 9.44818C3.20576 9.73174 3.26573 10.0162 3.40271 10.2657C3.5397 10.5152 3.74754 10.7185 4 10.85L10.07 13.85L13.07 19.94C13.1906 20.1783 13.3751 20.3785 13.6029 20.518C13.8307 20.6575 14.0929 20.7309 14.36 20.73H14.46C14.7461 20.7089 15.0192 20.6023 15.2439 20.4239C15.4686 20.2456 15.6345 20.0038 15.72 19.73L20.67 5.13996C20.7584 4.88789 20.7734 4.6159 20.7132 4.35565C20.653 4.09541 20.5201 3.85762 20.33 3.66996ZM4.85 9.57996L17.62 5.31996L10.53 12.41L4.85 9.57996ZM14.43 19.15L11.59 13.47L18.68 6.37996L14.43 19.15Z"
            fill="#000000"
          />
        </svg> */}
      </button>
    </form>
  );
};

export default CommentBox;

const SplashMessage = ({ splashMsg, setSplashMsg }) => {
  return splashMsg.isShowing ? (
    <button
      className="splashMsg show-splash"
      id="splash"
      onBlur={() =>
        setTimeout(() => {
          setSplashMsg({
            message: splashMsg.message,
            isShowing: false,
          });
        }, 500)
      }
      onClick={() =>
        setTimeout(() => {
          setSplashMsg({
            message: splashMsg.message,
            isShowing: false,
          });
        }, 500)
      }
    >
      {splashMsg.message}
    </button>
  ) : (
    <button className="splashMsg hide-splash" id="splash">
      {splashMsg.message}
    </button>
  );
};

export default SplashMessage;

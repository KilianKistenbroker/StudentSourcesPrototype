import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../api/axios";
import Footer from "../components/Footer";
import retreiveJSON from "../helpers/retrieveJson";
import explorer from "../data/folderData";
import uploadJson from "../helpers/uploadJson";
import initTrash from "../helpers/initializeTrash";

const user_endpoint = "/users";

const Login = ({
  data,
  windowDimension,
  setSplashMsg,
  setExplorerData,
  setTrash,
  setCurrentDirectory,
}) => {
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();

  // this refers to username
  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [showingPassword, setShowingPassword] = useState(false);

  // these are used for displaying msg's
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (user.length > 0) setValidName(true);
    else setValidName(false);
  }, [user]);

  useEffect(() => {
    if (password.length > 0) setValidPassword(true);
    else setValidPassword(false);
  }, [password]);

  useEffect(() => {
    setErrMsg("");
  }, [user, password]);

  const handleHiddenPassword = () => {
    setShowingPassword(!showingPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrMsg("");

    var element;

    if (!validName) {
      element = document.getElementById("username");
      element.focus();
      return;
    } else if (!validPassword) {
      element = document.getElementById("password");
      element.focus();
      return;
    }

    // if (!validName || !validPassword) {
    //   setErrMsg("Invalid entry.");
    //   return;
    // }

    try {
      const res = await axios.get(`/login/${user}/${password}`);

      if (res.data.id === -1) {
        setErrMsg("Invalid email or username.");
      } else if (res.data.id === -2) {
        setErrMsg("Invalid password.");
      } else if (res.data.id > 0) {
        data.user = user;
        data.firstName = res.data.firstName;
        data.lastName = res.data.lastName;
        data.email = res.data.email;
        data.password = password;
        data.id = res.data.id;
        data.token = res.data.password;

        // console.log("font end data: " + data);
        // console.log("back end data: " + res.data);

        retreiveJSON(data).then((ret) => {
          if (ret === -1) {
            // console.log("could not get user home directory");
            // console.log("creating new home directory");

            // changing ret to dummy data
            // ret = explorer;

            // TEMP PLACEMENT: creating new home directory
            // const ret2 = uploadJson(`${data.id}`, explorer);
            // if (ret2 === -1) {
            //   setErrMsg("Could not create new account.");
            //   return;
            // }

            setUser("");
            setPassword("");

            setSplashMsg({
              message: "Unable to retrieve files",
              isShowing: true,
            });

            return;
          }

          setExplorerData(ret);
          const res = initTrash(ret, setTrash);
          if (res === -1) {
            setErrMsg("Failed to initialize trashbin.");
            return;
          }
          setCurrentDirectory(ret);

          localStorage.setItem("data", JSON.stringify(data));

          // clear input fields here
          setUser("");
          setPassword("");

          window.scrollTo(0, 0);
          navigate("/student");

          setSplashMsg({
            message: "Welcome back!",
            isShowing: true,
          });

          return;
        });
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No server response.");
      }
      errRef.current.focus();
    }
  };

  return (
    // convert this to swap grid style and ordering when window is too thin

    <>
      {windowDimension.winWidth > 1050 ? (
        <div className="page">
          <div className="signup">
            <div className="ad">
              <h3>Study with Student Sources </h3>
              <br />

              <div className="body">
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4H2.19zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707z" />
                  </svg>
                </div>
                <div className="item">
                  <p className="header">Organinze</p>
                  your files and notes. <br /> <br />
                </div>

                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
                  </svg>
                </div>
                <div className="item">
                  <p className="header">Collaborate,</p>
                  download, and share files. <br />
                  <br />
                </div>

                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5ZM3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.58 26.58 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.933.933 0 0 1-.765.935c-.845.147-2.34.346-4.235.346-1.895 0-3.39-.2-4.235-.346A.933.933 0 0 1 3 9.219V8.062Zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a24.767 24.767 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25.286 25.286 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135Z" />
                    <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2V1.866ZM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5Z" />
                  </svg>
                </div>
                <div className="item">
                  <p className="header">Streamline</p>
                  your workflow with advanced A.I. <br />
                  <br />
                </div>
              </div>
            </div>

            <div className="content">
              <h1>
                Login
                <Link
                  className="tiny link"
                  to={"/sign-up"}
                  onClick={() => window.scrollTo(0, 0)}
                  id=""
                >
                  or create an account
                </Link>
              </h1>

              <form onSubmit={handleSubmit}>
                {/* SET USERNAME */}

                <label htmlFor="username">
                  Email | Username
                  <span className={validName ? "show_valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                </label>

                <input
                  style={{ height: "50px" }}
                  type="text"
                  id="username"
                  ref={userRef}
                  autoComplete="off"
                  value={user.trim(" ")}
                  onChange={(e) => setUser(e.target.value.trim(" "))}
                  // required
                  aria-invalid={validName ? "false" : "true"}
                  aria-describedby="uidnote"
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                />

                {/* SET PASSWORD */}

                <label htmlFor="password">
                  <div style={{ float: "left" }}>Password :</div>
                  <span className={validPassword ? "show_valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <div>
                    {!showingPassword ? (
                      <svg
                        onClick={handleHiddenPassword}
                        xmlns="http://www.w3.org/2000/svg"
                        className={"display-show"}
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                      </svg>
                    ) : (
                      <svg
                        onClick={handleHiddenPassword}
                        xmlns="http://www.w3.org/2000/svg"
                        className={"display-show"}
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                        <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                      </svg>
                    )}
                  </div>
                </label>

                <input
                  type={showingPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  value={password.trim(" ")}
                  onChange={(e) => setPassword(e.target.value.trim(" "))}
                  // required
                  aria-invalid={validPassword ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                />

                {/* SUBMIT BUTTON */}

                <button
                  style={{ marginTop: "37px" }}
                  // disabled={!validName || !validPassword ? true : false}
                >
                  Continue
                </button>
              </form>

              <p
                ref={errRef}
                className={errMsg ? "errmsg" : "offscreen"}
                aria-live="assertive"
              >
                {errMsg}
              </p>
            </div>

            <div className="messages">
              <div
                id="uidnote"
                className={
                  userFocus
                    ? "instructions firstname_instructions desktop"
                    : "offscreen"
                }
              >
                <div>
                  <span className={validName ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span className={validName ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                  Required field.
                </div>
              </div>

              <div
                id="pwdnote"
                className={
                  passwordFocus
                    ? "instructions lastname_instructions desktop"
                    : "offscreen"
                }
              >
                <div>
                  <span className={validPassword ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span className={validPassword ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                  Required field.
                </div>
              </div>
            </div>
          </div>
          <Footer windowDimension={windowDimension} />
        </div>
      ) : (
        <div className="page">
          <div className="signup-mobile">
            <div className="ad">
              <h3>Study with Student Sources </h3>
              <br />

              <div className="body">
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4H2.19zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707z" />
                  </svg>
                </div>
                <div className="item">
                  <p className="header">Organinze</p>
                  your files and notes. <br /> <br />
                </div>

                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
                  </svg>
                </div>
                <div className="item">
                  <p className="header">Collaborate,</p>
                  download, and share files. <br />
                  <br />
                </div>

                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5ZM3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.58 26.58 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.933.933 0 0 1-.765.935c-.845.147-2.34.346-4.235.346-1.895 0-3.39-.2-4.235-.346A.933.933 0 0 1 3 9.219V8.062Zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a24.767 24.767 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25.286 25.286 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135Z" />
                    <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2V1.866ZM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5Z" />
                  </svg>
                </div>
                <div className="item">
                  <p className="header">Streamline</p>
                  your workflow with advanced A.I. <br />
                  <br />
                </div>
              </div>
            </div>

            <div className="content-mobile">
              <h1>
                Login
                <Link
                  className="tiny link"
                  to={"/sign-up"}
                  onClick={() => window.scrollTo(0, 0)}
                  id=""
                >
                  or create an account
                </Link>
              </h1>

              <form onSubmit={handleSubmit}>
                {/* SET USERNAME */}

                <label htmlFor="username">
                  Email | Username
                  <span className={validName ? "show_valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                </label>

                <input
                  style={{ height: "50px" }}
                  type="text"
                  id="username"
                  ref={userRef}
                  autoComplete="off"
                  value={user.trim(" ")}
                  onChange={(e) => setUser(e.target.value.trim(" "))}
                  // required
                  aria-invalid={validName ? "false" : "true"}
                  aria-describedby="uidnote"
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                />

                {/* SET PASSWORD */}

                <label htmlFor="password">
                  <div style={{ float: "left" }}>Password :</div>
                  <span className={validPassword ? "show_valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <div>
                    {!showingPassword ? (
                      <svg
                        onClick={handleHiddenPassword}
                        xmlns="http://www.w3.org/2000/svg"
                        className={"display-show"}
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                      </svg>
                    ) : (
                      <svg
                        onClick={handleHiddenPassword}
                        xmlns="http://www.w3.org/2000/svg"
                        className={"display-show"}
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                        <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                      </svg>
                    )}
                  </div>
                </label>

                <input
                  style={{ height: "50px" }}
                  type={showingPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  value={password.trim(" ")}
                  onChange={(e) => setPassword(e.target.value.trim(" "))}
                  // required
                  aria-invalid={validPassword ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                />

                {/* SUBMIT BUTTON */}

                <button
                  style={{ marginTop: "37px" }}
                  // disabled={!validName || !validPassword ? true : false}
                >
                  Continue
                </button>
              </form>

              <p
                ref={errRef}
                className={errMsg ? "errmsg" : "offscreen"}
                aria-live="assertive"
              >
                {errMsg}
              </p>
            </div>

            <div className="messages-mobile">
              <div
                id="uidnote"
                className={userFocus ? "instructions" : "offscreen"}
              >
                <div>
                  <span className={validName ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span className={validName ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                  Please enter an email or username.
                </div>
              </div>

              <div
                id="pwdnote"
                className={passwordFocus ? "instructions " : "offscreen"}
              >
                <div>
                  <span className={validPassword ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span className={validPassword ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                  Please enter a password.
                </div>
              </div>
            </div>
          </div>

          <Footer windowDimension={windowDimension} />
        </div>
      )}
    </>
  );
};

export default Login;

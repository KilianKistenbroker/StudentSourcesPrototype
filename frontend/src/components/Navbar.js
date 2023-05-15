import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../logos/Light-Version.png";

export default function Navbar({
  data,
  windowDimension,
  message,
  setMessage,
  setSplashMsg,
  explorerData,
  storageLimit,
}) {
  const [topRightNav, setTopRightNave] = useState("");
  // const [showUserPanel, setShowUserPanel] = useState(false);
  // const [showNotifications, setShowNotifications] = useState(false);
  const [display, setDisplay] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/"
    ) {
      setTopRightNave("Sign up");
    } else {
      setTopRightNave("Login");
    }
  }, [window.location.pathname]);

  // ---------- reused from INFO component ---------- //
  function formatBytes(size) {
    const bytes = size;
    const kilobytes = bytes / 1000;
    const megabytes = bytes / (1000 * 1000);

    if (megabytes >= 1000) {
      const gigabytes = bytes / (1000 * 1000 * 1000);
      return `${gigabytes.toFixed(2)} GB`;
    } else if (kilobytes >= 1000) {
      return `${megabytes.toFixed(2)} MB`;
    } else {
      return `${kilobytes.toFixed(2)} KB`;
    }
  }

  const testLogout = (e) => {
    e.preventDefault();
    setDisplay("");
    setMessage({
      title: null,
      body: null,
    });
    // data.isLoggedIn = false;
    data.id = -1;
    localStorage.clear();
    window.scrollTo(0, 0);
    navigate("/login");

    setSplashMsg({
      message: "Goodbye!",
      isShowing: true,
    });
  };

  const handleNav = (destination) => {
    console.log("current pathname: ");
    console.log(window.location.pathname);
    window.scrollTo(0, 0);

    if (window.location.pathname === "/" + destination) {
      window.location.reload();
    }

    // temp location for reseting message
    setMessage({
      title: null,
      body: null,
    });
  };

  const handleSetWindow = (state) => {
    if (state === "Account") {
      if (window.location.pathname !== "/student") {
        navigate("/student");
        setMessage({
          title: "Account",
          body: "hold",
        });
        setDisplay("");
      } else {
        setMessage({
          title: "Account",
          body: null,
        });
      }
    } else {
      if (window.location.pathname !== "/student") {
        navigate("/student");
        setMessage({
          title: "Inbox",
          body: "hold",
        });
      } else {
        setMessage({
          title: "Inbox",
          body: null,
        });
      }
    }

    setDisplay("");
  };

  const handleSetFocus = (state) => {
    const element = document.getElementById(state);
    if (state == "userpanel") {
      setDisplay("userpanel");
    } else {
      setDisplay("notifications");
    }
    element.focus();
  };

  return (
    <>
      {" "}
      {data.id > 0 ? (
        <div
          className={
            windowDimension.winWidth > 500
              ? "navbar navbar-desktop navbar-3by1"
              : "navbar navbar-mobile navbar-3by1"
          }
        >
          {display === "userpanel" ? (
            <button
              id="userpanel"
              className="user-panel displaying user-account"
              onBlur={() => setDisplay("")}
            >
              {/* indicate storage limit somewhere here */}

              <div
                style={{
                  lineHeight: "10px",
                  margin: "20px",
                  textAlign: "left",
                }}
              >
                <label htmlFor="">
                  {`${formatBytes(explorerData.size)} / ${formatBytes(
                    storageLimit
                  )}`}
                </label>
                {/* storage limit ~ container */}
                <div
                  style={{
                    backgroundColor: "lightgray",
                    marginTop: "10px",
                    width: "200px",
                    borderRadius: "100px",
                  }}
                >
                  {/* currently stored */}
                  <div
                    style={{
                      backgroundColor: "limegreen",
                      height: "10px",
                      width: `${(explorerData.size / storageLimit) * 100}%`,
                      borderRadius: "100px",
                    }}
                  ></div>
                </div>
              </div>

              <ul>
                <div
                  className="option"
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    handleSetWindow("Account");
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSetWindow("Account");
                  }}
                >
                  Account
                </div>
                <div
                  className="option"
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    handleSetWindow("Inbox");
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSetWindow("Inbox");
                  }}
                >
                  Inbox
                </div>
                <div
                  className="option"
                  onTouchEnd={testLogout}
                  onClick={testLogout}
                >
                  Logout
                </div>
              </ul>
            </button>
          ) : (
            <button id="userpanel" className="user-panel hiding"></button>
          )}

          {windowDimension.winWidth > 500 ? (
            <Link
              onClick={() => {
                handleNav("student");
              }}
              id="logo-link"
              to={"/student"}
            >
              <img src={logo} className="logo" alt="" />
            </Link>
          ) : (
            <div style={{ height: "50px" }}></div>
          )}

          {display === "notifications" ? (
            <button
              id="notifications"
              className="user-panel displaying notifications"
              onBlur={() => setDisplay("")}
            >
              ~ No new notifications ~
            </button>
          ) : (
            <button id="notifications" className="user-panel hiding"></button>
          )}

          <div
            className={
              windowDimension.winWidth > 500
                ? "nav-nav nav-nav-desktop"
                : "nav-nav nav-nav-mobile"
            }
          >
            <Link
              to="/student"
              onClick={() => {
                handleNav("student");
              }}
              // style={
              //   window.location.pathname === "/student"
              //     ? { color: "dimgrey" }
              //     : { color: "lightgrey" }
              // }
              className={
                window.location.pathname === "/student"
                  ? "root selected-root"
                  : "root"
              }
            >
              Student
            </Link>

            <div className="divider"> | </div>

            {/* if current point is student then this will bring user back to root of sources page*/}
            <Link
              to="/sources"
              onClick={() => {
                handleNav("sources");
              }}
              // style={
              //   window.location.pathname === "/sources"
              //     ? { color: "dimgrey" }
              //     : { color: "lightgrey" }
              // }
              className={
                window.location.pathname === "/sources"
                  ? "root selected-root"
                  : "root"
              }
            >
              Sources
            </Link>
          </div>

          <div
            style={{
              justifySelf: "right",
              minWidth: "90px",
              marginTop: "10px",
            }}
          >
            <Link
              style={{ marginRight: "20px" }}
              onClick={() => {
                handleSetFocus("notifications");
              }}
            >
              {
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="header-icons cursor-enabled"
                  style={{ marginTop: "8px" }}
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
                </svg>
              }
            </Link>

            <Link
              onClick={() => {
                handleSetFocus("userpanel");
              }}
              style={{ float: "right" }}
            >
              {
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="user-nav-icon"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                </svg>
              }
            </Link>
          </div>
        </div>
      ) : (
        <div className="navbar navbar-desktop navbar-2by1">
          <Link
            id="logo-link"
            onClick={() => {
              handleNav("");
            }}
            to={"/"}
          >
            <img src={logo} className="logo" alt="" />
          </Link>

          <div></div>

          {windowDimension.winWidth > 800 ? (
            <div style={{ justifySelf: "right", width: "230px" }}>
              <Link
                to={"/sign-up"}
                onClick={() => window.scrollTo(0, 0)}
                id={"login"}
                className="top-right-nav"
              >
                Sign up
              </Link>
              <Link
                to={"/login"}
                onClick={() => window.scrollTo(0, 0)}
                id={"login"}
                className="top-right-nav"
              >
                Login
              </Link>
            </div>
          ) : (
            <Link
              to={topRightNav === "Login" ? "/login" : "/sign-up"}
              onClick={() => window.scrollTo(0, 0)}
              id={"login"}
              className="top-right-nav"
            >
              {topRightNav}
            </Link>
          )}
        </div>
      )}{" "}
    </>
  );
}

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../logos/Light-Version.png";

export default function Navbar({ data, windowDimension, message, setMessage }) {
  const [topRightNav, setTopRightNave] = useState("");
  // const [showUserPanel, setShowUserPanel] = useState(false);
  // const [showNotifications, setShowNotifications] = useState(false);
  const [display, setDisplay] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === "/login") {
      setTopRightNave("Sign up");
    } else {
      setTopRightNave("Login");
    }
  }, [window.location.pathname]);

  const testLogout = (e) => {
    e.preventDefault();
    setDisplay("");
    setMessage({
      title: null,
      body: null,
    });
    data.isLoggedIn = false;
    localStorage.clear();
    navigate("/login");
  };

  const handleNav = (destination) => {
    console.log("current pathname: ");
    console.log(window.location.pathname);

    if (window.location.pathname === "/" + destination) {
      window.location.reload();
    }

    // temp location for reseting message
    setMessage({
      title: null,
      body: null,
    });
  };

  const handleSetFocus = (state) => {
    console.log(state);
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
      {data.isLoggedIn ? (
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
              onFocus={() => console.log("focused user")}
              onBlur={() => setDisplay("")}
            >
              <ul>
                <div
                  className="option"
                  onClick={() => {
                    setMessage({
                      title: "Account",
                      body: "This feature shall allow the user the options to view, update, or delete their account.",
                    });
                    setDisplay("");
                  }}
                >
                  Account
                </div>
                <div
                  className="option"
                  onClick={() => {
                    setMessage({
                      title: "Inbox",
                      body: "This feature shall allow the user to view, delete, and send direct messages.",
                    });
                    setDisplay("");
                  }}
                >
                  Inbox
                </div>
                <div
                  className="option"
                  onClick={() => {
                    setMessage({
                      title: "Settings",
                      body: "This feature shall provide accessibilty options for configuring the general layout and theme of the website.",
                    });
                    setDisplay("");
                  }}
                >
                  Settings
                </div>
                <div
                  className="option"
                  onClick={() => {
                    setMessage({
                      title: "Help",
                      body: "This feature shall provide simplified instructions on how to navigate the basic features of the website.",
                    });
                    setDisplay("");
                  }}
                >
                  Help
                </div>
                <div className="option" onClick={testLogout}>
                  Logout
                </div>
              </ul>
            </button>
          ) : (
            <button id="userpanel" className="user-panel hiding"></button>
          )}

          {windowDimension.winWidth > 500 ? (
            <Link
              onClick={() => window.location.reload()}
              id="logo-link"
              to={"/sources"}
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
              onFocus={() => console.log("focused notifications")}
              onBlur={() => setDisplay("")}
            >
              ~ TO BE IMPLEMENTED ~
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
              onClick={() => handleNav("student")}
              style={
                window.location.pathname === "/student"
                  ? { color: "dimgrey" }
                  : { color: "lightgrey" }
              }
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
              onClick={() => handleNav("sources")}
              style={
                window.location.pathname === "/sources"
                  ? { color: "dimgrey" }
                  : { color: "lightgrey" }
              }
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
          <Link id="logo-link" to={"/sign-up"}>
            <img src={logo} className="logo" alt="" />
          </Link>

          <div></div>

          <Link
            to={topRightNav === "Login" ? "/login" : "/sign-up"}
            id={"login"}
            className="top-right-nav"
          >
            {topRightNav}
          </Link>
        </div>
      )}{" "}
    </>
  );
}

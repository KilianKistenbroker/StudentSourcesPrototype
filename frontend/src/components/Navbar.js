import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../logos/Light-Version.png";

export default function Navbar({ data, windowDimension }) {
  const [topRightNav, setTopRightNave] = useState("Login");
  const navigate = useNavigate();

  useEffect(() => {
    if (data.currentPoint === "login") {
      setTopRightNave("Sign up");
    } else {
      setTopRightNave("Login");
    }
  }, [data.currentPoint]);

  const goToSignUp = (e) => {
    e.preventDefault();

    data.currentPoint = "";
    navigate("/" + data.currentPoint);
  };

  const testLogout = (e) => {
    e.preventDefault();
    data.currentPoint = "login";
    data.isLoggedIn = false;
    localStorage.clear();
    navigate("/login");
  };

  const swapName = (e) => {
    e.preventDefault();

    if (data.currentPoint === "login") {
      data.currentPoint = "";
    } else {
      data.currentPoint = "login";
    }

    navigate("/" + data.currentPoint);
  };

  const handleNav = (destination) => {
    console.log("current pathname: ");
    console.log(window.location.pathname);

    if (window.location.pathname === "/" + destination) {
      window.location.reload();
    }
  };

  if (data.isLoggedIn) {
  }

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

          <Link
            id="user-nav"
            to="/"
            className="top-right-nav"
            onClick={testLogout}
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
      ) : (
        <div className="navbar navbar-desktop navbar-2by1">
          <Link id="logo-link" to={"/"} onClick={goToSignUp}>
            <img src={logo} className="logo" alt="" />
          </Link>

          <div></div>

          <Link
            id={topRightNav === "Login" ? "login" : "signup"}
            to={"/" + data.currentPoint}
            onClick={swapName}
            className="top-right-nav"
          >
            {topRightNav}
          </Link>
        </div>
      )}{" "}
    </>
  );
}

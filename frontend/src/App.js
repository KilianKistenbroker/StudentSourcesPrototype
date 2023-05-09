import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sources from "./pages/Sources";
import Terms from "./pages/Terms";
import { useEffect, useState } from "react";
import axios from "./api/axios";
import Student from "./pages/Student";
import folderData from "./data/folderData";
import LearnMore from "./pages/LearnMore";
import Credits from "./pages/Credits";
import AboutUs from "./pages/AboutUs";
import trashData from "./data/trashData";

function App() {
  const [loading, setLoading] = useState(null);
  const [explorerData, setExplorerData] = useState(folderData);

  // intitializing to test render
  const [trash, setTrash] = useState(trashData.items);
  const [storageLimit, setStorageLimit] = useState(1e9);
  const [splashMsg, setSplashMsg] = useState({
    message: "",
    isShowing: false,
  });
  const [message, setMessage] = useState({
    title: "",
    body: "",
  });

  // or we can pass setExploreData and setTrash as props to Login.js and SignUp.js
  const getFolderData = async () => {
    // set loading to true
    // get folderdata from backend
    // init explorer data with folderdata
    // init trash data with trash folder in folder data
    // set loading to false
  };

  // ------------ store user info from login/signup ---------- //

  const [data, setData] = useState({
    user: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    id: -1,
  });

  useEffect(() => {
    // ------------- check session status here (TODO) ------------- //

    if (localStorage.getItem("data")) {
      handleAuthenticate();
      console.log(trash);
    } else {
      setLoading(true);
    }
  }, []);

  useEffect(() => {
    if (splashMsg.isShowing) {
      var element = document.getElementById("splash");
      element.focus();
    }
  }, [splashMsg]);

  // ------------ authenticate localstorage ----------- //

  const handleAuthenticate = async () => {
    let tempData = {};
    setData((tempData = JSON.parse(localStorage.getItem("data"))));

    try {
      const res = await axios.get(
        `/authenticate/${tempData.password}/${tempData.id}`
      );
      if (res.data === false) {
        localStorage.clear();
        window.location.reload();
      }
      setLoading(true);
    } catch (err) {
      if (!err?.response) {
        setLoading(false);
        return;
      }
    }
  };

  // --------- listen for screen resizing here --------- //

  const [windowDimension, setWindowDimension] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
    mobileMode: null,
  });
  const detectSize = () => {
    setWindowDimension({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
      mobileMode: window.innerWidth < 800,
    });
  };
  useEffect(() => {
    window.addEventListener("resize", detectSize);

    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [windowDimension]);

  // ------ check for initial server response ----------//

  if (loading === null) {
    return <div className="App">Loading...</div>;
  } else if (loading === false) {
    return <div className="App">No server response...</div>;
  }

  return (
    <div className="App">
      {/* ----------- splash message ------------ */}

      {splashMsg.isShowing ? (
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
        >
          {splashMsg.message}
        </button>
      ) : (
        <button className="splashMsg hide-splash" id="splash">
          {splashMsg.message}
        </button>
      )}

      {/* ------------- router pages ------------ */}

      <Router>
        <Navbar
          data={data}
          windowDimension={windowDimension}
          message={message}
          setMessage={setMessage}
          setSplashMsg={setSplashMsg}
          // for displaying remaining storage on account
          // currentStorage={currentStorage}
          explorerData={explorerData}
          storageLimit={storageLimit}
        />

        <Routes>
          <Route
            path="/"
            element={<LearnMore windowDimension={windowDimension} />}
          />
          <Route
            path="/sign-up"
            element={
              <Signup
                data={data}
                windowDimension={windowDimension}
                message={message}
                setMessage={setMessage}
                setSplashMsg={setSplashMsg}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Login
                data={data}
                windowDimension={windowDimension}
                message={message}
                setMessage={setMessage}
                setSplashMsg={setSplashMsg}
              />
            }
          />
          <Route
            path="/sources"
            element={
              <Sources
                data={data}
                windowDimension={windowDimension}
                message={message}
                setMessage={setMessage}
              />
            }
          />
          <Route
            path="/student"
            element={
              <Student
                data={data}
                windowDimension={windowDimension}
                owner={data}
                explorerData={explorerData}
                setExplorerData={setExplorerData}
                message={message}
                setMessage={setMessage}
                setSplashMsg={setSplashMsg}
                trashItems={trash}
                setTrashItems={setTrash}
              />
            }
          />
          <Route
            path="/terms"
            element={<Terms windowDimension={windowDimension} />}
          />
          <Route
            path="/credits"
            element={<Credits windowDimension={windowDimension} />}
          />
          <Route
            path="/about-us"
            element={<AboutUs windowDimension={windowDimension} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

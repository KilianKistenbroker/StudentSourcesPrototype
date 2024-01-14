import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sources from "./pages/Sources";
import Terms from "./pages/Terms";
import { useEffect, useState } from "react";
import axios from "./api/axios";
import Student from "./pages/Student";
import LearnMore from "./pages/LearnMore";
import Credits from "./pages/Credits";
import AboutUs from "./pages/AboutUs";
import retreiveJSON from "./helpers/retrieveJson";
import SplashMessage from "./components/SplashMessage";
import initTrash from "./helpers/initializeTrash";
import dummyFolder from "./data/dummyFolder";

function App() {
  const [loading, setLoading] = useState(null);
  const [explorerData, setExplorerData] = useState(null);
  const [currentDirectory, setCurrentDirectory] = useState(null);
  const [trash, setTrash] = useState(null);

  const [storageLimit, setStorageLimit] = useState(1e9);
  const [splashMsg, setSplashMsg] = useState({
    message: "",
    isShowing: false,
  });
  const [message, setMessage] = useState({
    title: "",
    body: "",
  });

  // ------------ store user info from login/signup ---------- //
  const [data, setData] = useState({
    user: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    id: -1, // <- replace with generated access token from backend
    token: "",
  });

  useEffect(() => {
    // ------------- check session status here (TODO) ------------- //

    if (localStorage.getItem("data")) {
      handleAuthenticate();
    } else {
      // this is here to prevent null pointer exception, when localhost is cleared
      setExplorerData(dummyFolder);
      setCurrentDirectory(dummyFolder);
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
        `/authenticate/${tempData.password}/${tempData.id}/${tempData.token}`
      );
      if (res.data === false) {
        console.log("unauthorized entry");
        localStorage.clear();
        window.location.reload();
      } else {
        retreiveJSON(`${tempData.id}`).then((ret) => {
          if (ret === -1) {
            console.log("could not get user home directory");
            localStorage.clear();
            window.location.reload();
            setLoading(false);
            return;
          }
          setExplorerData(ret);
          setCurrentDirectory(ret);
          const res = initTrash(ret, setTrash);
          setLoading(true);

          console.log("explorer from backend:");
          console.log(ret);
        });
      }
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
    return (
      <div className="App">
        <SplashMessage splashMsg={splashMsg} setSplashMsg={setSplashMsg} />
        Loading...
      </div>
    );
  } else if (loading === false) {
    return (
      <div className="App">
        <SplashMessage splashMsg={splashMsg} setSplashMsg={setSplashMsg} />
        No server response...
      </div>
    );
  }

  return (
    <div className="App">
      {/* ----------- splash message ------------ */}

      <SplashMessage splashMsg={splashMsg} setSplashMsg={setSplashMsg} />

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
                setExplorerData={setExplorerData}
                setTrash={setTrash}
                setCurrentDirectory={setCurrentDirectory}
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
                setExplorerData={setExplorerData}
                setTrash={setTrash}
                setCurrentDirectory={setCurrentDirectory}
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
                currentDirectory={currentDirectory}
                setCurrentDirectory={setCurrentDirectory}
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

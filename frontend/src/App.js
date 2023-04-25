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

function App() {
  const [loading, setLoading] = useState(null);
  const [explorerData, setExplorerData] = useState(folderData);
  const [message, setMessage] = useState({
    title: "",
    body: "",
  });

  // ------------ store user info from login/signup ---------- //

  const [data, setData] = useState({
    user: "",
    password: "",
    isLoggedIn: false,
    id: -1,
  });

  useEffect(() => {
    // ------------- check session status here (TODO) ------------- //

    if (localStorage.getItem("data")) {
      handleAuthenticate();
    } else {
      setLoading(true);
    }
  }, []);

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

  // ------ check for server response ----------//

  if (loading === null) {
    return <div className="App">Loading...</div>;
  } else if (loading === false) {
    return <div className="App">No server response...</div>;
  }

  // --------- manage routing here ----------- //

  return (
    <div className="App">
      <Router>
        <Navbar
          data={data}
          windowDimension={windowDimension}
          message={message}
          setMessage={setMessage}
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
        </Routes>
      </Router>
    </div>
  );
}

export default App;

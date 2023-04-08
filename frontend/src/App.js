import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Navbar from "./layout/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sources from "./pages/Sources";
import Legal from "./pages/Terms";
import { useEffect, useState } from "react";
import axios from "./api/axios";
import Student from "./pages/Student";

function App() {
  const [loading, setLoading] = useState(null);

  const [data, setData] = useState({
    user: "",
    password: "",
    currentPoint: "",
    isLoggedIn: false,
    id: -1,
  });

  useEffect(() => {
    // check session status here ???

    if (localStorage.getItem("data")) {
      handleAuthenticate();
    } else {
      setLoading(true);
    }
  }, []);

  // authenticates that localstorage is still valid
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

  // listen for screen resizing here
  const [windowDimension, setWindowDimension] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  });

  const detectSize = () => {
    setWindowDimension({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", detectSize);

    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [windowDimension]);

  // make this pretty later
  if (loading === null) {
    return <div className="App">Loading...</div>;
  } else if (loading === false) {
    return <div className="App">No server response...</div>;
  }

  return (
    <div className="App">
      <Router>
        <Navbar data={data} windowDimension={windowDimension} />

        <Routes>
          <Route
            path="/"
            element={<Signup data={data} windowDimension={windowDimension} />}
          />
          <Route
            path="/login"
            element={<Login data={data} windowDimension={windowDimension} />}
          />
          <Route
            path="/sources"
            element={<Sources data={data} windowDimension={windowDimension} />}
          />
          <Route
            path="/student"
            element={<Student data={data} windowDimension={windowDimension} />}
          />
          <Route path="/terms" element={<Legal />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

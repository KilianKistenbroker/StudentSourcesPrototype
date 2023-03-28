import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Navbar from "./layout/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sources from "./pages/Sources";
import Legal from "./pages/Terms";
import { useEffect, useState } from "react";
import axios from "./api/axios";

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
    const res = await axios.get(
      `/users/?user=${tempData.user}&password=${tempData.password}&id=${tempData.id}`
    );
    if (res.data.length === 0) {
      localStorage.clear();
      window.location.reload();
    }
    setLoading(true);
  };

  if (loading === null) {
    return <div className="App">{/* invisible loading screen */}</div>;
  }

  return (
    <div className="App">
      <Router>
        <Navbar data={data} />

        <Routes>
          <Route path="/" element={<Signup data={data} />} />
          <Route path="/login" element={<Login data={data} />} />
          <Route path="/sources" element={<Sources data={data} />} />
          <Route path="/terms" element={<Legal />} />
        </Routes>

        {/* {data.isLoggedIn ? <div></div> : <Footer/>} */}
      </Router>
    </div>
  );
}

export default App;

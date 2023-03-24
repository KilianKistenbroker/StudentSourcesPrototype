import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Navbar from "./layout/Navbar";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Sources from "./pages/Sources";
import Legal from "./pages/Terms";
import { useEffect, useState } from "react";

function App() {

  const [loading, setLoading] = useState(null)

  const [data, setData] = useState({
    user: '',
    currentPoint: '',
    isLoggedIn: false
  });

  useEffect(() => {
    // check session status here ???
    
    console.log("app.js refreshed")
    if (localStorage.getItem('data')) 
      setData(JSON.parse(localStorage.getItem('data')))
      
    console.log(data)

    setLoading(true)
  }, [])


  if (loading === null) {
    
    return (
      <div className="App">Loading...</div>
    )
  }

  console.log("this data is being sent from app.js")
  console.log(data)

  return (
    <div className="App">


      <Router>
        <Navbar data = {data} />

        <Routes>

          <Route path="/" element = {<Signup data = {data}/>}/>
          <Route path="/login" element = {<Login data = {data}/>}/>
          <Route path="/sources" element = {<Sources data = {data}/>}/>
          <Route path="/terms" element = {<Legal/>}/>

        </Routes>

        {/* {data.isLoggedIn ? <div></div> : <Footer/>} */}
      </Router>
      
    </div>
  );
}

export default App;
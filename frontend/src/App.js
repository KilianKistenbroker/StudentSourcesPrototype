import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Navbar from "./layout/Navbar";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Footer from "./layout/Footer";
import Sources from "./pages/Sources";

function App() {
  return (
    <div className="App">


      <Router>
        <Navbar/>

        <Routes>
          <Route path="/" element = {<Sources/>}/>
          <Route exact path="/Sign up" element = {<Signup/>}/>
          <Route exact path="/Login" element = {<Login/>}/>
        </Routes>

        <Footer />
      </Router>
      
    </div>
  );
}

export default App;
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Navbar from "./layout/Navbar";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Footer from "./layout/Footer";
import Sources from "./pages/Sources";
import Legal from "./pages/Terms";

function App() {

  let data = {
    user: '',
    currentPoint: '',
    isLogged: false
  }

  return (
    <div className="App">


      <Router>
        <Navbar data = {data}/>

        <Routes>

          <Route exact path="/" element = {<Signup data = {data}/>}/>
          <Route exact path="/login" element = {<Login data = {data}/>}/>
          <Route path="/sources" element = {<Sources/>}/>
          <Route path="/terms" element = {<Legal/>}/>

        </Routes>

        <Footer />
      </Router>
      
    </div>
  );
}

export default App;
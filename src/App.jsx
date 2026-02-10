import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Home2 from "./pages/Home2"; // Temporary
import About from "./pages/Login";
import Home from "./pages/Home";
import Tournois from "./pages/Tournois";
import "./App.css"
import Home from "./pages/Home";
import About from "./pages/Login";
import Register from "./pages/Register";
import Match from "./pages/Match";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<About />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home2 />} />
      <Route path="/tournois" element={<Tournois />} />
      <Route path="/match/:id" element={<Match/>}/>
    </Routes>
  )
}

export default App

import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Home2 from "./pages/Home2"; // Temporary
import About from "./pages/Login";
import Home from "./pages/Home";
import Tournois from "./pages/Tournois";
import Equipe from "./pages/Equipe";
import EquipeDisplay from "./pages/EquipeDisplay";
import Match from "./pages/Match";
import "./App.css"
import Confirmation from "./pages/Confirmation";
import Profil from "./pages/Profil";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<About />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home2 />} />
      <Route path="/tournois" element={<Tournois />} />
      <Route path="/equipe/" element={<Equipe />} />
      <Route path="/equipe/:id" element={<EquipeDisplay />} />
      <Route path="/match/:id" element={<Match />} />
      <Route path="/confirmation" element={<Confirmation />} />
      <Route path="/profil" element={<Profil/>} />
    </Routes>
  )
}

export default App

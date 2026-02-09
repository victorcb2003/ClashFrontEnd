import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Home2 from "./pages/Home2"; // Temporary
import About from "./pages/Login";
import Home from "./pages/Home";
import Tournois from "./pages/Tournois";
import Equipe from "./pages/Equipe";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<About />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home2 />} />
      <Route path="/tournois" element={<Tournois />} />
      <Route path="/equipe/:id" element={<Equipe/>}/>
    </Routes>
  )
}

export default App

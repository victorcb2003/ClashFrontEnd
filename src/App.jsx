import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Register from "./pages/Register";
import Home2 from "./pages/Home2"; // Temporary
import About from "./pages/Login";
import Home from "./pages/Home";
import Tournois from "./pages/Tournois";
import EquipeDisplay from "./pages/EquipeDisplay";
import Equipe from "./pages/Equipe";
import MatchDisplay from "./pages/MatchDisplay";
import "./App.css"
import Match from "./pages/Match";
import Confirmation from "./pages/Confirmation";
import Profil from "./pages/Profil";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import { setupInterceptors, setInterceptorNavigate } from "./services/interceptor";
import ConfirmResetPassword from "./pages/ConfirmResetPassword";
import ResetPassword from "./pages/ResetPassword";
import Calendrier from "./pages/Calendrier";
import TournoisDisplay from "./pages/TournoisDisplay";

function App() {
  const navigate = useNavigate()

  useEffect(() => {
    setInterceptorNavigate(navigate)
    setupInterceptors()
  }, [navigate])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<About />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home2 />} />
      <Route path="/tournois" element={<Tournois />} />
      <Route path="/tournois/:id" element={<TournoisDisplay />} />
      <Route path="/equipe/:id" element={<EquipeDisplay/>}/>
      <Route path="/equipe" element={<Equipe/>}/>
      <Route path="/match/:id" element={<MatchDisplay/>}/>
      <Route path="/match" element={<Match/>}/>
      <Route path="/confirmation" element={<Confirmation />} />
      <Route path="/profil" element={<Profil/>} />
      <Route path="/admin" element={<Admin/>} />
      <Route path="/confirm-reset-password" element={<ConfirmResetPassword/>}/>
      <Route path="/reset-password" element={<ResetPassword/>}/>
      <Route path="/calendrier" element={<Calendrier />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  )
}

export default App

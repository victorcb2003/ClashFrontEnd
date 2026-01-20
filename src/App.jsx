import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/Login";
import Register from "./pages/Register";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<About />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App

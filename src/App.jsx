import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/Login";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<About />} />
    </Routes>
  );
}

export default App

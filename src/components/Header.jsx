import { useNavigate } from "react-router-dom"

function Header() {
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/40 border-b border-white/10">
      <div className="flex justify-between items-center px-16 h-16">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <img src="/Clashofleague.png" alt="logo" className="w-8 h-8" />
          <span className="text-white font-extrabold tracking-wide">
            CLASH OF LEAGUE
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/login")}
            className="text-white hover:text-green-500 transition font-medium"
          >
            Connexion
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
          >
            Inscription
          </button>
        </div>

      </div>
    </header>
  )
}

export default Header

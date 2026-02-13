import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RxHamburgerMenu } from 'react-icons/rx';
import {
  FaHome,
  FaUser,
  FaCalendarAlt,
  FaUsers,
  FaTrophy,
  FaGamepad,
  FaSignOutAlt,
  FaSignInAlt
} from 'react-icons/fa';
import { IoMailSharp } from "react-icons/io5";
import { getUser, logout } from '../services/authService';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isConfirmPage = location.pathname == "/confirmation"
  if (isConfirmPage) return null

  useEffect(() => {
    if (!["/login", "/register", "/", "/confirmation"].includes(location.pathname)) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const currentUser = await getUser();
      setUser(currentUser);
      setIsConnected(true);
    } catch (err) {
      console.log(err);
    }
  };

  const menuItems = [
    { icon: FaHome, text: 'Accueil', path: '/home' },
    { icon: FaUser, text: 'Profil', path: '/' },
    { icon: FaCalendarAlt, text: 'Calendrier', path: '/' },
    { icon: FaUsers, text: 'Équipe', path: '/equipe' },
    { icon: FaTrophy, text: 'Tournois', path: '/tournois' },
    { icon: FaGamepad, text: 'Matches', path: '/' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.log(err);
    }
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={`h-screen fixed left-0 top-0 z-20 flex flex-col
        backdrop-blur-md bg-green-900/60 border-r border-green-600/40
        text-green-100 transition-all duration-300 ease-in-out
        shadow-[inset_0_0_20px_rgba(0,255,100,0.15)]
        ${isOpen ? 'w-64' : 'w-16'}`}
      >

        {/* HEADER */}
        <div
          className={`flex items-center h-14 cursor-pointer transition-all 
          text-green-100 hover:bg-green-700/40 hover:text-lime-300
          border-b border-green-600/40
          ${isOpen ? 'px-6' : 'px-5'}`}
        >
          <RxHamburgerMenu
            className={`text-xl min-w-[20px] transition-all duration-300 ${isOpen ? "rotate-90" : ""}`}
          />
          <span className={`ml-4 text-xl font-semibold whitespace-nowrap transition-all pointer-events-none ${isOpen ? "opacity-100" : "opacity-0"}`}>
            Clash of League
          </span>
        </div>

        {/* MENU */}
        <nav className="flex-1 py-4">
          {isConnected &&
            menuItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <div
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center h-14 cursor-pointer transition-all 
                  ${active
                    ? 'bg-lime-500/30 text-lime-300 shadow-inner'
                    : 'text-green-100 hover:bg-green-700/40 hover:text-lime-300'
                  }
                  ${isOpen ? 'px-6' : 'px-5'}`}
                >
                  <Icon className="text-xl min-w-[20px]" />
                  <span className={`ml-4 text-base font-medium whitespace-nowrap transition-all ${isOpen ? "opacity-100" : "opacity-0 "}`}>{item.text}</span>
                </div>
              );
            })
          }
        </nav>

        {/* FOOTER */}
        {isConnected ? (
          <div
            onClick={handleLogout}
            className={`flex items-center h-14 cursor-pointer transition-all
            text-green-100 hover:bg-red-500/20 hover:text-red-400
            border-t border-green-600/40
            ${isOpen ? 'px-6' : 'px-5'}`}
          >
            <FaSignOutAlt className="text-xl min-w-[20px]" />
            <span className={`ml-4 text-base font-medium whitespace-nowrap transition-all pointer-events-none ${isOpen ? "opacity-100" : "opacity-0  "}`}>Déconnexion</span>
          </div>
        ) : (
          <>
            <div
              onClick={() => navigate('/login')}
              className={`flex items-center h-14 cursor-pointer transition-all
              text-green-100 hover:bg-green-700/40 hover:text-lime-300
              border-t border-green-600/40
              ${isOpen ? 'px-6' : 'px-5'}`}
            >
              <FaSignInAlt className="text-xl min-w-[20px]" />
              <span className={`ml-4 text-base font-medium whitespace-nowrap transition-all pointer-events-none ${isOpen ? "opacity-100" : "opacity-0"}`}>
                Connexion
              </span>
            </div>

            <div
              onClick={() => navigate('/register')}
              className={`flex items-center h-14 cursor-pointer transition-all
              text-green-100 hover:bg-green-700/40 hover:text-lime-300
              ${isOpen ? 'px-6' : 'px-5'}`}
            >
              <IoMailSharp className="text-xl min-w-[20px]" />
              <span className={`ml-4 text-base font-medium whitespace-nowrap transition-all pointer-events-none ${isOpen ? "opacity-100" : "opacity-0"}`}>
                S'inscrire
              </span>
            </div>
          </>
        )}
      </div>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-16'}`} />
    </>
  );
}

export default Sidebar;

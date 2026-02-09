import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RxHamburgerMenu } from 'react-icons/rx';
import {
  FaUser,
  FaCalendarAlt,
  FaNewspaper,
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
  const [user, setUser] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!["/login", "/register", "/", "/confirm"].includes(location.pathname)) {
      fetchData()
    }
  }, [])

  const fetchData = async () => {
    try {
      const currentUser = await getUser();
      setUser(currentUser)
      setIsConnected(true)
    } catch (err) {
      console.log(err)
    }
  }

  const menuItems = [
    { icon: FaUser, text: 'Profil', path: '/' },
    { icon: FaCalendarAlt, text: 'Calendrier', path: '/' },
    { icon: FaUsers, text: 'Équipe', path: '/equipe' },
    { icon: FaTrophy, text: 'Tournois', path: '/tournois' },
    { icon: FaGamepad, text: 'Matches', path: '/' },
  ];

  const handleLogout = async () => {
    try {
      const response = await logout();
      console.log(response)
    } catch (err) {
      console.log(err)
    }
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={`h-screen bg-orange-100 border-r border-orange-300 text-orange-800 fixed left-0 top-0 transition-all duration-300 ease-in-out z-20 flex flex-col ${isOpen ? 'w-64' : 'w-16'}`}>
        {isConnected ?
          <div onClick={() => navigate('/home')} className={`flex items-center h-14 cursor-pointer transition-all text-orange-900 hover:bg-red-100 hover:text-red-600 border-t border-orange-300 ${isOpen ? 'px-6' : 'px-5'}`} >
            <RxHamburgerMenu className={`text-xl min-w-[20px] transition-all duration-300 ${isOpen ? "rotate-90" : ""}`} />
            <span className={`ml-4 text-xl font-medium whitespace-nowrap transition-all pointer-events-none ${isOpen ? "opacity-100" : "opacity-0 "}`}>Clash of League</span>
          </div>
          :
          <div className={`flex items-center h-14 cursor-pointer transition-all text-orange-900 hover:bg-red-100 hover:text-red-600 border-t border-orange-300 ${isOpen ? 'px-6' : 'px-5'}`} >
            <RxHamburgerMenu className={`text-xl min-w-[20px] transition-all duration-300 ${isOpen ? "rotate-90" : ""}`} />
            <span className={`ml-4 text-xl font-medium whitespace-nowrap transition-all pointer-events-none ${isOpen ? "opacity-100" : "opacity-0 "}`}>Clash of League</span>
          </div>
        }
        <nav className="flex-1 py-4">
          {isConnected &&
            menuItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <div
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center h-14 cursor-pointer transition-all ${active
                    ? 'bg-orange-500 text-white'
                    : 'text-orange-700 hover:bg-orange-200 hover:text-orange-800'
                    } ${isOpen ? 'px-6' : 'px-5'}`}
                >
                  <Icon className="text-xl min-w-[20px]" />
                  <span className={`ml-4 text-base font-medium whitespace-nowrap transition-all ${isOpen ? "opacity-100" : "opacity-0 "}`}>{item.text}</span>
                </div>
              );
            })
          }
        </nav>
        {isConnected ?
          <div
            onClick={handleLogout}
            className={`flex items-center h-14 cursor-pointer transition-all text-orange-700 hover:bg-red-100 hover:text-red-600 border-t border-orange-300 ${isOpen ? 'px-6' : 'px-5'}`}
          >
            <FaSignOutAlt className="text-xl min-w-[20px]" />
            <span className={`ml-4 text-base font-medium whitespace-nowrap transition-all pointer-events-none ${isOpen ? "opacity-100" : "opacity-0  "}`}>Déconnexion</span>
          </div>
          :
          <>
            <div
              onClick={() => navigate('/login')}
              className={`flex items-center h-14 cursor-pointer transition-all text-orange-700 hover:bg-red-100 hover:text-red-600 border-t border-orange-300 ${isOpen ? 'px-6' : 'px-5'}`}
            >
              <FaSignInAlt className="text-xl min-w-[20px]" />
              <span className={`ml-4 text-base font-medium whitespace-nowrap transition-all pointer-events-none ${isOpen ? "opacity-100" : "opacity-0 "}`}>Connexion</span>
            </div>
            <div
              onClick={() => navigate('/register')}
              className={`flex items-center h-14 cursor-pointer transition-all text-orange-700 hover:bg-red-100 hover:text-red-600 ${isOpen ? 'px-6' : 'px-5'}`}
            >
              <IoMailSharp className="text-xl min-w-[20px]" />
              <span className={`ml-4 text-base font-medium whitespace-nowrap transition-all pointer-events-none ${isOpen ? "opacity-100" : "opacity-0 "}`}>S'inscrire</span>
            </div>
          </>
        }
      </div>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-16'}`} />
    </>
  );
}

export default Sidebar;
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RxHamburgerMenu } from 'react-icons/rx';
import { 
  FaUser, 
  FaCalendarAlt, 
  FaNewspaper, 
  FaUsers, 
  FaTrophy, 
  FaGamepad,
  FaSignOutAlt 
} from 'react-icons/fa';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: FaUser, text: 'Profil', path: './' },
    { icon: FaCalendarAlt, text: 'Calendrier', path: './' },
    { icon: FaNewspaper, text: 'Actus', path: './' },
    { icon: FaUsers, text: 'Équipe', path: './' },
    { icon: FaTrophy, text: 'Tournois', path: './' },
    { icon: FaGamepad, text: 'Matches', path: './' },
  ];

  const handleLogout = () => {
    console.log('Déconnexion');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div 
        className={`h-screen bg-orange-100 border-r border-orange-300 text-orange-800 fixed left-0 top-0 transition-all duration-300 ease-in-out z-20 flex flex-col ${isOpen ? 'w-64' : 'w-16'}`}>
        <div className="h-16 flex items-center justify-center border-b border-orange-300">
          <RxHamburgerMenu 
            onClick={() => setIsOpen(!isOpen)}
            className="text-orange-600 p-1.5 rounded-full bg-orange-50 border-orange-400 w-[36px] h-[36px] border-2 cursor-pointer transition-all hover:text-orange-100 hover:bg-orange-300 hover:border-orange-500 hover:rotate-90" 
          />
        </div>
        <nav className="flex-1 py-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <div
                key={index}
                onClick={() => navigate(item.path)}
                className={`flex items-center h-14 cursor-pointer transition-all ${
                  active 
                    ? 'bg-orange-500 text-white' 
                    : 'text-orange-700 hover:bg-orange-200 hover:text-orange-800'
                } ${isOpen ? 'px-6' : 'justify-center'}`}
              >
                <Icon className="text-xl min-w-[20px]" />
                {isOpen && (
                  <span className="ml-4 text-base font-medium whitespace-nowrap">
                    {item.text}
                  </span>
                )}
              </div>
            );
          })}
        </nav>
        <div 
          onClick={handleLogout}
          className={`flex items-center h-14 cursor-pointer transition-all text-orange-700 hover:bg-red-100 hover:text-red-600 border-t border-orange-300 ${
            isOpen ? 'px-6' : 'justify-center'
          }`}
        >
          <FaSignOutAlt className="text-xl min-w-[20px]" />
          {isOpen && (
            <span className="ml-4 text-base font-medium whitespace-nowrap">
              Déconnexion
            </span>
          )}
        </div>
      </div>
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64' : 'w-16'
        }`}
      />
    </>
  );
}

export default Sidebar;
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Tag, LogOut, Wallet } from 'lucide-react';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('nome');
    navigate('/login');
  }

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Categorias', path: '/categorias', icon: Tag },
  ];

  return (
    <div className="
      w-full md:w-20
      bg-black
      flex-shrink-0
      md:min-h-screen
      flex md:flex-col
      items-center
      justify-between md:justify-start
      py-3 md:py-6
      px-4 md:px-0
      gap-0 md:gap-8
      sticky top-0 z-40
    ">
      <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-lime-400 flex items-center justify-center">
        <Wallet size={18} className="text-black" />
      </div>

      <div className="flex md:flex-col gap-2 md:gap-3">
        {menuItems.map((item) => {
          const ativo = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={item.label}
              className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center transition-colors ${
                ativo
                  ? 'bg-lime-400 text-black'
                  : 'text-gray-500 hover:bg-gray-900 hover:text-white'
              }`}
            >
              <Icon size={18} />
            </button>
          );
        })}
      </div>

      <button
        onClick={handleLogout}
        title="Sair"
        className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-900 hover:text-red-400 transition-colors md:mt-auto"
      >
        <LogOut size={18} />
      </button>
    </div>
  );
}

export default Sidebar;
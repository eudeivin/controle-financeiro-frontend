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
    <div className="w-20 bg-black flex-shrink-0 min-h-screen flex flex-col items-center py-6 gap-8">
      <div className="w-10 h-10 rounded-xl bg-lime-400 flex items-center justify-center">
        <Wallet size={20} className="text-black" />
      </div>

      <div className="flex flex-col gap-3">
        {menuItems.map((item) => {
          const ativo = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={item.label}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                ativo
                  ? 'bg-lime-400 text-black'
                  : 'text-gray-500 hover:bg-gray-900 hover:text-white'
              }`}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>

      <button
        onClick={handleLogout}
        title="Sair"
        className="w-11 h-11 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-900 hover:text-red-400 transition-colors mt-auto"
      >
        <LogOut size={20} />
      </button>
    </div>
  );
}

export default Sidebar;
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, UserCheck, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { COMPANY_NAME } from '../../lib/config';

const NAV_ITEMS = [
  { to: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/clientes',     label: 'Clientes',     icon: Users },
  { to: '/orcamentos',   label: 'Orçamentos',   icon: FileText },
  { to: '/destinatarios', label: 'Destinatários', icon: UserCheck },
];

export function Sidebar() {
  const { signOut } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-100 h-full shrink-0">
      <div className="px-4 py-5 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">{COMPANY_NAME}</h2>
        <p className="text-xs text-gray-500 mt-0.5">Orçamentos</p>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-2 py-4 border-t border-gray-100">
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-red-600 w-full transition-colors"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  );
}

import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, UserCheck } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard',    label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/clientes',     label: 'Clientes',   icon: Users },
  { to: '/orcamentos',   label: 'Orçamentos', icon: FileText },
  { to: '/destinatarios', label: 'Dest.',     icon: UserCheck },
];

export function BottomNavigation() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40">
      <div className="flex items-stretch h-14">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 text-xs transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNavigation } from './BottomNavigation';

export function Layout() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-14 md:pb-0">
        <Outlet />
      </main>

      <BottomNavigation />
    </div>
  );
}

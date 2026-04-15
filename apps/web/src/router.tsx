import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ReactNode } from 'react';

import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

import { ClientesPage }        from './pages/clientes/ClientesPage';
import { ClienteNovoPage }     from './pages/clientes/ClienteNovoPage';
import { ClienteEditarPage }   from './pages/clientes/ClienteEditarPage';

import { OrcamentosPage }      from './pages/orcamentos/OrcamentosPage';
import { OrcamentoNovoPage }   from './pages/orcamentos/OrcamentoNovoPage';
import { OrcamentoEditarPage } from './pages/orcamentos/OrcamentoEditarPage';

import { DestinatariosPage }      from './pages/destinatarios/DestinatariosPage';
import { DestinatarioNovoPage }   from './pages/destinatarios/DestinatarioNovoPage';
import { DestinatarioEditarPage } from './pages/destinatarios/DestinatarioEditarPage';

function PrivateRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen text-gray-500">Carregando...</div>;
  if (!user)   return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen text-gray-500">Carregando...</div>;
  if (user)    return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <PublicRoute><LoginPage /></PublicRoute>,
  },
  {
    path: '/',
    element: <PrivateRoute><Layout /></PrivateRoute>,
    children: [
      { index: true,                       element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard',                 element: <DashboardPage /> },
      { path: 'clientes',                  element: <ClientesPage /> },
      { path: 'clientes/novo',             element: <ClienteNovoPage /> },
      { path: 'clientes/:id',              element: <ClienteEditarPage /> },
      { path: 'orcamentos',                element: <OrcamentosPage /> },
      { path: 'orcamentos/novo',           element: <OrcamentoNovoPage /> },
      { path: 'orcamentos/:id',            element: <OrcamentoEditarPage /> },
      { path: 'destinatarios',             element: <DestinatariosPage /> },
      { path: 'destinatarios/novo',        element: <DestinatarioNovoPage /> },
      { path: 'destinatarios/:id',         element: <DestinatarioEditarPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

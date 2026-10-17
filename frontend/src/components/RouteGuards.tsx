import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../features/auth/useAuth';

function LoadingScreen() {
  return <main className="loading-screen">Cargando…</main>;
}

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export function PublicOnlyRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  return user ? <Navigate to="/" replace /> : <Outlet />;
}
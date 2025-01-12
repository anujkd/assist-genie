import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';

export const AdminRoute = () => {
  const user = useAuthStore((state) => state.user);
  console.log(user);
  
  if (user?.role !== 'admin') {
    return <Navigate to="/chat" replace />;
  }

  return <Outlet />;
};
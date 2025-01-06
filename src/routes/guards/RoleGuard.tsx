import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export const RoleGuard = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: ('user' | 'admin')[];
}) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

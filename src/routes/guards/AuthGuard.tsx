// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '@/hooks/useAuth';

// export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
//   const { isAuthenticated } = useAuth();
//   const location = useLocation();

//   if (isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return <>{children}</>;
// };

// import { ReactNode } from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuthStore } from '@/stores/auth.store';
// import { useUserProfile } from '@/hooks/useAuth';

// interface AuthGuardProps {
//   children: ReactNode;
//   requireAdmin?: boolean;
// }

// export const AuthGuard = ({ children, requireAdmin = false }: AuthGuardProps) => {
//   const { isAuthenticated } = useAuthStore();
//   const { userProfile, isLoading } = useUserProfile();

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (isLoading) {
//     return <div>Loading...</div>; // Or your loading component
//   }

//   if (!userProfile) {
//     return <Navigate to="/login" replace />;
//   }

//   if (requireAdmin && userProfile.role !== 'admin') {
//     return <Navigate to="/chat" replace />;
//   }

//   return <>{children}</>;
// };

import { useUserProfile } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/auth.store';
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface AuthGuardProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export const AuthGuard = ({ children, requireAdmin = false }: AuthGuardProps) => {
  const token = useAuthStore((state) => state.token);
  const { data: profile, isLoading } = useUserProfile();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && profile.role !== 'admin') {
    return <Navigate to="/chat" replace />;
  }

  return <>{children}</>;
};
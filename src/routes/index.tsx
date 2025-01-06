import { LoginPage } from '@/pages/auth/LoginPage';
import SettingsPage from '@/components/settings/Settings';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import DashboardPage from '@/pages/settings/dashboard';
// import { AuthGuard } from './guards/AuthGuard';
// import { RoleGuard } from './guards/RoleGuard';
// import { LoginPage } from '@/pages/auth/LoginPage';
// import { ChatPage } from '@/pages/chat/ChatPage';
// import { DashboardPage } from '@/pages/admin/DashboardPage';
// import { useAuth } from '@/hooks/useAuth';
// import { MainLayout } from '@/components/layouts/MainLayout';

const Router = () => {
//   const { user } = useAuth();

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Navigate to="/login" replace />,
    //   element: user ? (
    //     <Navigate to={user.role === 'admin' ? '/admin' : '/chat'} replace />
    //   ) : (
    //     <Navigate to="/login" replace />
    //   ),
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/chat',
    //   element: (
    //     <AuthGuard>
    //       <MainLayout>
    //         <ChatPage />
    //       </MainLayout>
    //     </AuthGuard>
    //   ),
    },
    {
      path: '/admin/*',
    //   element: (
    //     <AuthGuard>
    //       <RoleGuard allowedRoles={['admin']}>
    //         <MainLayout>
    //           <DashboardPage />
    //         </MainLayout>
    //       </RoleGuard>
    //     </AuthGuard>
    //   ),
    },
    {
        path: '/settings',
        element: <DashboardPage />,
    }
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
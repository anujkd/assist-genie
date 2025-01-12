import { LoginPage } from '@/pages/auth/LoginPage';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import DashboardPage from '@/pages/settings/dashboard';
import { MainLayout } from '@/components/layouts/MainLayout';
import SignUpForm from '@/pages/auth/SignUp';
import { AuthGuard } from './guards/AuthGuard';
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
      element: <MainLayout><LoginPage /></MainLayout>,
    },{
        path: '/SignUp',
        element: <SignUpForm />
    },
    {
      path: '/chat',
      element: <AuthGuard>
      <MainLayout>
  <div> chat</div>
</MainLayout>
    </AuthGuard>
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
        element: <AuthGuard>
        <MainLayout>
    <DashboardPage />
  </MainLayout>
      </AuthGuard>,
    }
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
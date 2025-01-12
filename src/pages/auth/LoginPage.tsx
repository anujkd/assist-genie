// import { useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import {
//   Card,
//   CardHeader,
//   CardContent,
//   CardTitle,
//   CardDescription,
// } from '@/components/ui/card';
// import { Loader2 } from 'lucide-react';
// import { useLogin } from '@/hooks/useLogin';
// import { useAuthStore } from '@/stores/auth.store';

// export const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const { mutate: login, isLoading } = useLogin();
//   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
//   const user = useAuthStore((state) => state.user);

//   if (isAuthenticated) {
//     return <Navigate to={user?.role === 'admin' ? '/settings' : '/chat'} />;
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       login({ email, password });
//     } catch (error) {
//       console.error('Login failed:', error);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <Card className="w-[400px]">
//         <CardHeader>
//           <CardTitle className="text-2xl">Login</CardTitle>
//           <CardDescription>Enter your email below to login to your account</CardDescription>
//         </CardHeader>
//         <form onSubmit={handleSubmit}>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <label htmlFor="email">Email</label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={e => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="grid gap-2 space-y-2">
//               <div className="flex items-center">
//                 <label htmlFor="password">Password</label>
//                 <a
//                   href="#"
//                   className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
//                 >
//                   Forgot your password?
//                 </a>
//               </div>

//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={e => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Logging in...
//                   </>
//                 ) : (
//                   'Login'
//                 )}
//               </Button>
//             </div>
//             <div className="space-y-2">
//               <Button type="button" variant="outline" className="w-full">
//                 Login with SSO
//               </Button>
//               <div className="mt-4 text-center text-sm">
//                 Don&apos;t have an account? 
//                 <a href="#" className="underline underline-offset-4 ml-2">
//                   Sign up
//                 </a>
//               </div>
//             </div>
//           </CardContent>
//         </form>
//       </Card>
//     </div>
//   );
// };

import { LoginForm } from '@/components/auth/LoginForm'
import React from 'react'

export const LoginPage = () => {
  return (
    <div>
        <LoginForm />
    </div>
  )
}
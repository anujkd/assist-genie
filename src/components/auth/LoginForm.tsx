// import { Navigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import {
//   Card,
//   CardHeader,
//   CardContent,
//   CardTitle,
//   CardDescription,
// } from '@/components/ui/card';
// import { Loader2 } from 'lucide-react';
// import { useAuthStore } from '@/stores/auth.store';
// import { useLogin, useUserProfile } from '@/hooks/useAuth';

// const formSchema = z.object({
//   email: z.string().email('Please enter a valid email'),
//   password: z.string().min(1, 'Password is required'),
// });

// type FormData = z.infer<typeof formSchema>;

// export const LoginForm = () => {
//   const { mutate: login, isLoading } = useLogin();
//   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
// //   const user = useAuthStore((state) => state.user);
//   const { userProfile } = useUserProfile();


//   const form = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: '',
//       password: '',
//     },
//   });

//   if (isAuthenticated) {
//     return <Navigate to={userProfile?.role === 'admin' ? '/settings' : '/settings'} />;
//   }

//   const onSubmit = (values: FormData) => {
//     login(values);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <Card className="w-[400px]">
//         <CardHeader>
//           <CardTitle className="text-2xl">Login</CardTitle>
//           <CardDescription>
//             Enter your email below to login to your account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem className="space-y-1">
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder="name@example.com"
//                         type="email"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem className="space-y-1">
//                     <div className="flex items-center justify-between">
//                       <FormLabel>Password</FormLabel>
//                       <a
//                         href="#"
//                         className="text-sm text-muted-foreground underline-offset-4 hover:underline"
//                       >
//                         Forgot your password?
//                       </a>
//                     </div>
//                     <FormControl>
//                       <Input type="password" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

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

//               <Button type="button" variant="outline" className="w-full">
//                 Login with SSO
//               </Button>

//               <div className="mt-4 text-center text-sm text-muted-foreground">
//                 Don&apos;t have an account?{' '}
//                 <a
//                   href="#"
//                   className="underline underline-offset-4 hover:text-primary"
//                 >
//                   Sign up
//                 </a>
//               </div>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { useLogin, useUserProfile } from '@/hooks/useAuth';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof formSchema>;

export const LoginForm = () => {
  const token = useAuthStore((state) => state.token);
  const { data: profile } = useUserProfile();
  const { mutate: login, isLoading } = useLogin();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect if authenticated
  if (token && profile) {
    return <Navigate to={profile.role === 'admin' ? '/admin' : '/chat'} replace />;
  }

  const onSubmit = (values: FormData) => {
    login(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>

              <Button type="button" variant="outline" className="w-full">
                Login with SSO
              </Button>

              <div className="mt-4 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <a
                  href="#"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign up
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

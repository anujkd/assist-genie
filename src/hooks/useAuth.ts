// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useAuthStore } from '@/stores/auth.store';
// import { useNavigate } from 'react-router-dom';
// import { LoginCredentials, LoginResponse, UserProfile } from '@/types/auth.types';
// import { httpClient } from '@/services';

// export const useLogin = () => {
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();
//   const { setToken, setUser } = useAuthStore();

//   return useMutation({
//     mutationFn: async (credentials: LoginCredentials) => {
//       const { data } = await httpClient.post<LoginResponse>('/login-1', credentials);
//       return data;
//     },
//     onSuccess: async (data) => {
//       setToken(data.token, data.accountId);
      
//       // Fetch user profile
//       const { data: profile } = await httpClient.get<UserProfile>(
//         `/account/${data.accountId}/userprofile`
//       );
//       setUser(profile);
//       queryClient.setQueryData(['userProfile'], profile);
      
//       // Redirect based on role
//       navigate(profile.role === 'admin' ? '/admin' : '/chat');
//     },
//   });
// };

// export const useLogout = () => {
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();
//   const logout = useAuthStore((state) => state.logout);

//   return () => {
//     logout();
//     queryClient.clear();
//     navigate('/login');
//   };
// };

// export const useUserProfile = () => {
//   const accountId = useAuthStore((state) => state.accountId);

//   return useQuery({
//     queryKey: ['userProfile'],
//     queryFn: async () => {
//       const { data } = await httpClient.get<UserProfile>(
//         `/account/${accountId}/userprofile`
//       );
//       return data;
//     },
//     enabled: !!accountId,
//   });
// };

// import { useState } from 'react';
// import { useMutation, useQuery, useQueryClient, } from '@tanstack/react-query';
// import { useAuthStore } from '@/stores/auth.store';
// import { LoginCredentials, LoginResponse, UserProfile } from '@/types/auth.types';
// import { httpClient } from '@/services';
// import { useNavigate } from 'react-router-dom';

// export const useUserProfile = () => {
//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
//   const { accountId, isAuthenticated } = useAuthStore();

//   const { data: profile, isLoading } = useQuery({
//     queryKey: ['userProfile'],
//     queryFn: async () => {
//       const { data } = await httpClient.get<UserProfile>(
//         `/account/${accountId}/userprofile`
//       );
//       setUserProfile(data);
//       return data;
//     },
//     enabled: !!accountId && isAuthenticated && !userProfile,
//     staleTime: 300000, // Consider data fresh for 5 minutes
//   });

//   return {
//     userProfile: userProfile || profile,
//     isLoading,
//     setUserProfile,
//   };
// };

// export const useLogin = () => {
//     // const queryClient = useQueryClient();
//     const navigate = useNavigate();
//     const { setAuth } = useAuthStore();
//     const { setUserProfile } = useUserProfile();
  
//     return useMutation({
//       mutationFn: async (credentials: LoginCredentials) => {
//         const { data } = await httpClient.post<LoginResponse>('/login', credentials);
//         return data;
//       },
//       onSuccess: async (data) => {
//         setAuth(data.token, data.accountId);
        
//         // Fetch user profile immediately after login
//         const { data: profile } = await httpClient.get<UserProfile>(
//           `/account/${data.accountId}/userprofile`
//         );
//         setUserProfile(profile);
        
//         // Navigate based on role
//         navigate(profile.role === 'admin' ? '/settings' : '/settings');
//       },
//     });
//   };
  
//   export const useLogout = () => {
//     const queryClient = useQueryClient();
//     const navigate = useNavigate();
//     const logout = useAuthStore((state) => state.logout);
//     const { setUserProfile } = useUserProfile();
  
//     return () => {
//       logout();
//       setUserProfile(null);
//       queryClient.clear();
//       navigate('/login');
//     };
//   };
  

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { LoginCredentials, LoginResponse, UserProfile } from '@/types/auth.types';
import { httpClient } from '@/services';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await httpClient.post<LoginResponse>('/login', credentials);
      return data;
    },
    onSuccess: async (data) => {
      // Store only the token
      setToken(data.token);
      
      // Fetch and cache user profile
      const { data: profile } = await httpClient.get<UserProfile>(
        `/account/${data.accountId}/userprofile`
      );
      
      // Cache the profile data
      queryClient.setQueryData(['userProfile'], profile);
      
      // Navigate based on role
      navigate(profile.role === 'admin' ? '/admin' : '/chat');
    },
  });
};

export const useUserProfile = () => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await httpClient.get<UserProfile>('/account/abc/userprofile');
      return response.data;
    },
    enabled: !!token,
    staleTime: 300000, // Consider data fresh for 5 minutes
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  return () => {
    logout();
    queryClient.clear();
    navigate('/login');
  };
};
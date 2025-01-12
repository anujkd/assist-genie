// import { UserProfile } from '@/types/auth.types';
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// interface AuthState {
//   token: string | null;
//   user: UserProfile | null;
//   accountId: string | null;
//   isAuthenticated: boolean;
//   setToken: (token: string, accountId: string) => void;
//   setUser: (user: UserProfile) => void;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       token: null,
//       user: null,
//       accountId: null,
//       isAuthenticated: false,
//       setToken: (token, accountId) => 
//         set({ token, accountId, isAuthenticated: true }),
//       setUser: (user) => set({ user }),
//       logout: () => set({ token: null, user: null, accountId: null, isAuthenticated: false }),
//     }),
//     {
//       name: 'auth-storage',
//     }
//   )
// );

// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// interface AuthState {
//   token: string | null;
//   accountId: string | null;
//   isAuthenticated: boolean;
//   setAuth: (token: string, accountId: string) => void;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       token: null,
//       accountId: null,
//       isAuthenticated: false,
//       setAuth: (token, accountId) => 
//         set({ token, accountId, isAuthenticated: true }),
//       logout: () => set({ token: null, accountId: null, isAuthenticated: false }),
//     }),
//     {
//       name: 'auth-storage',
//       // Only persist necessary authentication data
//       partialize: (state) => ({ 
//         token: state.token,
//         accountId: state.accountId,
//         isAuthenticated: state.isAuthenticated
//       }),
//     }
//   )
// );

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token: string) => set({ token }),
      logout: () => set({ token: null }),
    }),
    {
      name: 'auth-token',
      // Only persist the token
      partialize: (state) => ({ token: state.token }),
    }
  )
);
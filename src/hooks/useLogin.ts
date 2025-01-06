import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { AuthService } from '@/services/api/auth.api';
import { useState } from 'react';
import { toast } from './use-toast';
export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: AuthService.login,
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      
      if (data.user.role === 'admin') {
        navigate('/settings');
      } else {
        navigate('/chat');
      }

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onError: (error) => {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  return {
    ...mutation,
    isLoading,
    login: mutation.mutate,
    loginAsync: mutation.mutateAsync,
  };
};
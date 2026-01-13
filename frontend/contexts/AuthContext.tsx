'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { directAuthAPI } from '@/lib/auth-client';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuthStatus = async () => {
    try {
      if (await api.isAuthenticated()) {
        // Get user info from session
        const userData = await api.getSession();
        setUser(userData.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.login({ email, password });

      // Store token if provided
      if (response.access_token && typeof window !== 'undefined') {
        localStorage.setItem('token', response.access_token);
      }

      // Get user info - this should now have the token available
      const userData = await api.getSession();

      // Update states before redirect to ensure they're ready
      setUser(userData.user);
      setIsAuthenticated(true);

      // Wait a moment to ensure state updates are propagated before redirect
      await new Promise(resolve => setTimeout(resolve, 100));

      // Redirect to tasks page after state update
      router.push('/tasks');
    } catch (error: any) {
      // If login fails, clear any potentially invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }

      // Extract error message from response
      let errorMessage = 'Login failed. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.detail) {
        errorMessage = error.detail;
      }

      console.error('Login failed:', error);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.signup({ email, password, name });

      // Store token if provided
      if (response.access_token && typeof window !== 'undefined') {
        localStorage.setItem('token', response.access_token);
      }

      // Get user info - this should now have the token available
      const userData = await api.getSession();

      // Update states before redirect to ensure they're ready
      setUser(userData.user);
      setIsAuthenticated(true);

      // Wait a moment to ensure state updates are propagated before redirect
      await new Promise(resolve => setTimeout(resolve, 100));

      // Redirect to tasks page after state update
      router.push('/tasks');
    } catch (error: any) {
      // If signup fails, clear any potentially invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }

      // Extract error message from response
      let errorMessage = 'Signup failed. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.detail) {
        errorMessage = error.detail;
      }

      console.error('Signup failed:', error);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.logout();
      // Update states before redirect
      setUser(null);
      setIsAuthenticated(false);

      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear the user state even if backend logout fails
      setUser(null);
      setIsAuthenticated(false);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
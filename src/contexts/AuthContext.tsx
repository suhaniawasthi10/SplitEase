import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType, LoginData, SignUpData } from '../types/auth';
import { authService } from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check authentication status on app load
  const checkAuth = async () => {
    try {
      setLoading(true);
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (data: LoginData) => {
    try {
      const response = await authService.login(data);
      setUser(response.user);
    } catch (error) {
      throw error; // Re-throw to handle in components
    }
  };

  // Sign up function
  const signUp = async (data: SignUpData) => {
    try {
      const response = await authService.signUp(data);
      setUser(response.user);
    } catch (error) {
      throw error; // Re-throw to handle in components
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      // Even if logout fails on server, clear local state
      setUser(null);
      throw error;
    }
  };

  // Check authentication on component mount
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login,
    signUp,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
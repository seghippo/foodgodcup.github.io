'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  teamId: string;
  role: 'captain' | 'admin';
  isVerified: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  teamId: string;
  confirmPassword: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('tennis-club-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('tennis-club-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call - in real app, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in real app, this would come from your database
      const mockUsers: User[] = [
        {
          id: 'TJ01',
          email: 'xuefeng@example.com',
          name: 'Xue Feng',
          teamId: 'TJG',
          role: 'captain',
          isVerified: true
        },
        {
          id: 'FJ01',
          email: 'weidong@example.com',
          name: 'Wei Dong',
          teamId: 'FJT',
          role: 'captain',
          isVerified: true
        },
        {
          id: 'admin',
          email: 'admin@tennisclub.com',
          name: 'Admin',
          teamId: '',
          role: 'admin',
          isVerified: true
        }
      ];

      // Simple mock authentication
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (foundUser && password === 'password123') { // Mock password
        setUser(foundUser);
        localStorage.setItem('tennis-club-user', JSON.stringify(foundUser));
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Validate input
      if (userData.password !== userData.confirmPassword) {
        setIsLoading(false);
        return false;
      }

      if (userData.password.length < 6) {
        setIsLoading(false);
        return false;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new user
      const newUser: User = {
        id: userData.teamId + '01', // Mock ID generation
        email: userData.email,
        name: userData.name,
        teamId: userData.teamId,
        role: 'captain',
        isVerified: false
      };

      // In real app, this would be saved to database
      setUser(newUser);
      localStorage.setItem('tennis-club-user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tennis-club-user');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user
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

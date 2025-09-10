'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  teamId: string;
  role: 'captain' | 'admin';
  isVerified: boolean;
  password?: string; // For registered users
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
  const [isClient, setIsClient] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('tennis-club-user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('tennis-club-user');
        }
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

      // Check both mock users and registered users from localStorage
      let foundUser = mockUsers.find(u => u.email === email);
      
      // If not found in mock users, check registered users in localStorage
      if (!foundUser && typeof window !== 'undefined') {
        try {
          const registeredUsers = localStorage.getItem('tennis-club-registered-users');
          if (registeredUsers) {
            const users: User[] = JSON.parse(registeredUsers);
            foundUser = users.find(u => u.email === email);
          }
        } catch (error) {
          console.error('Error loading registered users:', error);
        }
      }
      
      // Check password - mock users use 'password123', registered users use their actual password
      const isPasswordValid = foundUser?.password 
        ? password === foundUser.password  // Registered user with saved password
        : password === 'password123';      // Mock user with hardcoded password
      
      if (foundUser && isPasswordValid) {
        // Don't include password in the session user object for security
        const sessionUser = { ...foundUser };
        delete sessionUser.password;
        
        setUser(sessionUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('tennis-club-user', JSON.stringify(sessionUser));
        }
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
        isVerified: false,
        password: userData.password // Save the password for registered users
      };

      // Save to registered users list in localStorage
      if (typeof window !== 'undefined') {
        try {
          const existingUsers = localStorage.getItem('tennis-club-registered-users');
          let registeredUsers: User[] = [];
          
          if (existingUsers) {
            registeredUsers = JSON.parse(existingUsers);
          }
          
          // Check if user already exists
          const userExists = registeredUsers.some(u => u.email === userData.email);
          if (userExists) {
            setIsLoading(false);
            return false; // User already exists
          }
          
          registeredUsers.push(newUser);
          localStorage.setItem('tennis-club-registered-users', JSON.stringify(registeredUsers));
        } catch (error) {
          console.error('Error saving registered user:', error);
        }
      }

      // Set as current user and save session
      setUser(newUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('tennis-club-user', JSON.stringify(newUser));
      }
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tennis-club-user');
    }
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

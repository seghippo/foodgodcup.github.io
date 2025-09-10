'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import bcrypt from 'bcryptjs';
import { validateInput, registerSchema, loginSchema } from './validation';
import { sanitizeEmail, sanitizeName, sanitizePassword, sanitizeTeamId } from './sanitizer';
import { checkRateLimit, resetRateLimit } from './rateLimiter';

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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
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

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Sanitize inputs
      const sanitizedEmail = sanitizeEmail(email);
      const sanitizedPassword = sanitizePassword(password);
      
      // Validate inputs
      const validation = validateInput(loginSchema, {
        email: sanitizedEmail,
        password: sanitizedPassword
      });
      
      if (validation.error) {
        setIsLoading(false);
        return { success: false, error: validation.error };
      }
      
      // Check rate limiting
      const rateLimit = checkRateLimit(sanitizedEmail);
      if (!rateLimit.allowed) {
        setIsLoading(false);
        const blockedUntil = rateLimit.blockedUntil ? new Date(rateLimit.blockedUntil).toLocaleTimeString() : 'unknown';
        return { 
          success: false, 
          error: `Too many login attempts. Please try again after ${blockedUntil}` 
        };
      }
      
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
      let foundUser = mockUsers.find(u => u.email === sanitizedEmail);
      
      // If not found in mock users, check registered users in localStorage
      if (!foundUser && typeof window !== 'undefined') {
        try {
          const registeredUsers = localStorage.getItem('tennis-club-registered-users');
          if (registeredUsers) {
            const users: User[] = JSON.parse(registeredUsers);
            foundUser = users.find(u => u.email === sanitizedEmail);
          }
        } catch (error) {
          console.error('Error loading registered users:', error);
        }
      }
      
      if (!foundUser) {
        setIsLoading(false);
        return { success: false, error: 'Invalid email or password' };
      }
      
      // Check password - mock users use 'password123', registered users use hashed password
      let isPasswordValid = false;
      
      if (foundUser.password) {
        // Registered user with hashed password
        isPasswordValid = await bcrypt.compare(sanitizedPassword, foundUser.password);
      } else {
        // Mock user with hardcoded password
        isPasswordValid = sanitizedPassword === 'password123';
      }
      
      if (isPasswordValid) {
        // Reset rate limit on successful login
        resetRateLimit(sanitizedEmail);
        
        // Don't include password in the session user object for security
        const sessionUser = { ...foundUser };
        delete sessionUser.password;
        
        setUser(sessionUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('tennis-club-user', JSON.stringify(sessionUser));
        }
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Sanitize inputs
      const sanitizedData = {
        email: sanitizeEmail(userData.email),
        password: sanitizePassword(userData.password),
        confirmPassword: sanitizePassword(userData.confirmPassword),
        name: sanitizeName(userData.name),
        teamId: sanitizeTeamId(userData.teamId)
      };
      
      // Validate inputs
      const validation = validateInput(registerSchema, sanitizedData);
      
      if (validation.error) {
        setIsLoading(false);
        return { success: false, error: validation.error };
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(sanitizedData.password, 12);
      
      // Create new user
      const newUser: User = {
        id: sanitizedData.teamId + '01', // Mock ID generation
        email: sanitizedData.email,
        name: sanitizedData.name,
        teamId: sanitizedData.teamId,
        role: 'captain',
        isVerified: false,
        password: hashedPassword // Save the hashed password
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
          const userExists = registeredUsers.some(u => u.email === sanitizedData.email);
          if (userExists) {
            setIsLoading(false);
            return { success: false, error: 'User with this email already exists' };
          }
          
          registeredUsers.push(newUser);
          localStorage.setItem('tennis-club-registered-users', JSON.stringify(registeredUsers));
        } catch (error) {
          console.error('Error saving registered user:', error);
          setIsLoading(false);
          return { success: false, error: 'Failed to save user data' };
        }
      }

      // Set as current user and save session (without password)
      const sessionUser = { ...newUser };
      delete sessionUser.password;
      
      setUser(sessionUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('tennis-club-user', JSON.stringify(sessionUser));
      }
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return { success: false, error: 'An error occurred during registration' };
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

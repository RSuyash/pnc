// src/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { initializeDashboardService, getDashboardService, clearDashboardService } from '@/services/dashboardService';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  status: string;
  department?: string;
  year?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  email_verified: boolean;
  profile_picture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, full_name: string, password: string) => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface DecodedToken {
  sub: string;
  user_id: string;
  exp: number;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if token exists and is valid on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          // Token expired
          localStorage.removeItem('token');
        } else {
          // Token is still valid, fetch user info
          fetchUserInfo(token);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const fetchUserInfo = useCallback(async (token: string) => {
    try {
      const response = await axios.get('http://localhost:8000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setUser(response.data);
      
      // Initialize dashboard service with the token
      initializeDashboardService(token);
    } catch (error) {
      console.error('Error fetching user info:', error);
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [initializeDashboardService]);

  const login = async (email: string, password: string) => {
    try {
      // Use the login-json endpoint that accepts JSON data
      const response = await axios.post('http://localhost:8000/api/auth/login-json', {
        email: email,
        password: password,
      });

      const { access_token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', access_token);
      
      // Set user in context
      setUser(user);
      
      // Initialize dashboard service with the token
      initializeDashboardService(access_token);
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.detail || 'Login failed');
      } else {
        throw new Error('Network error. Please try again.');
      }
    }
  };

  const register = async (email: string, full_name: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:8000/api/auth/register', {
        email,
        full_name,
        password,
        confirm_password: password,
      });

      // Automatically login after registration
      await login(email, password);
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.detail || 'Registration failed');
      } else {
        throw new Error('Network error. Please try again.');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // Clear the dashboard service instance
    clearDashboardService();
  };

  const hasRole = (role: string) => {
    if (!user) return false;
    // Admin can access everything
    if (user.role === 'admin') return true;
    return user.role === role;
  };

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // Remove fields that shouldn't be updated (like id, created_at, etc.)
      const { id, email, created_at, updated_at, last_login, email_verified, ...updateData } = profileData;
      
      const response = await axios.put('http://localhost:8000/api/auth/me', updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Update the user in context with new data
      setUser(response.data);
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.detail || 'Profile update failed');
      } else {
        throw new Error('Network error. Please try again.');
      }
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    updateProfile,
    isAuthenticated: !!user,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
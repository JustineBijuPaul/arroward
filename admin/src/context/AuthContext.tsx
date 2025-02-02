import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from "jwt-decode";
import api from '../utils/axios';
import { User } from '../types';

interface AuthContextType {
  register: (name: string, email: string, password: string) => Promise<void>;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface DecodedToken {
  id: string;
  exp: number;
}

interface LoginResponse {
  token: string;
  user: any;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Separate token validation function
  const validateToken = (token: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  };

  // Check auth status on mount and token change
  useEffect(() => {
    const validateAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const response = await api.get('/admin/auth/me');
        setUser(response.data);
      } catch (error) {
        console.error('Auth validation failed:', error);
        localStorage.removeItem('auth_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateAuth();
  }, []);

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        console.log('Checking backend connection...');
        const response = await api.get('/admin/health');
        console.log('Backend connection response:', response.data);
      } catch (error) {
        console.error('Backend connection failed:', error);
      }
    };

    checkBackendConnection();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email });
      
      const response = await api.post('admin/auth/login', {
        email,
        password
      });

      console.log('Login response:', response.data);

      if (!response.data?.token) {
        throw new Error('No token received from server');
      }

      localStorage.setItem('auth_token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      return response.data;
    } catch (error: any) {
      console.error('Login failed:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      if (error.response?.status === 401) {
        throw new Error('Invalid credentials');
      }
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('auth_token');
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      console.log('Registration attempt:', { name, email });

      const response = await api.post('admin/auth/register', {
        name,
        email,
        password
      });

      if (!response.data?.token) {
        throw new Error('Registration successful but no token received');
      }

      // Store auth token
      localStorage.setItem('auth_token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      return response.data;
    } catch (error: any) {
      console.error('Registration error details:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        url: error.config?.url
      });

      if (error.response?.status === 404) {
        throw new Error('Registration service is not available');
      }

      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
  };

  // Add this console log temporarily to debug
  console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
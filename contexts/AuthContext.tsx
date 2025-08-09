import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import apiClient, { User, LoginData } from '../lib/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, redirectTo?: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setRedirectPath: (path: string) => void;
  getToken: () => string | null;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Secure token storage utilities
const TOKEN_KEY = 'token';  // Changed from 'soarfare_token'
const USER_KEY = 'user';    // Changed from 'soarfare_user'
const REDIRECT_KEY = 'soarfare_redirect';

const secureStorage = {
  setToken: (token: string) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to store token:', error);
    }
  },

  getToken: (): string | null => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      return token;
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  },

  clearToken: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Failed to clear token:', error);
    }
  },

  setUser: (user: User) => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to store user:', error);
    }
  },

  getUser: (): User | null => {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Failed to retrieve user:', error);
      return null;
    }
  },

  setRedirectPath: (path: string) => {
    try {
      sessionStorage.setItem(REDIRECT_KEY, path);
    } catch (error) {
      console.error('Failed to store redirect path:', error);
    }
  },

  getRedirectPath: (): string | null => {
    try {
      const path = sessionStorage.getItem(REDIRECT_KEY);
      if (path) {
        sessionStorage.removeItem(REDIRECT_KEY);
      }
      return path;
    } catch (error) {
      console.error('Failed to retrieve redirect path:', error);
      return null;
    }
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user && !!token;

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = secureStorage.getToken();
        const storedUser = secureStorage.getUser();

        if (storedToken && storedUser) {
          // Set user and token immediately from storage
          setToken(storedToken);
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string, redirectTo?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiClient.login({ email, password });

      if (response.success && response.data?.token && response.data?.user) {
        const { token: newToken, user: userData } = response.data;
        
        setToken(newToken);
        setUser(userData);
        secureStorage.setToken(newToken);
        secureStorage.setUser(userData);

        toast.success('Login successful!');

        // Handle redirect
        const redirect = redirectTo || secureStorage.getRedirectPath() || '/dashboard';
        router.push(redirect);
        
        return true;
      } else {
        toast.error(response.message || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiClient.register(userData);

      if (response.success && response.data?.token && response.data?.user) {
        const { token: newToken, user: newUser } = response.data;
        
        setToken(newToken);
        setUser(newUser);
        secureStorage.setToken(newToken);
        secureStorage.setUser(newUser);

        toast.success('Registration successful!');
        
        // Redirect to dashboard after registration
        const redirect = secureStorage.getRedirectPath() || '/dashboard';
        router.push(redirect);
        
        return true;
      } else {
        toast.error(response.message || 'Registration failed');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        // Call logout API to invalidate token on server
        await apiClient.logout(token);
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local state regardless of API call result
      setUser(null);
      setToken(null);
      secureStorage.clearToken();
      
      toast.success('Logged out successfully');
      router.push('/');
    }
  };

  const refreshUser = async () => {
    if (!token) return;

    try {
      const response = await apiClient.fetchUser(token);
      
      if (response.success && response.data) {
        setUser(response.data);
        secureStorage.setUser(response.data);
      } else {
        // Token might be invalid, logout user
        logout();
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const setRedirectPath = (path: string) => {
    secureStorage.setRedirectPath(path);
  };

  const getToken = (): string | null => {
    return token || secureStorage.getToken();
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
    setRedirectPath,
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

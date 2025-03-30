import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const response = await authService.getCurrentUser();
          setUser(response.data);
        } catch (err) {
          console.error('Error fetching user:', err);
          logout(); // Clear invalid token
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  // Register user
  const register = async (userData) => {
    try {
      setError(null);
      console.log('Sending registration data to API');
      
      const response = await authService.register(userData);
      console.log('Registration API response:', response);
      
      const { token, user } = response.data;
      
      // Save token and user
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      
      return user;
    } catch (err) {
      console.error('Registration error details:', err);
      
      let errorMessage = 'Registration failed';
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', err.response.data);
        errorMessage = err.response.data.message || 'Registration failed';
      } else if (err.request) {
        // The request was made but no response was received
        console.error('Error request:', err.request);
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', err.message);
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authService.login(credentials);
      const { token, user } = response.data;
      
      // Save token and user
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      
      return user;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Context value
  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 
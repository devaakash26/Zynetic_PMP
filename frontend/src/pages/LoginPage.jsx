import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const LoginPage = () => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        setApiStatus('checking');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        await axios.get(`${apiUrl}/health`, { timeout: 10000 });
        setApiStatus('online');
      } catch (err) {
        setApiStatus('offline');
      }
    };
    
    checkApiStatus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className={`max-w-md mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 transition-colors duration-200`}>
        <h1 className={`text-2xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-800'} mb-6 transition-colors duration-200`}>Log In</h1>
        
        {apiStatus === 'offline' && (
          <div className={`${darkMode ? 'bg-amber-900 text-amber-200' : 'bg-amber-50 text-amber-700'} p-3 rounded-md mb-4 transition-colors duration-200`}>
            <p className="font-medium">Cannot connect to server</p>
            <p className="text-sm mt-1">The application server appears to be offline or inaccessible. Login may not work until the connection is restored.</p>
          </div>
        )}
        
        {error && (
          <div className={`${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-50 text-red-500'} p-3 rounded-md mb-4 transition-colors duration-200`}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-200`}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border ${
                darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-200`}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-2 border ${
                darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
              required
            />
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors duration-200"
              disabled={loading || apiStatus === 'offline'}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-200`}>
            Don't have an account?{' '}
            <Link to="/register" className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'} transition-colors duration-200`}>
              Sign up
            </Link>
          </p>
          
          <p className={`mt-4 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            API Status: {apiStatus === 'online' ? '✅ Connected' : apiStatus === 'offline' ? '❌ Disconnected' : '⏳ Checking...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 
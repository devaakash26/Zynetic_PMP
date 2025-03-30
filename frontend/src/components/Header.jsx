import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { IconButton, Tooltip, useMediaQuery, Button, Avatar } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HomeIcon from '@mui/icons-material/Home';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const location = useLocation();

  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('nav') && !event.target.closest('button.mobile-menu-button')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} shadow-md transition-all duration-300 sticky top-0 z-50 backdrop-blur-sm ${darkMode ? 'bg-opacity-90' : 'bg-opacity-95'}`}
      style={{
        background: darkMode
          ? 'linear-gradient(to right, rgba(17, 24, 39, 0.97), rgba(31, 41, 55, 0.97))'
          : 'linear-gradient(to right, rgba(255, 255, 255, 0.97), rgba(249, 250, 251, 0.97))',
        boxShadow: darkMode
          ? '0 4px 20px rgba(0, 0, 0, 0.2)'
          : '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center relative">
        <Link
          to="/"
          className={`text-2xl font-bold flex items-center transition-all duration-300 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
        >
          <span className="inline-block mr-2 transform hover:scale-110 transition-transform duration-300"
            style={{
              filter: `drop-shadow(0 2px 3px ${darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.2)'})`
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill={darkMode ? "#60A5FA" : "#2563EB"} />
              <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke={darkMode ? "#60A5FA" : "#2563EB"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span
            style={{
              backgroundImage: darkMode
                ? 'linear-gradient(90deg, #60A5FA, #93C5FD)'
                : 'linear-gradient(90deg, #2563EB, #3B82F6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: darkMode
                ? '0 2px 4px rgba(37, 99, 235, 0.3)'
                : '0 2px 4px rgba(37, 99, 235, 0.2)'
            }}
          >
            Zyntic
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <IconButton
              onClick={toggleTheme}
              size="small"
              sx={{
                padding: '8px',
                bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                color: darkMode ? '#fff' : '#555',
                border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                '&:hover': {
                  bgcolor: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                  transform: 'scale(1.05)',
                  transition: 'all 0.2s'
                },
                transition: 'all 0.2s'
              }}
            >
              {darkMode ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
            </IconButton>
          </div>

          <button
            className="mobile-menu-button md:hidden focus:outline-none p-2 bg-opacity-20 rounded-md transition-all duration-200 hover:bg-opacity-30"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            style={{
              backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
            }}
          >
            {isMenuOpen ? (
              <CloseIcon className={`w-5 h-5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`} />
            ) : (
              <MenuIcon className={`w-5 h-5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`} />
            )}
          </button>
        </div>

        <nav
          className={`${isMobile
            ? `absolute top-full left-0 right-0 ${darkMode ? 'bg-gray-900 bg-opacity-95' : 'bg-white bg-opacity-98'} shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen py-4 opacity-100 border-t border-opacity-20' : 'max-h-0 py-0 opacity-0 overflow-hidden'} ${darkMode ? 'border-gray-700' : 'border-gray-200'}`
            : 'flex items-center space-x-1'
            }`}
        >
          <div className={`flex ${isMobile ? 'flex-col px-6 space-y-4' : 'items-center'}`}>
            <div className={`${isMobile ? 'pt-3 mt-3 border-t border-opacity-10' : 'mr-3'} ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"} arrow>
                <IconButton
                  onClick={toggleTheme}
                  size="small"
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    padding: '8px',
                    bgcolor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)',
                    color: darkMode ? '#e5e7eb' : '#4b5563',
                    border: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.04)',
                    '&:hover': {
                      bgcolor: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
                      transform: 'scale(1.05)',
                      transition: 'all 0.2s',
                    },
                    transition: 'all 0.2s'
                  }}
                >
                  {darkMode ? <Brightness7Icon sx={{ fontSize: 18 }} /> : <Brightness4Icon sx={{ fontSize: 18 }} color='primary' />}
                </IconButton>
              </Tooltip>
            </div>
            <div className={`${isMobile ? 'flex flex-col space-y-3' : 'flex items-center space-x-1'}`}>
              <Link
                to="/"
                className={`px-3 py-2 rounded-md flex items-center text-sm font-medium transition-all duration-200 ${isActive('/')
                    ? (darkMode ? 'bg-blue-900 bg-opacity-40 text-blue-300' : 'bg-blue-50 text-blue-700')
                    : (darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-blue-300' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600')
                  }`}
                onClick={handleNavClick}
                style={{
                  transform: isActive('/') ? 'translateY(-1px)' : 'none',
                  boxShadow: isActive('/')
                    ? (darkMode ? '0 2px 8px rgba(37, 99, 235, 0.2)' : '0 2px 5px rgba(37, 99, 235, 0.1)')
                    : 'none'
                }}
              >
                <HomeIcon sx={{
                  fontSize: 18,
                  marginRight: '6px',
                  opacity: 0.9,
                  color: isActive('/')
                    ? (darkMode ? '#93C5FD' : '#2563EB')
                    : 'inherit'
                }} />
                Home
              </Link>

              <Link
                to="/products"
                className={`px-3 py-2 rounded-md flex items-center text-sm font-medium transition-all duration-200 ${isActive('/products')
                    ? (darkMode ? 'bg-blue-900 bg-opacity-40 text-blue-300' : 'bg-blue-50 text-blue-700')
                    : (darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-blue-300' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600')
                  }`}
                onClick={handleNavClick}
                style={{
                  transform: isActive('/products') ? 'translateY(-1px)' : 'none',
                  boxShadow: isActive('/products')
                    ? (darkMode ? '0 2px 8px rgba(37, 99, 235, 0.2)' : '0 2px 5px rgba(37, 99, 235, 0.1)')
                    : 'none'
                }}
              >
                <ShoppingCartIcon sx={{
                  fontSize: 18,
                  marginRight: '6px',
                  opacity: 0.9,
                  color: isActive('/products')
                    ? (darkMode ? '#93C5FD' : '#2563EB')
                    : 'inherit'
                }} />
                Products
              </Link>
            </div>

            <div className={`${isMobile ? 'border-t border-opacity-10 pt-3 mt-3' : 'pl-1 border-l border-opacity-10'} ${darkMode ? 'border-gray-700' : 'border-gray-200'} ${isMobile ? 'flex flex-col space-y-3' : 'flex items-center'}`}>
              {isAuthenticated ? (
                <div className={`${isMobile ? 'flex flex-col space-y-3' : 'flex items-center space-x-3'}`}>
                  <Link
                    to="/dashboard"
                    className={`px-3 py-2 rounded-md flex items-center text-sm font-medium transition-all duration-200 ${isActive('/dashboard')
                        ? (darkMode ? 'bg-blue-900 bg-opacity-40 text-blue-300' : 'bg-blue-50 text-blue-700')
                        : (darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-blue-300' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600')
                      }`}
                    onClick={handleNavClick}
                    style={{
                      transform: isActive('/dashboard') ? 'translateY(-1px)' : 'none',
                      boxShadow: isActive('/dashboard')
                        ? (darkMode ? '0 2px 8px rgba(37, 99, 235, 0.2)' : '0 2px 5px rgba(37, 99, 235, 0.1)')
                        : 'none'
                    }}
                  >
                    <DashboardIcon sx={{
                      fontSize: 18,
                      marginRight: '6px',
                      opacity: 0.9,
                      color: isActive('/dashboard')
                        ? (darkMode ? '#93C5FD' : '#2563EB')
                        : 'inherit'
                    }} />
                    Dashboard
                  </Link>

                  <div className={`flex ${isMobile ? 'items-start mt-2' : 'items-center ml-4'}`}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        fontSize: '0.8rem',
                        bgcolor: darkMode ? '#3b82f6' : '#2563eb',
                        border: darkMode ? '2px solid rgba(255,255,255,0.1)' : '2px solid rgba(37, 99, 235, 0.2)',
                        boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(37, 99, 235, 0.15)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: darkMode ? '0 3px 10px rgba(0,0,0,0.3)' : '0 3px 10px rgba(37, 99, 235, 0.2)'
                        }
                      }}
                    >
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </Avatar>
                    <div className="ml-2 flex flex-col">
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {user?.name || user?.email?.split('@')[0]}
                      </span>
                      {user?.role === 'admin' && (
                        <span className={`${darkMode ? 'bg-purple-900 bg-opacity-40 text-purple-300 border border-purple-700 border-opacity-30' : 'bg-purple-50 text-purple-700 border border-purple-200'} text-xs px-1.5 py-0.5 rounded-sm inline-block mt-1 font-medium`}>
                          Admin
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      handleNavClick();
                    }}
                    className={`flex items-center text-sm font-medium px-3 py-2 rounded-md ${isMobile ? 'mt-2' : 'ml-4'} transition-all duration-200 ${darkMode
                        ? 'text-red-300 bg-red-900 bg-opacity-20 hover:bg-opacity-30 hover:text-red-200'
                        : 'text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700'
                      }`}
                    style={{
                      boxShadow: darkMode ? '0 1px 5px rgba(239, 68, 68, 0.1)' : '0 1px 5px rgba(239, 68, 68, 0.07)',
                      transform: 'translateY(0)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = darkMode
                        ? '0 3px 8px rgba(239, 68, 68, 0.2)'
                        : '0 3px 8px rgba(239, 68, 68, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = darkMode
                        ? '0 1px 5px rgba(239, 68, 68, 0.1)'
                        : '0 1px 5px rgba(239, 68, 68, 0.07)';
                    }}
                  >
                    <LogoutIcon sx={{ fontSize: 18, marginRight: '6px' }} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className={`${isMobile ? 'flex flex-col space-y-3' : 'flex items-center space-x-3'}`}>
                  <Link
                    to="/login"
                    className={`flex items-center text-sm font-medium px-3 py-2 rounded-md transition-all duration-200 ${isActive('/login')
                        ? (darkMode ? 'bg-gray-800 text-blue-300' : 'bg-gray-100 text-blue-700')
                        : (darkMode ? 'text-gray-200 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100')
                      }`}
                    onClick={handleNavClick}
                    style={{
                      transform: isActive('/login') ? 'translateY(-1px)' : 'none',
                      boxShadow: isActive('/login')
                        ? (darkMode ? '0 2px 8px rgba(37, 99, 235, 0.15)' : '0 2px 5px rgba(37, 99, 235, 0.08)')
                        : 'none',
                      border: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.04)'
                    }}
                  >
                    <LoginIcon sx={{
                      fontSize: 18,
                      marginRight: '6px',
                      color: isActive('/login')
                        ? (darkMode ? '#93C5FD' : '#2563EB')
                        : 'inherit'
                    }} />
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className={`flex items-center justify-center text-sm font-medium px-4 py-2 rounded-md transition-all duration-300 ${darkMode
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white'
                        : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white'
                      }`}
                    onClick={handleNavClick}
                    style={{
                      boxShadow: darkMode
                        ? '0 4px 10px rgba(37, 99, 235, 0.2)'
                        : '0 4px 10px rgba(37, 99, 235, 0.15)',
                      transform: 'translateY(0)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = darkMode
                        ? '0 6px 15px rgba(37, 99, 235, 0.3)'
                        : '0 6px 15px rgba(37, 99, 235, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = darkMode
                        ? '0 4px 10px rgba(37, 99, 235, 0.2)'
                        : '0 4px 10px rgba(37, 99, 235, 0.15)';
                    }}
                  >
                    <PersonAddIcon sx={{ fontSize: 18, marginRight: '6px' }} />
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 
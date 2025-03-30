import { createTheme } from '@mui/material/styles';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

export const MuiThemeProvider2 = ({ children }) => {
  const { darkMode } = useTheme();
  
  const theme = useMemo(() => 
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: {
          main: darkMode ? '#90caf9' : '#1976d2',
          light: darkMode ? '#e3f2fd' : '#bbdefb',
          dark: darkMode ? '#42a5f5' : '#1565c0',
          contrastText: darkMode ? '#000' : '#fff',
        },
        secondary: {
          main: darkMode ? '#ce93d8' : '#9c27b0',
          light: darkMode ? '#f3e5f5' : '#e1bee7',
          dark: darkMode ? '#ab47bc' : '#7b1fa2',
          contrastText: darkMode ? '#000' : '#fff',
        },
        background: {
          default: darkMode ? '#121212' : '#fff',
          paper: darkMode ? '#1e1e1e' : '#fff',
        },
        text: {
          primary: darkMode ? '#fff' : 'rgba(0, 0, 0, 0.87)',
          secondary: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
        },
        error: {
          main: darkMode ? '#f44336' : '#d32f2f',
          light: darkMode ? '#e57373' : '#ef5350',
          dark: darkMode ? '#d32f2f' : '#c62828',
        },
        warning: {
          main: darkMode ? '#ff9800' : '#ed6c02',
          light: darkMode ? '#ffb74d' : '#ff9800',
          dark: darkMode ? '#f57c00' : '#e65100',
        },
        info: {
          main: darkMode ? '#29b6f6' : '#0288d1',
          light: darkMode ? '#4fc3f7' : '#03a9f4',
          dark: darkMode ? '#0288d1' : '#01579b',
        },
        success: {
          main: darkMode ? '#66bb6a' : '#2e7d32',
          light: darkMode ? '#81c784' : '#4caf50',
          dark: darkMode ? '#388e3c' : '#1b5e20',
        },
      },
      components: {
        MuiPaper: {
          styleOverrides: {
            root: {
              transition: 'background-color 0.2s ease-in-out',
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: '8px',
            },
          },
        },
        MuiDataGrid: {
          styleOverrides: {
            root: {
              border: 'none',
              '& .MuiDataGrid-cell': {
                padding: '16px',
              },
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: darkMode ? '#333' : '#f3f4f6',
                color: darkMode ? '#fff' : '#4b5563',
                fontWeight: 'bold',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: darkMode ? '#333' : '#f8fafc',
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: `1px solid ${darkMode ? '#333' : '#e5e7eb'}`,
                backgroundColor: darkMode ? '#1e1e1e' : '#f9fafb',
              },
            },
          },
        },
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
          fontWeight: 700,
        },
        h2: {
          fontWeight: 700,
        },
        h3: {
          fontWeight: 600,
        },
        h4: {
          fontWeight: 600,
        },
        h5: {
          fontWeight: 500,
        },
        h6: {
          fontWeight: 500,
        },
      },
      shape: {
        borderRadius: 8,
      },
      transitions: {
        duration: {
          shortest: 150,
          shorter: 200,
          short: 250,
          standard: 300,
          complex: 375,
          enteringScreen: 225,
          leavingScreen: 195,
        },
      },
    }), 
  [darkMode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}; 
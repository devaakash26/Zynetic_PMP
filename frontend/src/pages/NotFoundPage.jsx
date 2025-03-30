import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useTheme } from '../context/ThemeContext';

const NotFoundPage = () => {
  const muiTheme = useMuiTheme();
  const { darkMode } = useTheme();
  
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center',
          py: 8,
        }}
      >
        <Typography variant="h1" component="h1" 
          sx={{ 
            fontSize: { xs: '4rem', md: '6rem' },
            fontWeight: 'bold',
            color: muiTheme.palette.primary.main,
            mb: 2
          }}
        >
          404
        </Typography>
        
        <Typography variant="h4" component="h2" gutterBottom
          sx={{ 
            mb: 4,
            color: darkMode ? 'text.primary' : 'text.primary'
          }}
        >
          Page Not Found
        </Typography>
        
        <Typography variant="body1" 
          sx={{ 
            mb: 4,
            maxWidth: '600px',
            color: darkMode ? 'text.secondary' : 'text.secondary'
          }}
        >
          temporarily unavailable.
        </Typography>
        
        <Button 
          component={Link} 
          to="/" 
          variant="contained" 
          color="primary"
          size="large"
          sx={{ borderRadius: 2 }}
        >
          Go to Homepage
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage; 
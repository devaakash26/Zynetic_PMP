import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Box, Container, Typography, Button, Grid, Paper, Card, CardContent, Avatar, Divider, useMediaQuery, Fab, Zoom } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import DevicesIcon from '@mui/icons-material/Devices';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PeopleIcon from '@mui/icons-material/People';
import StorefrontIcon from '@mui/icons-material/Storefront';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { styled, keyframes } from '@mui/material/styles';

// Create animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedBox = styled(Box)(({ delay = 0 }) => ({
  animation: `${fadeIn} 0.8s ease-out forwards`,
  animationDelay: `${delay}s`,
  opacity: 0,
}));

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const FloatingBox = styled(Box)({
  animation: `${floatAnimation} 3s ease-in-out infinite`,
});

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const { darkMode } = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '540px', sm: '580px', md: '680px' },
          overflow: 'hidden',
          background: darkMode
            ? 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95))'
            : 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.9))',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: darkMode ? 0.1 : 0.15,
            zIndex: 0
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '80px',
            background: `linear-gradient(to top, ${darkMode ? 'rgba(17, 24, 39, 1)' : 'white'}, transparent)`,
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg" sx={{ height: '100%', position: 'relative', zIndex: 1, pt: { xs: 6, md: 0 } }}>
          <Grid container spacing={5} sx={{ height: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
            <Grid item xs={12} md={7}>
              <AnimatedBox sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    color: 'white',
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' },
                    lineHeight: 1.1,
                    mb: 2.5,
                    textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}
                >
                  Streamline Your<br />
                  <span style={{ color: '#38BDF8' }}>Product Management</span>
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: 400,
                    mb: 4.5,
                    maxWidth: '600px',
                    mx: { xs: 'auto', md: 0 },
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    lineHeight: 1.6
                  }}
                >
                  Simplify inventory tracking, optimize sales, and make data-driven decisions with our powerful product management platform.
                </Typography>

                <Box sx={{
                  display: 'flex',
                  gap: 2.5,
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', md: 'flex-start' }
                }}>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/products"
                    size="large"
                    sx={{
                      bgcolor: '#fff',
                      color: darkMode? "oklch(0.52 0.105 223.128)" : "primary.main",
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      borderRadius: '50px',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
                        transition: 'all 0.3s',
                      }
                    }}
                  >
                    Browse Products
                  </Button>

                  {!isAuthenticated && (
                    <Button
                      variant="outlined"
                      component={Link}
                      to="/register"
                      size="large"
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        borderRadius: '50px',
                        borderWidth: '2px',
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          transform: 'translateY(-3px)',
                          transition: 'all 0.3s',
                        }
                      }}
                    >
                      Get Started Free
                    </Button>
                  )}
                </Box>

                {/* Feature Highlights */}
                <Box sx={{
                  display: 'flex',
                  gap: 3,
                  mt: 5.5,
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', md: 'flex-start' }
                }}>
                  {['Easy Setup',  'Free Trial'].map((feature, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <CheckCircleIcon sx={{ color: '#38BDF8', fontSize: 20 }} />
                      <Typography color="white" fontWeight={500} fontSize="0.95rem">
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </AnimatedBox>
            </Grid>
            {!isMobile && (
              <Grid item xs={12} md={5}>
                <AnimatedBox delay={0.3} sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: { xs: 'none', md: 'block' }
                }}>
                  <FloatingBox sx={{
                    position: 'absolute',
                    right: { md: '-20px', lg: '-50px' },
                    bottom: '-30px',
                    maxWidth: '550px',
                    width: '100%',
                    height: 'auto',
                    borderRadius: '16px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    overflow: 'hidden'
                  }}>
                    <img
                      src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015"
                      alt="Product management dashboard"
                      style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </FloatingBox>
                </AnimatedBox>
              </Grid>
            )}
          </Grid>
        </Container>

        {/* Scrolling indicator */}
        <Box sx={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 5,
          display: { xs: 'none', md: 'block' }
        }}>
          <Fab
            size="small"
            color="primary"
            aria-label="scroll down"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              opacity: 0.9,
              '&:hover': {
                bgcolor: 'white',
                opacity: 1
              }
            }}
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
              });
            }}
          >
            <div className='animate-bounce'>
              <ArrowForwardIcon sx={{ transform: 'rotate(90deg)' }} color='primary' />
            </div>
          </Fab>
        </Box>
      </Box>

      {/* Stats Section */}
      <Box sx={{
        py: { xs: 10, md: 12 },
        bgcolor: darkMode ? 'background.paper' : '#f8fafc',
        borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="space-around">
            {[
              {
                icon: <PeopleIcon sx={{ fontSize: 40, color: '#3B82F6' }} />,
                number: '10,000+',
                label: 'Happy Users'
              },
              {
                icon: <InventoryIcon sx={{ fontSize: 40, color: '#10B981' }} />,
                number: '500,000+',
                label: 'Products Managed'
              },
              {
                icon: <StorefrontIcon sx={{ fontSize: 40, color: '#F59E0B' }} />,
                number: '98%',
                label: 'Customer Satisfaction'
              }
            ].map((stat, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <AnimatedBox delay={0.2 + (index * 0.1)} sx={{ textAlign: 'center' }}>
                  <Box sx={{
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    {stat.icon}
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      color: darkMode ? 'white' : 'text.primary',
                      fontSize: { xs: '2rem', md: '2.5rem' }
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {stat.label}
                  </Typography>
                </AnimatedBox>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

     

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 12, md: 15 },
          textAlign: 'center',
          bgcolor: darkMode ? 'rgba(17, 24, 39, 0.7)' : 'rgba(59, 130, 246, 0.05)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': darkMode ? {} : {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
          },
          '&::after': darkMode ? {} : {
            content: '""',
            position: 'absolute',
            bottom: '0',
            right: '0',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)'
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <AnimatedBox delay={0.2}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 800,
                mb: 3.5,
                color: darkMode ? 'white' : 'text.primary',
                fontSize: { xs: '2rem', md: '2.7rem' }
              }}
            >
              Ready to Streamline Your<br />Product Management?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: darkMode ? 'text.secondary' : 'text.secondary',
                maxWidth: '700px',
                mx: 'auto',
                mb: 6,
                fontSize: { xs: '1rem', md: '1.125rem' }
              }}
            >
              Join thousands of businesses that use our platform to manage their products more efficiently
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to={isAuthenticated ? '/dashboard' : '/register'}
                sx={{
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: '50px',
                  fontSize: '1rem',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s',
                  }
                }}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
              </Button>

              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/products"
                sx={{
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: '50px',
                  fontSize: '1rem',
                  borderWidth: '2px',
                  '&:hover': {
                    borderWidth: '2px',
                    transform: 'translateY(-3px)',
                    transition: 'all 0.3s',
                  }
                }}
              >
                Browse Products
              </Button>
            </Box>
          </AnimatedBox>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 
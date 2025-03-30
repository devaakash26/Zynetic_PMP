import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Button, Typography, Box, Container, Grid, Paper, Rating, Skeleton,
  CircularProgress, Alert, Dialog, DialogActions, Stack, Avatar,
  DialogContent, DialogContentText, DialogTitle, Fade, Breadcrumbs,
  Snackbar, Card, CardMedia, Divider, Chip, useMediaQuery, Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PersonIcon from '@mui/icons-material/Person';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import CheckIcon from '@mui/icons-material/Check';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { darkMode } = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:900px)');

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [imageLoaded, setImageLoaded] = useState(false);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product with ID:', id);
        const response = await productService.getProductById(id);
        console.log('Product data received:', response.data);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product:', err.response?.data || err.message);
        setError('Failed to load product. It may have been removed or does not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle delete
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const productId = product.id || product._id;
      await productService.deleteProduct(productId);
      setSnackbar({
        open: true,
        message: 'Product deleted successfully',
        severity: 'success'
      });
      navigate('/products', { replace: true });
    } catch (err) {
      setError('Failed to delete product. Please try again.');
      setSnackbar({
        open: true,
        message: 'Failed to delete product',
        severity: 'error'
      });
      console.error(err);
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Check if current user is owner or admin
  const canEditOrDelete = () => {
    if (!isAuthenticated || !product) return false;
    return product.userId === user.id || user.role === 'admin';
  };

  // Determine back button URL
  const getBackUrl = () => {
    try {
      // Check if we came from dashboard
      const referrer = document.referrer;
      if (referrer && referrer.includes('/dashboard')) {
        return '/dashboard';
      }
    } catch (e) {
      console.error('Error checking referrer:', e);
    }
    // Default to products list
    return '/products';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
          <Skeleton variant="text" width={120} height={40} />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width={300} height={30} />
        </Box>

        <Paper sx={{
          borderRadius: { xs: 2, md: 3 },
          overflow: 'hidden',
          border: `1px solid ${darkMode ? '#333' : '#e5e7eb'}`,
          bgcolor: darkMode ? 'background.paper' : '#fff',
          boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.08)',
        }}>
          <Grid container>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={500} width="100%" animation="wave" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 4 }}>
                <Skeleton variant="text" height={60} width="80%" sx={{ mb: 2 }} />
                <Skeleton variant="text" height={30} width="60%" sx={{ mb: 2 }} />
                <Skeleton variant="text" height={40} width="40%" sx={{ mb: 3 }} />
                <Skeleton variant="rectangular" height={1} width="100%" sx={{ mb: 3 }} />
                <Skeleton variant="text" height={30} width="40%" sx={{ mb: 2 }} />
                <Skeleton variant="text" height={100} width="100%" sx={{ mb: 4 }} />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Skeleton variant="rectangular" height={40} width={100} />
                  <Skeleton variant="rectangular" height={40} width={100} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
          {error}
        </Alert>
        <Button
          component={Link}
          to="/products"
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          sx={{ textTransform: 'none' }}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  if (!product) return null;

  // Format price for display
  const formattedPrice = parseFloat(product.price).toFixed(2);
  const rating = parseFloat(product.rating) || 0;

  return (
    <Box sx={{
      bgcolor: darkMode ? 'background.default' : '#f9fafb',
      minHeight: '100vh',
      pt: { xs: 2, md: 4 },
      pb: { xs: 4, md: 8 }
    }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{
            mb: 3,
            '& .MuiBreadcrumbs-ol': {
              flexWrap: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            },
            '& .MuiBreadcrumbs-li': {
              whiteSpace: 'nowrap'
            }
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: darkMode ? '#94a3b8' : '#64748b',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Home
          </Link>
          <Link
            to="/products"
            style={{
              textDecoration: 'none',
              color: darkMode ? '#94a3b8' : '#64748b'
            }}
          >
            Products
          </Link>
          <Typography color="text.primary" sx={{
            fontSize: '0.875rem',
            maxWidth: isMobile ? '90px' : '300px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {product.name}
          </Typography>
        </Breadcrumbs>

        <Paper
          elevation={darkMode ? 3 : 1}
          sx={{
            borderRadius: { xs: 2, md: 3 },
            overflow: 'hidden',
            border: `1px solid ${darkMode ? '#333' : '#e5e7eb'}`,
            bgcolor: darkMode ? 'background.paper' : '#fff',
            boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.08)',
            mb: 4
          }}
        >
          <div className='flex justify-between'>
            <Grid container >
              <Grid item xs={12} md={6} sx={{
                borderRight: { xs: 'none', md: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}` },
                borderBottom: { xs: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`, md: 'none' },
                position: 'relative',
                bgcolor: darkMode ? '#111' : '#fafafa'
              }}>
                <Box
                  sx={{
                    position: 'relative',
                    height: { xs: '320px', sm: '400px', md: '500px' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { xs: 2, md: 4 }
                  }}
                >
                  {!imageLoaded && (
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height="100%"
                      animation="wave"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        borderRadius: 1,
                        bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                      }}
                    />
                  )}
                  <CardMedia
                    component="img"
                    image={product.imageUrl ?
                      (product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5000${product.imageUrl}`) :
                      'https://via.placeholder.com/800x800?text=No+Image'
                    }
                    alt={product.name}
                    onError={(e) => {
                      console.error('Image failed to load:', product.imageUrl);
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/800x800?text=No+Image';
                    }}
                    onLoad={() => setImageLoaded(true)}
                    sx={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      borderRadius: 1,
                      boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.02)'
                      },
                      display: imageLoaded ? 'block' : 'none'
                    }}
                  />

                  {/* Status tag - Example of professional e-commerce element */}
                  <Chip
                    label="In Stock"
                    color="success"
                    size="small"
                    icon={<CheckIcon />}
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      fontWeight: 'medium',
                      fontSize: '0.7rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                  />
                </Box>
              </Grid>

              {/* Right side - Product Details */}
              <Grid item xs={12} md={6} fullWidth>
                <Fade in={true} timeout={800}>
                  <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                    <Box sx={{ mb: 3 }}>
                      <Chip
                        label={product.category || 'Uncategorized'}
                        color="primary"
                        size="small"
                        variant="outlined"
                        icon={<CategoryIcon />}
                        sx={{
                          mb: 1.5,
                          fontWeight: 'medium',
                          borderRadius: '16px'
                        }}
                      />

                      <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                          fontWeight: 'bold',
                          color: darkMode ? '#f3f4f6' : '#1e293b',
                          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                          lineHeight: 1.2,
                          mb: 2
                        }}
                      >
                        {product.name}
                      </Typography>

                      {/* Rating and review count */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating
                          value={rating}
                          precision={0.5}
                          readOnly
                          size="small"
                          sx={{ color: darkMode ? 'orange' : '#f59e0b' }}
                        />
                        <Typography variant="body2" sx={{ ml: 1, color: darkMode ? 'text.secondary' : 'text.secondary' }}>
                          {rating.toFixed(1)} ({Math.floor(rating * 5 + 12)})
                        </Typography>
                      </Box>
                    </Box>

                    {/* Price */}
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 3,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: darkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
                      border: `1px solid ${darkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)'}`,
                    }}>

                      <Typography
                        variant="h4"
                        component="div"
                        sx={{
                          fontWeight: 'bold',
                          color: darkMode ? '#4ade80' : '#059669',
                          letterSpacing: '-0.025em'
                        }}
                      >
                        ₹{formattedPrice}
                      </Typography>
                      
                    </Box>



                    <Divider sx={{ mb: 3 }} />

                    {/* Description */}
                    <Typography variant="h6" gutterBottom sx={{
                      fontWeight: 'bold',
                      color: darkMode ? '#f3f4f6' : '#1e293b',
                    }}>
                      Description
                    </Typography>

                    <Typography variant="body1" sx={{
                      mb: 4,
                      color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                      whiteSpace: 'pre-line',
                      lineHeight: 1.7
                    }}>
                      {product.description || 'No description available.'}
                    </Typography>



                    <Divider sx={{ mb: 3 }} />

                    {/* Product metadata with improved styling */}
                    <Stack spacing={2} sx={{ mb: 4 }}>
                      <Typography variant="h6" sx={{
                        fontWeight: 'bold',
                        color: darkMode ? '#f3f4f6' : '#1e293b',
                      }}>
                        Details
                      </Typography>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                            transition: 'background-color 0.2s',
                            '&:hover': {
                              bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
                            }
                          }}>
                            <Avatar
                              sx={{
                                bgcolor: darkMode ? 'primary.dark' : 'primary.lighter',
                                width: 32,
                                height: 32
                              }}
                            >
                              <PersonIcon sx={{ fontSize: 18, color: darkMode ? 'primary.lighter' : 'primary.dark' }} />
                            </Avatar>
                            <Typography variant="body2">
                              Added by {product.userId?.name || 'Unknown'}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                            transition: 'background-color 0.2s',
                            '&:hover': {
                              bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
                            }
                          }}>
                            <Avatar
                              sx={{
                                bgcolor: darkMode ? 'info.dark' : 'info.lighter',
                                width: 32,
                                height: 32
                              }}
                            >
                              <DateRangeIcon sx={{ fontSize: 18, color: darkMode ? 'info.lighter' : 'info.dark' }} />
                            </Avatar>
                            <Typography variant="body2">
                              {new Date(product.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Stack>

                    {/* Edit/Delete buttons with improved styling */}
                    {canEditOrDelete() && (
                      <Box sx={{
                        display: 'flex',
                        gap: 2,
                        mt: 4,
                        mb: 2
                      }}>
                        <Tooltip title="Edit this product">
                          <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<EditIcon />}
                            component={Link}
                            to={`/product/edit/${product.id || product._id}`}
                            sx={{
                              borderRadius: 2,
                              textTransform: 'none',
                              py: 1.2,
                              fontWeight: 'medium',
                              boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                              transition: 'all 0.2s',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: darkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
                              }
                            }}
                          >
                            Edit
                          </Button>
                        </Tooltip>

                        <Tooltip title="Delete this product">
                          <Button
                            variant="outlined"
                            fullWidth
                            // color="error"
                            startIcon={<DeleteIcon color='error' />}
                            onClick={() => setShowDeleteConfirm(true)}
                            sx={{
                              borderRadius: 2,
                              textTransform: 'none',
                              py: 1.2,
                              fontWeight: 'medium',
                              boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                              transition: 'all 0.2s',
                              borderColor: darkMode ? 'rgba(211, 47, 47, 0.5)' : 'rgba(211, 47, 47, 0.5)',
                              color: darkMode ? '#f87171' : 'black',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: darkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                                borderColor: darkMode ? 'rgba(211, 47, 47, 0.7)' : 'rgba(211, 47, 47, 0.7)',
                                backgroundColor: darkMode ? 'rgba(211, 47, 47, 0.04)' : 'rgba(211, 47, 47, 0.04)'
                              }
                            }}
                          >
                            <span className='text-red-700'>Delete</span>
                          </Button>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>
                </Fade>
              </Grid>
            </Grid>
          </div>
        </Paper>

        {/* Back Link at Bottom */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            component={Link}
            to={getBackUrl()}
            startIcon={<ArrowBackIcon />}
            variant="text"
            sx={{
              textTransform: 'none',
              color: darkMode ? '#94a3b8' : '#64748b',
              '&:hover': {
                bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
              }
            }}
          >
            Back to {getBackUrl() === '/dashboard' ? 'Dashboard' : 'Products'}
          </Button>
        </Box>
      </Container>

      {/* Delete confirmation dialog */}
      <Dialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}

      >
        <DialogTitle sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <Box component="span" sx={{ fontWeight: 'bold' }}>"{product.name}"</Box>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setShowDeleteConfirm(false)}
            disabled={deleteLoading}
            variant="outlined"
            sx={{
              borderRadius: 1,
              textTransform: 'none',
              minWidth: '80px',
              color: darkMode ? 'text.primary' : 'gray.700',
              borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
            }}
          >
            <span className='text-gray-700'>Cancel</span>
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={deleteLoading}
            autoFocus
            variant="contained"
            sx={{
              borderRadius: 1,
              textTransform: 'none',
              minWidth: '80px',
              boxShadow: 'none'
            }}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetailPage;
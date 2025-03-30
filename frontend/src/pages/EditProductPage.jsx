import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../services/api';
import ProductForm from '../components/ProductForm';
import { 
  Typography, Container, Box, Button, Alert, 
  CircularProgress, Skeleton 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Attempting to fetch product for edit. ID from URL params:', id);
        
        if (!id) {
          console.error('No product ID provided in URL params');
          setError('Missing product ID. Please try accessing this page again.');
          setFetchLoading(false);
          return;
        }
        
        const response = await productService.getProductById(id);
        
        if (!response.data) {
          setError('Product could not be found with the provided ID.');
          setFetchLoading(false);
          return;
        }
        
        
        setProduct(response.data);
      } catch (err) {
        setError('Failed to load product. It may have been removed or does not exist.');
      } finally {
        setFetchLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    
    try {
      // Ensure we're using the MongoDB _id consistently
      const productId = product._id;
      
      await productService.updateProduct(productId, formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error updating product:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Determine where to go back to
  const determineBackUrl = () => {
    try {
      // Check if we came from product details
      const referrer = document.referrer;
      if (referrer && referrer.includes(`/products/${id}`)) {
        return `/products/${id}`;
      }
    } catch (e) {
      console.error('Error checking referrer:', e);
    }
    // Default to dashboard
    return '/dashboard';
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          component={Link}
          to={determineBackUrl()}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Product
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {fetchLoading ? (
        <Box sx={{ py: 4 }}>
          <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={120} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={50} />
        </Box>
      ) : (
        product && (
          <ProductForm 
            initialData={product}
            onSubmit={handleSubmit}
            isLoading={loading}
          />
        )
      )}
    </Container>
  );
};

export default EditProductPage; 
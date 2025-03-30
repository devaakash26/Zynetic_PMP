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
          console.error('Response received but no product data found');
          setError('Product could not be found with the provided ID.');
          setFetchLoading(false);
          return;
        }
        
        console.log('Product data received successfully:', response.data);
        console.log('Product ID types - URL param:', typeof id, ', returned id:', typeof response.data.id, ', returned _id:', typeof response.data._id);
        console.log('Product IDs - URL param:', id, ', returned id:', response.data.id, ', returned _id:', response.data._id);
        
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product for edit:', err);
        console.error('Error details:', err.response?.data || err.message);
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
      const productId = id || product._id || product.id;
      console.log('Updating product with ID:', productId);
      console.log('Update data:', formData);
      
      await productService.updateProduct(productId, formData);
      console.log('Product updated successfully');
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
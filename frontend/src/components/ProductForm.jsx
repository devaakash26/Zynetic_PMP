import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import {
  Box, TextField, Button, Typography, Paper, MenuItem, FormControl,
  InputLabel, Select, Rating, Chip, Alert, Grid, CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const categories = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Kitchen',
  'Beauty',
  'Sports',
  'Toys',
  'Others'
];

const ProductForm = ({ initialData, isEdit = false, onSubmit, isLoading }) => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    rating: 0,
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price ? initialData.price.toString() : '',
        category: initialData.category || '',
        imageUrl: initialData.imageUrl || '',
        rating: initialData.rating || 0,
      });
      
      if (initialData.imageUrl) {
        setImagePreview(initialData.imageUrl);
      }
    }
  }, [initialData]);
  
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
      isValid = false;
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
      isValid = false;
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
      isValid = false;
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const handleRatingChange = (_, newValue) => {
    setFormData({ ...formData, rating: newValue });
  };
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      setError('File type not supported. Please upload JPEG, PNG, GIF, or WEBP images.');
      return;
    }
    
    if (file.size > maxSize) {
      setError('File is too large. Maximum size is 5MB.');
      return;
    }
    
    setUploading(true);
    setError('');
    
    try {
      const formDataObj = new FormData();
      formDataObj.append('image', file);
      
      const response = await productService.uploadImage(formDataObj);
      
      if (response.data && response.data.imageUrl) {
        const imageUrl = response.data.imageUrl;
        setFormData(prevFormData => ({
          ...prevFormData,
          imageUrl
        }));
        setImagePreview(imageUrl);
      } else {
        throw new Error('Invalid response from image upload');
      }
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      rating: formData.rating,
      imageUrl: formData.imageUrl,
    };
    
    // If external onSubmit is provided, use it
    if (onSubmit) {
      onSubmit(productData);
      return;
    }
    
    // Otherwise use the internal handleSubmit logic
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      if (isEdit && initialData) {
        const productId = initialData._id || initialData.id;
        await productService.updateProduct(productId, productData);
        setSuccess(true);
        setTimeout(() => {
          navigate(`/products/${productId}`);
        }, 1500);
      } else {
        const response = await productService.createProduct(productData);
        setSuccess(true);
        setTimeout(() => {
          navigate(`/products/${response.data._id}`);
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Use external loading state if provided, otherwise use internal
  const isSubmitting = isLoading !== undefined ? isLoading : loading;
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: { xs: 2, sm: 3 }, 
        borderRadius: 2,
        bgcolor: darkMode ? 'background.paper' : 'white',
        border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
        boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.25)' : '0 4px 20px rgba(0,0,0,0.1)',
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 1 }}>
          Product {isEdit ? 'updated' : 'created'} successfully! Redirecting...
        </Alert>
      )}
      
      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.name}
              helperText={errors.name}
              sx={{ mb: 3 }}
              variant="outlined"
            />
            
            <TextField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.price}
              helperText={errors.price}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
              }}
              sx={{ mb: 3 }}
              variant="outlined"
            />
            
            <FormControl fullWidth required error={!!errors.category} sx={{ mb: 3 }}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <Typography color="error" variant="caption">
                  {errors.category}
                </Typography>
              )}
            </FormControl>
            
            <Box sx={{ mb: 3 }}>
              <Typography component="legend" sx={{ mb: 1, fontWeight: 500 }}>
                Rating
              </Typography>
              <Rating
                name="rating"
                value={formData.rating}
                onChange={handleRatingChange}
                precision={0.5}
                size="large"
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={5}
              fullWidth
              required
              error={!!errors.description}
              helperText={errors.description}
              sx={{ mb: 3 }}
              variant="outlined"
            />
            
            <Box sx={{ mb: 3 }}>
              <Typography component="p" sx={{ mb: 1, fontWeight: 500 }}>
                Product Image
              </Typography>
              
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                onChange={handleImageUpload}
              />
              
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  sx={{ 
                    mb: 2,
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </Button>
              </label>
              
              {uploading && (
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  <Typography variant="body2">Uploading...</Typography>
                </Box>
              )}
              
              {imagePreview && (
                <Box sx={{ mt: 2, position: 'relative', borderRadius: 2, overflow: 'hidden', border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}>
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                    }}
                  />
                  <Chip
                    label="Preview Image"
                    color="primary"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      opacity: 0.9,
                      fontWeight: 500
                    }}
                  />
                </Box>
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              sx={{ 
                borderRadius: 1,
                textTransform: 'none',
                px: 3,
                py: 1,
                fontWeight: 500,
                minWidth: '100px',
                color: darkMode ? 'text.primary' : 'gray.700',
                borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
              }}
            >
             <span className={darkMode ? 'text-white' : 'text-black'}> Cancel</span>
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{ 
                borderRadius: 1,
                textTransform: 'none',
                px: 3,
                py: 1,
                fontWeight: 500,
                minWidth: '100px',
                position: 'relative',
                boxShadow: 2
              }}
            >
              {isSubmitting && (
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              )}
              {isEdit ? 'Update Product' : 'Create Product'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ProductForm; 
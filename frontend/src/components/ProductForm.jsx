import { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Paper,
  Grid,
  Stack,
  Alert,
  Input,
  FormHelperText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

// Styled component for the upload button
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// Styled upload area
const UploadArea = styled(Box)(({ theme, dragActive }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  border: '2px dashed',
  borderColor: dragActive ? theme.palette.primary.main : theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  backgroundColor: dragActive ?
    theme.palette.primary.main + '0d' : // 5% opacity version of primary color
    'transparent',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.primary.main + '08', // 3% opacity
    borderColor: theme.palette.primary.light
  }
}));

const ProductForm = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    rating: '',
    image: null
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Set initial data if provided (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        category: initialData.category || '',
        price: initialData.price || '',
        rating: initialData.rating || 0,
      });

      if (initialData.imageUrl) {
        const fullImageUrl = initialData.imageUrl.startsWith('http')
          ? initialData.imageUrl
          : `http://localhost:5000${initialData.imageUrl}`;
        setPreview(fullImageUrl);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  // Process uploaded file
  const processFile = (file) => {
    if (file) {
      setFormData({ ...formData, image: file });

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.name || !formData.description || !formData.category || !formData.price) {
      setError('Please fill all required fields.');
      return;
    }

    // Submit form data
    onSubmit(formData);
  };

  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Beauty', 'Sports', 'Toys', 'Others'];

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
            <TextField
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              required
              multiline
              rows={4}
              variant="outlined"
            />

            <FormControl fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
                required
              >
                <MenuItem value="">Select Category</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Price (₹)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              inputProps={{ step: "0.01", min: "0" }}
              placeholder="Enter price in Rupees"
            />

            <TextField
              label="Rating (0-5)"
              name="rating"
              type="number"
              value={formData.rating}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              inputProps={{ step: "0.1", min: "0", max: "5" }}
            />

            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <ImageIcon sx={{ mr: 1 }} />
              Product Image
            </Typography>

            <UploadArea
              dragActive={dragActive}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              component="label"
            >
              {preview ? (
                <Box sx={{ textAlign: 'center', mb: 2, width: '100%' }}>
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'inline-block',
                      '&:hover .image-overlay': {
                        opacity: 1
                      }
                    }}
                  >
                    <img
                      src={preview}
                      alt="Preview"
                      style={{
                        maxHeight: '200px',
                        maxWidth: '100%',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Box
                      className="image-overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        borderRadius: '8px'
                      }}
                    >
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent opening file dialog
                          setPreview(null);
                          setFormData({ ...formData, image: null });
                        }}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Click to change image
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    textAlign: 'center',
                    animation: dragActive ? 'pulse 1.5s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%': { opacity: 0.7 },
                      '50%': { opacity: 1 },
                      '100%': { opacity: 0.7 }
                    }
                  }}
                >
                  <AddPhotoAlternateIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                  <Typography variant="body1" gutterBottom>
                    Drag & drop an image here, or click to select
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Supports: JPG, PNG, GIF, WEBP (Max 5MB)
                  </Typography>
                </Box>
              )}

              <VisuallyHiddenInput
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
              />
            </UploadArea>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{ py: 1.5 }}
            >
              {isLoading ? 'Saving...' : initialData ? 'Update Product' : 'Create Product'}
            </Button>
          </Grid>
      </form>
    </Paper>
  );
};

export default ProductForm; 
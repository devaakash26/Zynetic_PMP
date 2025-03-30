import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { productService } from '../services/api';
// Import MUI components
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Button, Snackbar, Alert, CircularProgress, Tooltip, Box, Paper, Typography, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DataGrid } from '@mui/x-data-grid';

const DashboardPage = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Add state for delete dialog
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    productId: null,
    productName: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Helper function to safely convert to number
  const safeNumber = (value, defaultValue = 0) => {
    if (value === undefined || value === null) return defaultValue;
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  };

  // Fetch user's products
  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        // Admin can see all products, regular users see only their own
        const params = user.role !== 'admin' ? { userId: user.id } : {};
        const response = await productService.getProducts(params);
        console.log('Products response:', response.data);

        // Process each product to ensure numeric values
        const processedProducts = response.data.products.map(product => {
          // Log the original values
          console.log(`Product - id: ${product.id || product._id}, name: ${product.name}, price: ${product.price}, type: ${typeof product.price}, rating: ${product.rating}`);

          // Convert price and rating to numbers, defaulting to 0 if invalid
          let price = 0;
          let rating = 0;

          try {
            price = parseFloat(product.price);
            if (isNaN(price)) price = 0;
          } catch (e) {
            console.error('Error parsing price:', e);
          }

          try {
            rating = parseFloat(product.rating);
            if (isNaN(rating)) rating = 0;
          } catch (e) {
            console.error('Error parsing rating:', e);
          }

          // Log the processed values
          console.log(`Processed - price: ${price}, rating: ${rating}`);

          // Create a clean, simple object with properly typed values
          return {
            id: product.id || product._id,
            name: product.name || "N/A",
            description: product.description || "",
            category: product.category || "Unknown",
            price: price,
            rating: rating,
            imageUrl: product.imageUrl || "",
            userId: product.userId || "",
            _id: product._id
          };
        });

        setProducts(processedProducts);
      } catch (err) {
        setError('Failed to load your products. Please try again.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProducts();
  }, [user]);

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (id, name) => {
    setDeleteDialog({
      open: true,
      productId: id,
      productName: name
    });
  };

  // Close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      productId: null,
      productName: ''
    });
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Show success message
  const showSuccessMessage = (message) => {
    setSnackbar({
      open: true,
      message,
      severity: 'success'
    });
  };

  // Show error message
  const showErrorMessage = (message) => {
    setSnackbar({
      open: true,
      message,
      severity: 'error'
    });
  };

  // Replace the confirmDelete function
  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await productService.deleteProduct(deleteDialog.productId);
      // Remove the product from the state
      setProducts(products.filter(p => (p.id || p._id) !== deleteDialog.productId));
      // Show success message
      showSuccessMessage(`${deleteDialog.productName} has been deleted successfully.`);
      // Close the dialog
      handleCloseDeleteDialog();
    } catch (err) {
      showErrorMessage('Failed to delete product. Please try again.');
      console.error(err);
      // Close the dialog
      handleCloseDeleteDialog();
    } finally {
      setDeleteLoading(false);
    }
  };

  // Replace the old handleDelete function
  const handleDelete = (id, name) => {
    handleOpenDeleteDialog(id, name);
  };

  // Define columns for the DataGrid
  const columns = [
    {
      field: 'image',
      headerName: 'Image',
      width: 120,
      renderCell: (params) => (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%'
        }}>
          {params.row.imageUrl ? (
            <img
              src={params.row.imageUrl.startsWith('http') ? params.row.imageUrl : `http://localhost:5000${params.row.imageUrl}`}
              alt={params.row.name}
              style={{
                width: '60px',
                height: '60px',
                objectFit: 'cover',
                borderRadius: '4px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',

              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/80?text=No+Image';
              }}
            />
          ) : (
            <Box sx={{
              width: '60px',
              height: '60px',
              bgcolor: darkMode ? '#333' : '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px'
            }}>
              <Typography variant="caption" color="text.secondary">No image</Typography>
            </Box>
          )}
        </Box>
      ),
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'name',
      headerName: 'Product Name',
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', pl: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {params.value}
          </Typography>
          {params.row.description && (
            <Typography variant="caption" color="text.secondary" sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              maxWidth: '100%'
            }}>
              {params.row.description.slice(0, 60)}
              {params.row.description.length > 60 ? '...' : ''}
            </Typography>
          )}
        </Box>
      )
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      renderCell: (params) => (
        <Box sx={{
          bgcolor: darkMode ? 'rgba(56, 189, 248, 0.1)' : '#e0f2fe',
          color: darkMode ? '#38bdf8' : '#0369a1',
          borderRadius: '16px',
          px: 1.5,
          py: 0.5,
          fontSize: '0.75rem',
          fontWeight: 500
        }}>
          {params.value}
        </Box>
      ),
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      type: 'number',
      renderCell: (params) => (
        <Typography variant="body2" sx={{
          fontWeight: 'bold',
          color: darkMode ? '#4ade80' : '#047857'
        }}>
          ₹{(params.value !== undefined && params.value !== null ? params.value : 0).toFixed(2)}
        </Typography>
      ),
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 120,
      type: 'number',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 1.5,
              py: 0.5,
              borderRadius: '12px',
              bgcolor: darkMode ? 'rgba(234, 179, 8, 0.1)' : '#fef3c7',
              color: darkMode ? '#eab308' : '#92400e',
              fontSize: '0.75rem',
              fontWeight: 'medium'
            }}
          >
            {(params.value !== undefined && params.value !== null ? params.value : 0).toFixed(1)} / 5
          </Box>
        </Box>
      ),
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            justifyContent: 'center',
            width: '100%'
          }}
        >
          <IconButton
            component={Link}
            to={`/products/${params.row.id}`}
            size="small"
            sx={{
              color: 'primary.main',
              bgcolor: darkMode ? 'primary.lighter' : 'rgba(25, 118, 210, 0.15)',
              '&:hover': {
                bgcolor: darkMode ? 'primary.light' : 'rgba(25, 118, 210, 0.25)',
              },
              border: darkMode ? 'none' : '1px solid rgba(25, 118, 210, 0.3)',
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            component={Link}
            to={`/product/edit/${params.row.id}`}
            size="small"
            sx={{
              color: 'info.main',
              bgcolor: darkMode ? 'info.lighter' : 'rgba(3, 169, 244, 0.15)',
              '&:hover': {
                bgcolor: darkMode ? 'info.light' : 'rgba(3, 169, 244, 0.25)',
              },
              border: darkMode ? 'none' : '1px solid rgba(3, 169, 244, 0.3)',
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.id, params.row.name)}
            size="small"
            sx={{
              color: 'error.main',
              bgcolor: darkMode ? 'error.lighter' : 'rgba(244, 67, 54, 0.15)',
              '&:hover': {
                bgcolor: darkMode ? 'error.light' : 'rgba(244, 67, 54, 0.25)',
              },
              border: darkMode ? 'none' : '1px solid rgba(244, 67, 54, 0.3)',
            }}
          >
            <DeleteIcon fontSize="small" color='error' />
          </IconButton>
        </Box>
      ),
    }
  ];

  return (
    <Box sx={{ px: 4, py: 4, maxWidth: '1400px', mx: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: darkMode ? '#f3f4f6' : '#1e293b', mb: 1 }}>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {user?.name || user?.email}
            {user?.role === 'admin' && (
              <Box
                component="span"
                sx={{
                  ml: 1,
                  bgcolor: darkMode ? '#9333ea30' : '#f3e8ff',
                  color: darkMode ? '#d8b4fe' : '#7e22ce',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: 'medium'
                }}
              >
                Admin
              </Box>
            )}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/dashboard/add-product"
          sx={{
            px: 3,
            py: 1,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'medium'
          }}
        >
          Add Product
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {products.length > 0 ? (
            <Paper
              elevation={0}
              sx={{
                height: 600,
                width: '100%',
                borderRadius: 2,
                overflow: 'hidden',
                border: `1px solid ${darkMode ? '#333' : '#e5e7eb'}`,
                bgcolor: darkMode ? 'background.paper' : undefined,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <DataGrid
                  rows={products}
                  columns={columns}
                  pageSizeOptions={[5, 10, 25]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 10, page: 0 } }
                  }}
                  disableColumnMenu
                  disableRowSelectionOnClick
                  disableColumnSelector
                  disableDensitySelector
                  sx={{
                    border: 'none',
                    height: '100%',
                    '& .MuiDataGrid-main': {
                      '& .MuiDataGrid-cell:focus': { outline: 'none' }
                    },
                    '& .MuiDataGrid-cell': {
                      py: 2,
                      px: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    },
                    '& .MuiDataGrid-cell[data-field="name"]': { justifyContent: 'flex-start' },
                    '& .MuiDataGrid-columnHeader': {
                      backgroundColor: darkMode ? '#333' : '#f9fafb',
                      color: darkMode ? '#f3f4f6' : '#4b5563',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      py: 2
                    },
                    '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' },
                    '& .MuiDataGrid-row': {
                      minHeight: '80px !important',
                      maxHeight: '80px !important'
                    },
                    '& .MuiDataGrid-row:hover': { backgroundColor: darkMode ? '#333' : '#f9fafb' },
                    '& .MuiDataGrid-row:not(:last-child)': {
                      borderBottom: `1px solid ${darkMode ? '#333' : '#f3f4f6'}`
                    },
                    '& .MuiDataGrid-footerContainer': {
                      borderTop: `1px solid ${darkMode ? '#333' : '#e5e7eb'}`,
                      backgroundColor: darkMode ? '#1e1e1e' : '#f9fafb'
                    }
                  }}
                />
              </Box>
            </Paper>
          ) : (
            <Paper
              elevation={0}
              sx={{
                textAlign: 'center',
                py: 8,
                px: 4,
                borderRadius: 2,
                border: `1px solid ${darkMode ? '#333' : '#e5e7eb'}`,
                bgcolor: darkMode ? 'background.paper' : undefined,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: darkMode ? 'primary.dark' : 'primary.lighter',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}
              >
                <AddIcon sx={{ fontSize: 40, color: darkMode ? 'primary.light' : 'primary.main' }} />
              </Box>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold', color: darkMode ? '#f3f4f6' : '#1e293b' }}>
                No Products Yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 450, mx: 'auto' }}>
                It looks like you haven't added any products yet. Add your first product to start managing your inventory.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                component={Link}
                to="/product/add"
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 1,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
                }}
              >
                Add Your First Product
              </Button>
            </Paper>
          )}
        </>
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <Box component="span" sx={{ fontWeight: 'bold' }}>"{deleteDialog.productName}"</Box>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDeleteDialog}
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
            onClick={confirmDelete}
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

export default DashboardPage; 
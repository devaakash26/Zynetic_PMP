import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { productService } from '../services/api';
// Import MUI components
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Button, Snackbar, Alert, CircularProgress, Tooltip, Box, Paper, Typography, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, InputAdornment,
  useMediaQuery, Chip, TablePagination, Card, CardContent, CardMedia, Divider
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
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isMediumScreen = useMediaQuery('(max-width:900px)');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortOption, setSortOption] = useState('createdAt_desc');
  const [showFilters, setShowFilters] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    avgRating: 0,
    recentlyAdded: 0
  });
  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Beauty', 'Sports', 'Toys', 'Others'];
  const sortOptions = [
    { value: 'createdAt_desc', label: 'Newest First' },
    { value: 'createdAt_asc', label: 'Oldest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Name: A to Z' },
    { value: 'name_desc', label: 'Name: Z to A' },
    { value: 'rating_desc', label: 'Highest Rated' }
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [sortField, sortDirection] = sortOption.split('_');

      const params = {
        page: page + 1,
        limit: rowsPerPage,
        sortBy: sortField,
        sortOrder: sortDirection,
        search: searchQuery,
        category: filterCategory
      };

      const response = await productService.getProducts(params);

      // Map MongoDB _id to id field for DataGrid but preserve all other fields exactly as received
      const productsWithId = response.data.products.map(product => ({
        ...product,
        id: product._id,
      }));

      setProducts(productsWithId);
      setTotalCount(response.data.pagination.total);

      // Calculate dashboard stats
      if (response.data.products.length > 0) {
        const uniqueCategories = [...new Set(response.data.products.map(product => product.category))];
        const ratings = response.data.products.map(product => product.rating || 0);
        const avgRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const recentlyAdded = response.data.products.filter(product => {
          return new Date(product.createdAt) >= oneWeekAgo;
        }).length;

        setDashboardStats({
          totalProducts: response.data.pagination.total,
          totalCategories: uniqueCategories.length,
          avgRating: avgRating.toFixed(1),
          recentlyAdded
        });
      }
    } catch (err) {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage, sortOption, filterCategory, searchQuery]);

  const handleConfirmDelete = (id) => {
    setDeleteProductId(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenConfirmDialog(false);
    setDeleteProductId(null);
  };

  const handleDelete = async () => {
    if (!deleteProductId) return;

    setDeleteLoading(true);
    try {
      await productService.deleteProduct(deleteProductId);
      setProducts(products.filter(product => product._id !== deleteProductId));
      setTotalCount(prev => prev - 1);
      setDashboardStats(prev => ({
        ...prev,
        totalProducts: prev.totalProducts - 1
      }));
      setSnackbar({
        open: true,
        message: 'Product deleted successfully',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to delete product',
        severity: 'error'
      });
    } finally {
      setDeleteLoading(false);
      handleCloseDialog();
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleCategoryChange = (event) => {
    setFilterCategory(event.target.value);
    setPage(0);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    setPage(0);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Define columns for the DataGrid
  const columns = [
    {
      field: 'image',
      headerName: 'Image',
      width: 120,
      renderCell: (params) => {
        const productId = params.row._id;
        const imageUrl = params.row.imageUrl;

        return (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'
          }}>
            {imageUrl ? (
              <img
                src={imageUrl}
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
        );
      },
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
            to={`/products/${params.row._id}`}
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
            to={`/product/edit/${params.row._id}`}
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
            onClick={() => handleConfirmDelete(params.row._id)}
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
                    }
                  }}
                />
              </Box>
            </Paper>
          ) : (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 400,
              border: `1px dashed ${darkMode ? '#333' : '#e5e7eb'}`,
              borderRadius: 2,
              bgcolor: darkMode ? 'background.paper' : undefined,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                No products found
              </Typography>
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
          )}
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Delete"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary"  variant="outlined" sx={{
            borderRadius: 1,
            textTransform: 'none',
            minWidth: '80px',
            
            color: darkMode ? 'text.primary' : 'gray.700',
            borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
          }}>
            <span className={darkMode ? 'text-white border' : 'text-black '}> Cancel</span>
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
      {/* <Dialog
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
            Cancel
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
      </Dialog> */}
    </Box>
  );
};

export default DashboardPage;
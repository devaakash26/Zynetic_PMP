import { useState, useEffect } from 'react';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const ProductsPage = () => {
  const { darkMode } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  // Filter visibility
  const [showFilters, setShowFilters] = useState(false);
  
  // Available categories
  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Beauty', 'Sports', 'Toys', 'Others'];
  
  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getProducts({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });
      
      // Log the products to debug image URLs
      console.log('Products fetched in ProductsPage:', response.data.products);
      
      // Check each product's imageUrl
      const productsWithValidImages = response.data.products.map(product => {
        if (product.imageUrl) {
          console.log(`ProductsPage - Product ${product._id} has image:`, product.imageUrl);
        }
        return product;
      });
      
      setProducts(productsWithValidImages);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch products on initial load and when filters or pagination change
  useEffect(() => {
    fetchProducts();
  }, [
    pagination.page, 
    pagination.limit, 
    filters.sortBy, 
    filters.sortOrder
  ]);
  
  // Apply filters
  const handleApplyFilters = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchProducts();
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    
    setPagination({ ...pagination, page: 1 });
    fetchProducts();
  };
  
  // Handle input change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4 md:mb-0 transition-colors duration-200`}>Products</h1>
        
        <div className="flex items-center">
          <div className="relative mr-4">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search products..."
              className={`pl-10 pr-4 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
            />
            <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`} />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} px-4 py-2 rounded-md transition-colors duration-200`}
          >
            <FaFilter className="mr-2" />
            Filters
          </button>
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-md p-6 mb-8 transition-colors duration-200`}>
          <form onSubmit={handleApplyFilters}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 transition-colors duration-200`}>
                  Category
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className={`w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md transition-colors duration-200`}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 transition-colors duration-200`}>
                  Price Range (₹)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Min ₹"
                    className={`w-1/2 p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'} rounded-md transition-colors duration-200`}
                    min="0"
                  />
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-200`}>-</span>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max ₹"
                    className={`w-1/2 p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'} rounded-md transition-colors duration-200`}
                    min="0"
                  />
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 transition-colors duration-200`}>
                  Min Rating
                </label>
                <input
                  type="number"
                  name="minRating"
                  value={filters.minRating}
                  onChange={handleFilterChange}
                  placeholder="Minimum rating"
                  className={`w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'} rounded-md transition-colors duration-200`}
                  min="0"
                  max="5"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 transition-colors duration-200`}>
                  Sort By
                </label>
                <div className="flex items-center space-x-2">
                  <select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className={`w-1/2 p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md transition-colors duration-200`}
                  >
                    <option value="createdAt">Date Added</option>
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="rating">Rating</option>
                  </select>
                  <select
                    name="sortOrder"
                    value={filters.sortOrder}
                    onChange={handleFilterChange}
                    className={`w-1/2 p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md transition-colors duration-200`}
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleResetFilters}
                className={`mr-2 px-4 py-2 border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'} rounded-md transition-colors duration-200`}
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className={`${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-50 text-red-500'} p-4 rounded-md mb-6 transition-colors duration-200`}>
          {error}
        </div>
      )}
      
      {/* Loading spinner */}
      {loading ? (
        <div className="flex justify-center my-12">
          <div className={`animate-spin rounded-full h-12 w-12 border-t-2 ${darkMode ? 'border-blue-400' : 'border-blue-500'} transition-colors duration-200`}></div>
        </div>
      ) : (
        <>
          {/* Products grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-lg transition-colors duration-200`}>No products found matching your criteria.</p>
            </div>
          )}
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className={`inline-flex rounded-md ${darkMode ? 'shadow-lg' : 'shadow'} transition-colors duration-200`}>
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className={`px-4 py-2 rounded-l-md border ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200`}
                >
                  Previous
                </button>
                
                <div className={`px-4 py-2 border-t border-b ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-800 text-gray-300' 
                    : 'border-gray-300 bg-gray-50 text-gray-700'
                } transition-colors duration-200`}>
                  {pagination.page} of {pagination.totalPages}
                </div>
                
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.totalPages}
                  className={`px-4 py-2 rounded-r-md border ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsPage; 
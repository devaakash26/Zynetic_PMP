import axios from 'axios';

// Use the environment variable with a fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false // Set to true if your API uses cookies for auth
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', 
      error.response ? `${error.response.status} - ${error.response.config.url}` : error.message
    );
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// Product services
export const productService = {
  getProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => {
    if (!id) {
      console.error('getProductById called with invalid ID:', id);
      return Promise.reject(new Error('Invalid product ID'));
    }
    
    console.log(`Fetching product with ID: ${id}`);
    
    return api.get(`/products/${id}`)
      .then(response => {
        console.log('Product API response data:', response.data);
        if (!response.data) {
          console.warn('Product API response missing data property');
        }
        return response;
      })
      .catch(error => {
        console.error('Product API error:', error.response || error);
        throw error;
      });
  },
  createProduct: (productData) => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      if (key === 'image' && productData[key] instanceof File) {
        formData.append(key, productData[key]);
      } else if (productData[key] !== undefined) {
        formData.append(key, productData[key]);
      }
    });
    
    return api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateProduct: (id, productData) => {
    console.log(`Updating product with ID: ${id}`);
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      if (key === 'image' && productData[key] instanceof File) {
        formData.append(key, productData[key]);
      } else if (productData[key] !== undefined) {
        formData.append(key, productData[key]);
      }
    });

    return api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      console.log('Product update API response:', response.data);
      return response;
    })
    .catch(error => {
      console.error('Product update API error:', error.response || error);
      throw error;
    });
  },
  deleteProduct: (id) => {
    console.log(`Deleting product with ID: ${id}`);
    return api.delete(`/products/${id}`)
      .then(response => {
        console.log('Product delete API response:', response.data);
        return response;
      })
      .catch(error => {
        console.error('Product delete API error:', error.response || error);
        throw error;
      });
  },
};

export default api; 
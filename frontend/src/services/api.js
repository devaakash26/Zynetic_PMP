import axios from 'axios';

// Use the environment variable with a fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API URL:', API_URL); // Log the API URL being used

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false,
  timeout: 15000 // 15 seconds timeout to prevent hanging requests
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors specifically
    if (error.message === 'Network Error') {
      console.error('Network Error - Unable to connect to API server:', API_URL);
      return Promise.reject(new Error('Unable to connect to server. Please check your internet connection and try again.'));
    }

    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - API server took too long to respond');
      return Promise.reject(new Error('Server request timed out. Please try again later.'));
    }

    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  
  login: async (email, password) => {
    try {
      console.log('Attempting login with:', { email, server: API_URL });
      return await api.post('/auth/login', { email, password });
    } catch (error) {
      console.error('Login error:', error.message, error.response?.data);
      // Make error messages more user-friendly
      if (error.message === 'Network Error') {
        throw new Error('Unable to connect to server. Please check your internet connection and try again.');
      } else if (error.response?.status === 401) {
        throw new Error('Invalid email or password. Please try again.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Login failed. Please try again later.');
      }
    }
  },
  
  getUserProfile: () => api.get('/auth/me'),
  updateUserProfile: (userData) => api.put('/auth/profile', userData),
};

// Product services
export const productService = {
  getProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => {
    if (!id) {
      return Promise.reject(new Error('Invalid product ID'));
    }
    return api.get(`/products/${id}`);
  },
  createProduct: (productData) => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      if (key === 'image' && productData[key] instanceof File) {
        formData.append('image', productData[key]);
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
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      if (key === 'image' && productData[key] instanceof File) {
        formData.append('image', productData[key]);
      } else if (productData[key] !== undefined) {
        formData.append(key, productData[key]);
      }
    });
    
    return api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteProduct: (id) => api.delete(`/products/${id}`),
  
  uploadImage: (formData) => {
    return api.post('/products/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api; 
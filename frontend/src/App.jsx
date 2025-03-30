import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Header from './components/Header';
import { useTheme } from './context/ThemeContext';
import { MuiThemeProvider2 } from './theme/ThemeConfig';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import DashboardPage from './pages/DashboardPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import NotFoundPage from './pages/NotFoundPage';
import TestDataGrid from './components/TestDataGrid';

// Footer component that uses the theme
const Footer = () => {
  const { darkMode } = useTheme();
  
  return (
    <footer className={`${darkMode ? 'bg-gray-900' : 'bg-gray-800'} text-white text-center py-4 transition-colors duration-200`}>
      <p>&copy; {new Date().getFullYear()} Zyntic. All rights reserved.</p>
    </footer>
  );
};

// Main content component with theme styling
const MainContent = () => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} transition-colors duration-200`}>
      <Header />
      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/test-grid" element={<TestDataGrid />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/add-product" element={<AddProductPage />} />
            <Route path="/product/edit/:id" element={<EditProductPage />} />
          </Route>

          {/* Admin routes (future expansion) */}
          <Route element={<AdminRoute />}>
            {/* <Route path="/admin" element={<AdminDashboard />} /> */}
          </Route>

          {/* 404 Page - Must be last */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <MuiThemeProvider2>
            <MainContent />
          </MuiThemeProvider2>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { CardMedia } from '@mui/material';

const ProductCard = ({ product }) => {
  const { id, name, description, category, price, rating, imageUrl } = product;
  const { darkMode } = useTheme();

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden transition-colors duration-200`}>
      <div className="h-48 overflow-hidden">
        {imageUrl ? (
          <CardMedia
            component="img"
            height="200"
            src={imageUrl}
            alt={name}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
            sx={{ objectFit: 'cover' }}
          />
        ) : (
          <div className={`w-full h-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center transition-colors duration-200`}>
            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>No image</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} truncate transition-colors duration-200`}>{name}</h3>
          <span className={`${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'} text-xs px-2 py-1 rounded transition-colors duration-200`}>
            {category}
          </span>
        </div>
        
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-3 h-12 overflow-hidden transition-colors duration-200`}>
          {description.length > 100 ? `${description.substring(0, 100)}...` : description}
        </p>
        
        <div className="flex justify-between items-center">
          <span className={`text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} transition-colors duration-200`}>
            ₹{price.toFixed(2)}
          </span>
          
          <div className="flex items-center">
            <FaStar className="text-yellow-400 mr-1" />
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-200`}>{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between">
          <Link 
            to={`/products/${product.id || product._id}`}
            className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'} text-sm transition-colors duration-200`}
            data-id={product.id || product._id}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 
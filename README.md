# Zyntic - Product Management Web App

A full-stack web application for product management with user authentication, dark/light theme support, and comprehensive CRUD functionalities.

## Features

- **User Authentication**:
  - Register/Login with JWT authentication
  - Secure password storage
  - Protected routes with authentication guards

- **Product Management**:
  - Create, read, update, delete products
  - Upload product images to Cloudinary
  - Product detail views with responsive design
  - Dashboard for managing products

- **User Experience**:
  - Dark/Light theme toggle
  - Responsive design for all device sizes
  - Form validation and error handling
  - Success notifications and loading states
  - Elegant UI with Material UI components

- **Search & Organization**:
  - Filter products by category
  - Sort products by various attributes
  - Search products by name
  - Pagination for product listings

## Technology Stack

### Frontend
- React.js (with hooks and context API)
- React Router for navigation
- Material UI for component library
- Tailwind CSS for custom styling
- Axios for API communication

### Backend
- Node.js with Express.js
- MongoDB database with Mongoose
- JWT for authentication
- Cloudinary for image storage
- Express validators for input validation

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Installation and Setup

1. Clone the repository:
```
git clone https://github.com/devaakash26/Zynetic_PMP.git
cd zyntic
```

2. Set up the backend:
```
cd backend
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the backend folder with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the backend server:
```
npm run dev
```

5. Set up the frontend:
```
cd ../frontend
npm install
```

6. Create a `.env` file in the frontend folder:
```
VITE_API_URL=http://localhost:5000/api
```

7. Start the frontend development server:
```
npm run dev
```

8. Visit `http://localhost:5173` in your browser to use the application.

## Deployment

The application is configured for deployment on Vercel:

- Backend API: https://zyntic-backend.vercel.app/api
- Frontend: https://zynetic-aakash.vercel.app

To deploy your own version:

1. Create a Vercel account and install the Vercel CLI
2. Set up your environment variables in the Vercel dashboard
3. Deploy the backend and frontend separately using the Vercel CLI or GitHub integration

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with filtering, sorting, pagination)
- `GET /api/products/:id` - Get single product by ID
- `POST /api/products` - Create a new product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)
- `POST /api/products/upload` - Upload product image to Cloudinary

## Project Structure

```
zyntic/
├── backend/                # Node.js backend
│   ├── src/                # Backend source code
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Express middlewares
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── index.js        # Main entry point
│   ├── .env                # Environment variables
│   └── vercel.json         # Vercel deployment configuration
├── frontend/               # React frontend
│   ├── public/             # Static files
│   ├── src/                # Frontend source code
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context providers (Theme, Auth)
│   │   ├── pages/          # Application pages
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── .env                # Environment variables
│   └── vercel.json         # Vercel deployment configuration
└── README.md               # This file
```

## Key Features in Detail

### Dark/Light Theme
The application supports a dynamic theme system that allows users to switch between dark and light modes. The theme is persistent across browser sessions using local storage.

### Authentication Flow
Users can register, login, and access protected routes. The authentication system uses JWT tokens stored in local storage, with route guards preventing unauthorized access to protected pages.

### Product Management
- **Create**: Users can add new products with details like name, description, price, category, and image.
- **Read**: View products in a responsive grid layout with detailed individual product pages.
- **Update**: Edit existing products with a user-friendly form interface.
- **Delete**: Remove products with a confirmation dialog to prevent accidental deletion.

### Image Uploads
The application uses Cloudinary for image storage, allowing users to upload and display product images. Image preview is available before submission.

### Responsive Design
The UI is fully responsive and works on devices of all sizes, from mobile phones to desktop computers.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 

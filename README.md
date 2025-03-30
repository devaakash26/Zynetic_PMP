# Zyntic - Product Management Web App

A full-stack web application for product management with user authentication and CRUD functionalities.

## Features

- **User Authentication**:
  - Register/Login with JWT authentication
  - Role-based access control (admin vs regular users)
  - Protected routes

- **Product Management**:
  - Create, read, update, delete products
  - Upload product images
  - Filter products by category, price range, rating
  - Search products by name or description
  - Sort products by various attributes
  - Pagination

## Technology Stack

### Frontend
- React.js (with hooks and functional components)
- React Router for navigation
- Tailwind CSS for styling
- Axios for API communication

### Backend
- Node.js with Express.js
- MongoDB database
- Prisma ORM
- JWT for authentication
- Multer for file uploads

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- Docker and Docker Compose (optional, for containerized setup)

### Installation and Setup

#### Method 1: Local Development

1. Clone the repository:
```
git clone https://github.com/yourusername/zyntic.git
cd zyntic
```

2. Set up the backend:
```
cd backend
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the backend folder based on the provided example
   - Update the MongoDB connection string

4. Generate Prisma client:
```
npx prisma generate
```

5. Start the backend server:
```
npm run dev
```

6. Set up the frontend:
```
cd ../frontend
npm install
```

7. Start the frontend development server:
```
npm run dev
```

8. Visit `http://localhost:5173` in your browser to use the application.

#### Method 2: Using Docker Compose

1. Clone the repository:
```
git clone https://github.com/yourusername/zyntic.git
cd zyntic
```

2. Build and start the containers:
```
docker-compose up -d
```

3. Visit `http://localhost:3000` in your browser to use the application.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filtering, sorting, pagination)
- `GET /api/products/:id` - Get single product by ID
- `POST /api/products` - Create a new product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

## Project Structure

```
zyntic/
├── backend/              # Node.js backend
│   ├── prisma/           # Prisma schema and migrations
│   ├── src/              # Backend source code
│   │   ├── controllers/  # Route controllers
│   │   ├── middlewares/  # Express middlewares
│   │   ├── routes/       # API routes
│   │   ├── utils/        # Utility functions
│   │   └── index.js      # Main entry point
│   ├── uploads/          # Product images storage
│   └── .env              # Environment variables
├── frontend/             # React frontend
│   ├── public/           # Static files
│   ├── src/              # Frontend source code
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React context providers
│   │   ├── pages/        # Application pages
│   │   ├── services/     # API services
│   │   └── utils/        # Utility functions
├── docker-compose.yml    # Docker Compose configuration
└── README.md             # This file
```

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
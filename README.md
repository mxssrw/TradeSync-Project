# TradeSync - Full-Stack Trading Platform

A modern full-stack trading application built with NestJS, React, and Aurora DSQL, deployed on AWS Lambda with Docker support.

## 🏗️ Architecture

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: Aurora DSQL (PostgreSQL) with Prisma ORM
- **Authentication**: JWT with Passport.js
- **Deployment**: AWS Lambda with Serverless Framework
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL (local) / Aurora DSQL (production)
- **Cloud**: AWS Lambda, API Gateway

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- AWS CLI (for deployment)

### 1. Clone and Setup
```bash
cd "TradeSync Project"

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration
```bash
# Backend environment
cd backend
cp .env.example .env
# Edit .env with your database and JWT settings

# Update database URL in .env:
DATABASE_URL="postgresql://tradesync:tradesync_password@localhost:5432/tradesync?schema=public"
```

### 3. Database Setup
```bash
cd backend

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate
```

### 4. Development Mode

#### Option A: Using Docker Compose (Recommended)
```bash
# From project root
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# Database Admin: http://localhost:8080
```

#### Option B: Manual Setup
```bash
# Terminal 1: Start database
docker run --name postgres-dev -e POSTGRES_PASSWORD=tradesync_password -e POSTGRES_USER=tradesync -e POSTGRES_DB=tradesync -p 5432:5432 -d postgres:15-alpine

# Terminal 2: Start backend
cd backend
npm run start:dev

# Terminal 3: Start frontend
cd frontend
npm run dev
```

## 📚 API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:3001/api
- API Base URL: http://localhost:3001

### Key Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /trades` - Get user trades
- `POST /trades` - Create new trade
- `PUT /trades/:id` - Update trade
- `DELETE /trades/:id` - Delete trade

## 🗄️ Database Schema

### Users Table
- `id` (String, Primary Key)
- `email` (String, Unique)
- `username` (String, Unique)
- `password` (String, Hashed)
- `firstName` (String, Optional)
- `lastName` (String, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Trades Table
- `id` (String, Primary Key)
- `symbol` (String) - Stock symbol
- `type` (Enum) - MARKET, LIMIT, STOP, STOP_LIMIT
- `side` (Enum) - BUY, SELL
- `quantity` (Float)
- `price` (Float)
- `totalValue` (Float)
- `status` (Enum) - PENDING, EXECUTED, CANCELLED, REJECTED
- `userId` (String, Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## 🎯 Features

### ✅ Implemented
- [x] User authentication (register/login)
- [x] JWT-based authorization
- [x] Trade creation and management
- [x] Responsive UI with Tailwind CSS
- [x] State management with Zustand
- [x] Docker containerization
- [x] Database with Prisma ORM
- [x] API documentation with Swagger
- [x] AWS Lambda deployment configuration

### 🔄 Planned
- [ ] Real-time trade updates
- [ ] Portfolio analytics
- [ ] Trade history charts
- [ ] Email notifications
- [ ] Mobile app

## 🚢 Deployment

### AWS Lambda Deployment
```bash
cd backend

# Install Serverless CLI
npm install -g serverless

# Configure AWS credentials
aws configure

# Deploy to AWS
npm run sls:deploy
```

### Production Environment Variables
```bash
# Required for production
DATABASE_URL="your-aurora-dsql-connection-string"
JWT_SECRET="your-production-jwt-secret"
FRONTEND_URL="https://your-frontend-domain.com"
```

## 🛠️ Development Commands

### Backend
```bash
cd backend

# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugging

# Build & Production
npm run build             # Build the application
npm run start:prod        # Start production build

# Database
npm run prisma:generate   # Generate Prisma client
npm run prisma:migrate    # Run migrations
npm run prisma:studio     # Open Prisma Studio

# Testing
npm run test             # Run unit tests
npm run test:e2e         # Run e2e tests

# Serverless
npm run sls:deploy       # Deploy to AWS
npm run sls:remove       # Remove from AWS
npm run sls:offline      # Run serverless offline
```

### Frontend
```bash
cd frontend

# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

### Docker
```bash
# Full stack
docker-compose up -d          # Start all services
docker-compose up --build -d  # Start all services with rebuild
docker-compose down           # Stop all services
docker-compose logs           # View logs

# Build and rebuild
docker-compose build          # Build all services
docker-compose build --no-cache  # Build without cache

# Individual services
docker-compose up postgres    # Database only
docker-compose up backend     # Backend only
docker-compose up frontend    # Frontend only
```

## 🔧 Configuration

### Backend Configuration
- `backend/src/main.ts` - Application bootstrap
- `backend/serverless.yml` - AWS Lambda configuration
- `backend/prisma/schema.prisma` - Database schema
- `backend/.env` - Environment variables

### Frontend Configuration
- `frontend/vite.config.ts` - Vite configuration
- `frontend/tailwind.config.js` - Tailwind CSS configuration
- `frontend/src/stores/` - Zustand store configurations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Happy Trading! 📈**

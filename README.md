# TradeSync - Full-Stack Trading Platform

A modern full-stack trading application built with NestJS, React, and Aurora DSQL, deployed on AWS Lambda with Docker support.

## 🏗️ Architecture

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: Aurora DSQL (PostgreSQL) with Prisma ORM (Maybe Change)
- **Authentication**: JWT with Passport.js (Maybe Change)
- **Deployment**: AWS Lambda with Serverless Framework
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI component**: ShadUI
- **State Management**: Zustand (Not Sure)
- **Routing**: React Router v6 (Maybe Change)

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

TradeSync provides two Docker Compose configurations for different environments:

#### 🏗️ **Production Environment** (`docker-compose.yml`)
For production-ready deployment with optimized builds:

```bash
# Start all services (production mode)
docker-compose up -d

# Start with rebuild (if you made changes)
docker-compose up --build -d

# Stop all services
docker-compose down

# View logs from all services
docker-compose logs

# View logs from specific service
docker-compose logs frontend
docker-compose logs backend
docker-compose logs postgres
```

**Services included:**
- **Frontend**: Production build served on `http://localhost:3000`
- **Backend**: NestJS API on `http://localhost:3001`
- **PostgreSQL**: Database on port `5432`

#### 🔧 **Development Environment** (`docker-compose.dev.yml`)
For active development with hot reload and volume mounting:

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Start with rebuild
docker-compose -f docker-compose.dev.yml up --build -d

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# View development logs
docker-compose -f docker-compose.dev.yml logs -f
```

**Development features:**
- **Frontend**: Vite dev server with hot reload on `http://localhost:5173`
- **Backend**: Development mode with auto-restart on `http://localhost:3001`
- **Volume mounting**: Code changes reflect immediately
- **PostgreSQL**: Same database configuration

#### 🛠️ **Build & Maintenance Commands**

```bash
# Build all services without cache
docker-compose build --no-cache

# Build specific service
docker-compose build frontend
docker-compose build backend

# Pull latest base images
docker-compose pull

# View service status
docker-compose ps

# Execute commands in running containers
docker-compose exec backend npm run prisma:studio
docker-compose exec postgres psql -U tradesync -d tradesync

# Clean up unused resources
docker system prune -a
```

#### 🔍 **Individual Service Management**

```bash
# Start only database
docker-compose up postgres -d

# Start backend with database
docker-compose up postgres backend -d

# Start all except frontend
docker-compose up postgres backend -d

# Restart specific service
docker-compose restart backend

# Scale services (if needed)
docker-compose up --scale backend=2 -d
```

#### 📊 **Health Checks & Monitoring**

```bash
# Check service health
docker-compose ps

# Monitor resource usage
docker stats

# Follow logs in real-time
docker-compose logs -f --tail=100

# Check database connectivity
docker-compose exec postgres pg_isready -U tradesync
```

#### 🗄️ **Database Management**

```bash
# Access PostgreSQL directly
docker-compose exec postgres psql -U tradesync -d tradesync

# Run database migrations
docker-compose exec backend npm run prisma:migrate

# Generate Prisma client
docker-compose exec backend npm run prisma:generate

# Open Prisma Studio
docker-compose exec backend npm run prisma:studio

# Backup database
docker-compose exec postgres pg_dump -U tradesync tradesync > backup.sql

# Restore database
docker-compose exec -T postgres psql -U tradesync -d tradesync < backup.sql
```

#### 🚨 **Troubleshooting**

```bash
# View detailed logs for debugging
docker-compose logs --details

# Check container resource usage
docker-compose top

# Remove all containers and volumes (⚠️ destroys data)
docker-compose down -v

# Remove only containers (keeps data)
docker-compose down

# Force recreate containers
docker-compose up --force-recreate -d

# Check network connectivity
docker-compose exec backend ping postgres
docker-compose exec frontend ping backend
```

#### 📋 **Environment Variables**

The Docker setup includes pre-configured environment variables:

**Production (`docker-compose.yml`):**
- Frontend: Served via Nginx on port 80 (mapped to 3000)
- Backend: Production mode with optimizations
- Database: Persistent volume for data

**Development (`docker-compose.dev.yml`):**
- Frontend: Vite dev server on port 5173
- Backend: Development mode with hot reload
- Database: Same configuration with development-friendly settings

## 🔧 Configuration

### Backend Configuration
- `backend/src/main.ts` - Application bootstrap
- `backend/serverless.yml` - AWS Lambda configuration
- `backend/prisma/schema.prisma` - Database schema
- `backend/.env` - Environment variables

### Frontend Configuration
- `frontend/vite.config.ts` - Vite configuration
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

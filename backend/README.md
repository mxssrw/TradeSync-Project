# Simple User API - NestJS Backend

A clean, simple NestJS API for user management with Prisma ORM and PostgreSQL database.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start database (Docker)
docker-compose up -d postgres

# Run migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate

# Start development server
npm run start:dev
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── main.ts              # Application entry point
│   ├── app.module.ts        # Root module
│   ├── app.controller.ts    # Health check endpoints
│   ├── prisma/              # Prisma integration
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   └── users/               # User management
│       ├── users.module.ts
│       ├── users.controller.ts
│       ├── users.service.ts
│       └── dto/user.dto.ts
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
├── dist/                    # Compiled JavaScript
└── docker/                  # Docker configurations
```

## 🗄️ Database Management

### Prisma Commands

```bash
# Create and apply migration
npm run prisma:migrate
# or
npx prisma migrate dev --name migration_name

# Generate Prisma client (after schema changes)
npm run prisma:generate

# Reset database (⚠️ DESTRUCTIVE)
npx prisma migrate reset

# Deploy migrations to production
npm run prisma:deploy

# Open Prisma Studio (Database GUI)
npm run prisma:studio
```

### Migration Workflow

1. **Modify Schema**: Edit `prisma/schema.prisma`
2. **Create Migration**: `npx prisma migrate dev --name feature_name`
3. **Generate Client**: `npx prisma generate`
4. **Test Changes**: Restart your application

### Common Migration Scenarios

```bash
# Add new field to User model
npx prisma migrate dev --name add_user_phone

# Create new table
npx prisma migrate dev --name add_posts_table

# Modify existing field
npx prisma migrate dev --name update_user_email_length
```

## 🔌 API Endpoints

### Health Check
- `GET /` - API status
- `GET /health` - Health check

### Users CRUD
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### API Documentation
- `GET /api` - Swagger documentation (when running)

## 📝 Usage Examples

### Create User
```bash
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Get All Users
```bash
curl http://localhost:3001/users
```

### Update User
```bash
curl -X PATCH http://localhost:3001/users/USER_ID \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Johnny"
  }'
```

## 🐳 Docker Commands

### Local Development
```bash
# Start all services
docker-compose up -d

# Start only database
docker-compose up -d postgres

# View logs
docker-compose logs -f backend

# Rebuild backend
docker-compose build backend

# Stop all services
docker-compose down
```

### Docker Compose Services
- **postgres**: PostgreSQL database
- **backend**: NestJS API server
- **frontend**: React application (if included)

## ☁️ AWS Deployment Guide

### 1. AWS Aurora DSQL Setup

```bash
# Install AWS CLI
aws configure

# Create Aurora DSQL cluster
aws dsql create-cluster \
  --cluster-name simple-user-api \
  --engine aurora-dsql \
  --region us-east-1
```

### 2. Environment Configuration

Update your `.env` for AWS:
```env
# Local Development
DATABASE_URL="postgresql://tradesync:tradesync_password@localhost:5432/tradesync"

# AWS Aurora DSQL (Production)
DATABASE_URL="postgresql://username:password@your-cluster.cluster-xyz.us-east-1.rds.amazonaws.com:5432/dbname"

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

### 3. AWS Lambda Deployment

```bash
# Install Serverless Framework
npm install -g serverless

# Deploy to AWS Lambda
npm run sls:deploy

# Remove from AWS
npm run sls:remove

# Local testing
npm run sls:offline
```

### 4. Production Migration

```bash
# Deploy migrations to production database
npm run prisma:deploy

# Or manually
npx prisma migrate deploy
```

## 🔧 Development Scripts

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugging

# Building
npm run build              # Compile TypeScript
npm run start:prod         # Run production build

# Database
npm run prisma:migrate     # Run migrations
npm run prisma:generate    # Generate client
npm run prisma:studio      # Open database GUI

# Code Quality
npm run lint               # ESLint
npm run format             # Prettier
npm run test               # Jest tests

# AWS Lambda
npm run sls:deploy         # Deploy to AWS
npm run sls:offline        # Local serverless testing
```

## 🌍 Environment Variables

Create `.env` file in backend directory:

```env
# Database
DATABASE_URL="postgresql://tradesync:tradesync_password@localhost:5432/tradesync"

# Application
PORT=3001
NODE_ENV=development

# AWS (for production)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
```

## 🚨 Important Commands Reference

### Database Issues
```bash
# Database out of sync
npx prisma db push

# Reset everything (⚠️ DESTRUCTIVE)
npx prisma migrate reset

# Force regenerate client
rm -rf node_modules/.prisma && npx prisma generate
```

### Docker Issues
```bash
# Rebuild everything
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Clean Docker system
docker system prune -f
```

### Migration Issues
```bash
# Check migration status
npx prisma migrate status

# Mark migration as applied (manual fix)
npx prisma migrate resolve --applied "migration_name"

# Create migration without applying
npx prisma migrate dev --create-only --name feature_name
```

## 🔒 Production Checklist

### Before AWS Deployment:
- [ ] Update `DATABASE_URL` to Aurora DSQL endpoint
- [ ] Set production environment variables
- [ ] Run `npm run build` successfully
- [ ] Test all API endpoints locally
- [ ] Backup any existing data
- [ ] Run `npx prisma migrate deploy` on production DB

### Security Considerations:
- [ ] Use AWS IAM roles instead of access keys when possible
- [ ] Enable AWS Aurora encryption
- [ ] Set up proper VPC and security groups
- [ ] Use AWS Secrets Manager for sensitive data
- [ ] Enable API rate limiting
- [ ] Add proper CORS configuration

## 📊 Monitoring & Logging

### AWS CloudWatch Integration
```typescript
// Add to main.ts for Lambda
import { configure } from '@vendia/serverless-express';

// For monitoring
console.log('API Request:', {
  method: req.method,
  url: req.url,
  timestamp: new Date().toISOString()
});
```

### Health Check Endpoints
- `/` - Basic API status
- `/health` - Detailed health information including uptime

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Make changes and test locally
4. Run migrations: `npm run prisma:migrate`
5. Test API endpoints
6. Commit changes: `git commit -m "Add feature"`
7. Push to branch: `git push origin feature-name`
8. Create Pull Request

## 📞 Troubleshooting

### Common Issues:

**Database Connection Failed:**
```bash
# Check if PostgreSQL is running
docker-compose ps
# Restart database
docker-compose restart postgres
```

**Prisma Client Not Found:**
```bash
npm run prisma:generate
```

**Migration Conflicts:**
```bash
npx prisma migrate status
npx prisma migrate resolve --applied "conflicting_migration"
```

**Port Already in Use:**
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

---

## 📚 Additional Resources

- [NestJS Documentation](https://nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [AWS Aurora DSQL Guide](https://docs.aws.amazon.com/aurora-dsql/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Serverless Framework](https://www.serverless.com/framework/docs/)

---

**🎯 This API is production-ready for AWS Lambda and Aurora DSQL deployment!**

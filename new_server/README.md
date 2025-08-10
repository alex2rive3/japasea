# Japasea NestJS Server

This is the migrated NestJS version of the Japasea backend server, following Clean Architecture with Domain-Driven Design (DDD) principles.

## 🏗️ Architecture

The project follows the NestJS microservice template with Clean Architecture:

```
src/
├── infrastructure/           # Infrastructure layer
│   ├── database/            # Database configurations
│   └── logging/             # Logging services
├── modules/                 # Feature modules
│   ├── users/              # User management
│   │   ├── application/    # Use cases, DTOs, Mappers
│   │   ├── controllers/    # REST controllers
│   │   └── domain/         # Entities, Interfaces, Providers
│   ├── auth/               # Authentication & Authorization
│   ├── places/             # Places/Locations management
│   ├── reviews/            # Review management
│   ├── favorites/          # Favorites management
│   └── admin/              # Admin panel functionality
├── shared/                 # Shared utilities and types
├── app.module.ts           # Main application module
└── main.ts                 # Application bootstrap
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 6+
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Environment setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Database setup**
```bash
# Seed database with sample data
npm run db:seed

# Or migrate existing places data
npm run migrate:places
```

4. **Run the application**
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

### Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode (watch mode)
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 📋 API Documentation

Once the server is running, access the Swagger documentation at:
- **Swagger UI**: http://localhost:3001/api/docs

## 🔧 Module Structure

Each module follows this exact structure pattern:

### Domain Layer
- `entities/` - Mongoose entities with proper decorators
- `interfaces/` - Use case interfaces
- `providers/` - Dependency injection providers and tokens

### Application Layer  
- `dtos/request/` - Request DTOs with validation
- `dtos/response/` - Response DTOs for API responses
- `mappers/` - Entity to DTO mappers
- `use-cases/` - Business logic implementation

### Controllers Layer
- REST controllers with proper HTTP decorators
- Swagger documentation
- Validation pipes
- Dependency injection

## 🔐 Authentication & Authorization

The auth module provides:
- JWT-based authentication
- Refresh token mechanism
- Email verification
- Password reset functionality
- Role-based access control

## 📊 Database

### MongoDB Collections
- `users` - User accounts and profiles
- `places` - Places/locations data
- `reviews` - User reviews and ratings
- `audit_logs` - System audit trail

### Indexes
- Geospatial index on `places.location` for location-based queries
- Text indexes for search functionality
- Compound indexes for performance optimization

## 🛡️ Security Features

- Helmet.js for security headers
- Rate limiting with @nestjs/throttler
- Input validation with class-validator
- JWT token management
- CORS configuration
- Request sanitization

## 📝 Environment Variables

```env
# Server
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/japasea

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

## 🧪 Testing

The project includes:
- Unit tests for use cases
- Integration tests for controllers
- E2E tests for complete workflows
- Test coverage reports

Run tests:
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# With coverage
npm run test:cov
```

## 📦 Migration from Express

This NestJS version maintains API compatibility with the original Express server while providing:

- Better code organization with Clean Architecture
- Type safety with TypeScript
- Automatic validation with decorators
- Built-in Swagger documentation
- Dependency injection
- Module-based structure
- Better testability

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start:prod
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["node", "dist/main.js"]
```

## 📚 Additional Documentation

- [API Endpoints](./docs/API_ENDPOINTS.md)
- [Authentication Guide](./docs/AUTH_API.md)
- [Admin Guide](./docs/ADMIN_GUIDE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🤝 Contributing

1. Follow the NestJS module structure pattern
2. Use proper TypeScript types and interfaces
3. Include unit tests for new features
4. Update Swagger documentation
5. Follow the coding standards (ESLint + Prettier)

---

Made with ❤️ in Paraguay 🇵🇾

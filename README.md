# Omega Solutions API

A Node.js TypeScript authentication API built with Express, TypeORM, PostgreSQL, bcrypt, and JWT.

## Features

- **TypeScript** - Type-safe development
- **Express** - Fast, minimalist web framework
- **TypeORM** - Modern ORM for TypeScript and JavaScript
- **PostgreSQL** - Powerful, open source relational database
- **bcrypt** - Secure password hashing
- **JWT** - JSON Web Token authentication
- **Zod** - TypeScript-first schema validation
- **Jest** - Testing framework with TypeScript support
- **ESLint** - Code linting with Airbnb style guide
- **Docker** - Containerized application with Docker Compose

## Prerequisites

- Node.js 20+ (for local development)
- Docker and Docker Compose (for containerized deployment)

## Project Structure

```
omega-solutions-test/
├── src/
│   ├── config/
│   │   └── typeorm.ts           # TypeORM configuration
│   ├── controllers/
│   │   └── user.controller.ts   # User authentication controller
│   ├── database/
│   │   ├── entities/
│   │   │   └── user.entity.ts   # User entity
│   │   └── migrations/          # Database migrations
│   ├── services/
│   │   ├── create-user/
│   │   │   ├── create-user.service.ts       # User creation logic
│   │   │   ├── create-user.service.spec.ts  # Unit tests
│   │   │   └── index.ts
│   │   └── authenticate-user/
│   │       ├── authenticate-user.service.ts       # User authentication logic
│   │       ├── authenticate-user.service.spec.ts  # Unit tests
│   │       └── index.ts
│   ├── providers/
│   │   └── bcrypt.provider.ts            # Bcrypt encryption provider
│   ├── middlewares/
│   │   └── validation.middleware.ts      # Validation middleware
│   ├── validators/
│   │   ├── signup.validator.ts           # Signup validation schema
│   │   └── login.validator.ts            # Login validation schema
│   ├── routes/
│   │   ├── index.ts            # Main routes
│   │   └── user.routes.ts      # Authentication routes
│   ├── app.ts                  # Express app configuration
│   └── index.ts                # Application entry point
├── jest.config.js              # Jest configuration
├── Dockerfile                  # Docker configuration
├── docker-compose.yml          # Docker Compose configuration
├── tsconfig.json               # TypeScript configuration
├── .eslintrc.json              # ESLint configuration
└── package.json                # Dependencies and scripts
```

## Getting Started

### Using Docker Compose (Recommended)

1. **Create a `.env` file:**
   Copy the example environment variables:
   ```bash
   cp .env.example .env
   ```
   Or create a `.env` file with the following content:
   ```env
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   BCRYPT_SALT_ROUNDS=10
   DB_HOST=postgres
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=omega_db
   ```

2. **Start the application:**
   ```bash
   docker-compose up -d
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f api
   ```

4. **Stop the application:**
   ```bash
   docker-compose down
   ```

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   BCRYPT_SALT_ROUNDS=10
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=omega_db
   ```

3. **Start PostgreSQL (if not using Docker):**
   ```bash
   # Using Docker for PostgreSQL only
   docker run -d \
     --name postgres \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=omega_db \
     -p 5432:5432 \
     postgres:15-alpine
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Health Check
- **GET** `/health` - Check API status

### User Management
- **POST** `/users` - Create a new user account
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecureP@ss123"
  }
  ```
  Password requirements:
  - Minimum 8 characters
  - Maximum 20 characters
  - At least 1 number
  - At least 1 special character
  - At least 1 uppercase letter
  - At least 1 lowercase letter

  Response:
  ```json
  {
    "message": "User created successfully",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

- **POST** `/users/login` - Authenticate user and get JWT token
  ```json
  {
    "email": "john@example.com",
    "password": "SecureP@ss123"
  }
  ```
  Response:
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run typeorm` - Run TypeORM CLI commands
- `npm run migration:generate` - Generate migration from entity changes
- `npm run migration:create` - Create empty migration file
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert last migration

## Database Migrations

TypeORM migrations are stored in `src/database/migrations/`.

### Generate Migration from Entity Changes
```bash
NAME=CreateUsersTable npm run migration:generate
```
This will detect changes in your entities and create a migration file with the specified name.

### Create Empty Migration
```bash
NAME=AddIndexToUsers npm run migration:create
```
This creates an empty migration file for manual SQL with the specified name.

### Run Migrations
```bash
npm run migration:run
```

### Revert Last Migration
```bash
npm run migration:revert
```

**Note:** In development, `synchronize: true` is enabled, so schema changes are applied automatically. For production, always use migrations.

## Testing

This project uses Jest with jest-mock-extended for unit testing.

### Run Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory and include:
- Terminal output
- HTML report (`coverage/lcov-report/index.html`)
- LCOV format for CI/CD integration

### Test Structure
Tests are located in `__tests__` directories next to the files they test:
```
src/services/
├── create-user.service.ts
├── authenticate-user.service.ts
└── __tests__/
    ├── create-user.service.test.ts
    └── authenticate-user.service.test.ts
```

### Writing Tests
The project uses:
- **Jest** - Testing framework
- **jest-mock-extended** - Advanced mocking capabilities
- **ts-jest** - TypeScript support for Jest

Services use dependency injection for better testability. Example test structure:
```typescript
import { mockDeep, MockProxy } from 'jest-mock-extended';
import { Repository } from 'typeorm';

describe('ServiceName', () => {
  let service: ServiceName;
  let mockRepository: MockProxy<Repository<Entity>>;
  let mockProvider: MockProxy<IProvider>;

  beforeEach(() => {
    mockRepository = mockDeep<Repository<Entity>>();
    mockProvider = mockDeep<IProvider>();
    service = new ServiceName(mockRepository, mockProvider);
  });

  it('should do something', async () => {
    // Arrange
    mockRepository.findOne.mockResolvedValue(mockData);
    
    // Act
    const result = await service.execute();
    
    // Assert
    expect(result).toBeDefined();
  });
});
```

### Architecture Patterns

**Dependency Injection:**
Services receive their dependencies through constructors, making them easy to test and maintain:
```typescript
export class CreateUserService {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly bcryptProvider: BcryptProvider,
  ) {}

  async execute(params: CreateUserService.Params): Promise<CreateUserService.Result> {
    // Business logic here
  }
}

// Export a singleton instance with dependencies injected
export const createUserServiceInstance = new CreateUserService(
  TypeormDataSource.getRepository(User),
  bcryptProviderInstance,
);
```

**Providers:**
External dependencies are wrapped in provider interfaces for better abstraction and testability:
- `bcrypt.provider.ts` - Wraps bcrypt for password hashing and comparison

## Docker Commands

### Build and run
```bash
docker-compose up --build
```

### Run in detached mode
```bash
docker-compose up -d
```

### Stop containers
```bash
docker-compose down
```

### Remove volumes (database data)
```bash
docker-compose down -v
```

### View logs
```bash
docker-compose logs -f
```

### Access PostgreSQL
```bash
docker-compose exec postgres psql -U postgres -d omega_db
```

## Testing the API

### Using curl
```bash
# Health check
curl http://localhost:3000/health

# Sign up a new user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"SecureP@ss123"}'

# Login and get JWT token
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecureP@ss123"}'
```

## Technologies

- **Node.js** - JavaScript runtime
- **TypeScript** - Typed superset of JavaScript
- **Express** - Web framework
- **TypeORM** - ORM for TypeScript
- **PostgreSQL** - Relational database
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **Zod** - Schema validation
- **Jest** - Unit testing with jest-mock-extended
- **Docker** - Containerization
- **ESLint** - Code linting with Airbnb style guide
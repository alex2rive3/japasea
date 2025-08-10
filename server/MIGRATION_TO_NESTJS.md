# NestJS Microservice Template - Cursor Rules

## Project Architecture
This is a NestJS microservice template following Clean Architecture with Domain-Driven Design (DDD) principles.

## Module Structure Pattern
When creating new modules, follow this exact structure pattern based on the users module:

```
src/
├── application/
│   ├── dtos/
│   │   ├── request/
│   │   │   ├── create-{entity}.request.dto.ts
│   │   │   ├── update-{entity}.request.dto.ts
│   │   │   └── soft-delete-{entity}.request.dto.ts
│   │   └── response/
│   │       └── {entity}-response.dto.ts
│   ├── mappers/
│   │   └── {entity}.mapper.ts
│   └── use-cases/
│       ├── create-{entity}.use-case.ts
│       ├── find-all-{entities}.use-case.ts
│       ├── find-{entity}-by-id.use-case.ts
│       ├── update-{entity}.use-case.ts
│       ├── soft-delete-{entity}.use-case.ts
│       └── index.ts
├── controllers/
│   └── {entity}.controller.ts
├── domain/
│   ├── entities/
│   │   └── {entity}.entity.ts
│   ├── interfaces/
│   │   ├── create-{entity}.interface.ts
│   │   ├── find-all-{entities}.interface.ts
│   │   ├── find-{entity}-by-id.interface.ts
│   │   ├── update-{entity}.interface.ts
│   │   ├── soft-delete-{entity}.interface.ts
│   │   └── index.ts
│   ├── providers/
│   │   ├── {entity}.provider.ts
│   │   └── {entities}.tokens.ts
│   └── index.ts
└── {module-name}.module.ts
```

## Infrastructure Structure
Include these additional infrastructure components:

```
src/
├── infrastructure/
│   ├── logging/
│   │   ├── logger.config.ts       # Centralized logger configuration
│   │   ├── logger.service.ts      # Custom logger service
│   │   └── index.ts              # Barrel export
│   ├── database/
│   │   ├── mongo.config.ts       # MongoDB configuration
│   │   └── index.ts              # Barrel export
│   └── index.ts                  # Infrastructure barrel export
```

## Code Generation Rules

### 1. Entity Generation
- Use Mongoose decorators for MongoDB
- Include _id (ObjectId primary key)
- Include timestamps (createdAt, updatedAt)
- Use "camelCase" for entity properties
- Use "snake_case" for collection names

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ 
  collection: 'entity_names',
  timestamps: true 
})
export class EntityName extends Document {
  @Prop({ required: true, maxlength: 255 })
  name: string;

  @Prop({ required: true, maxlength: 255 })
  firstName: string;

  @Prop({ required: false })
  description?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const EntityNameSchema = SchemaFactory.createForClass(EntityName);
```

### 2. DTO Generation
- Use class-validator decorators
- Include Swagger decorators
- Separate request/response DTOs
- Add in the request/response class name to distinguish them, e.g. UpdateUserRequestDto
- Use "PascalCase" for the properties

**Request DTO:**
```typescript
export class CreateEntityRequestDto {
  @IsString()
  @MaxLength(255)
  @ApiProperty({ description: 'Entity firstName' })
  firstName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Entity description', required: false })
  description?: string;
}
```

**Response DTO:**
```typescript
export class EntityResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
```

### 3. Use Case Interface Generation
- Create interfaces in `domain/interfaces/`
- Use naming convention: `{action}-{entity}.interface.ts`
- Interface names start with 'I': `I{Action}{Entity}UseCase`

```typescript
// create-user.interface.ts
import { CreateUserRequestDto } from '../../application/dtos/request/create-user.request.dto';
import { UserResponseDto } from '../../application/dtos/response/user-response.dto';

export interface ICreateUserUseCase {
  execute(createUserDto: CreateUserRequestDto): Promise<UserResponseDto>;
}
```

### 4. Use Case Implementation Generation
- Create in `application/use-cases/`
- Implement the corresponding interface from domain
- Use @Injectable() decorator
- Include centralized logging
- Use Mongoose Model injection

```typescript
// create-user.use-case.ts
import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../domain/entities/user.entity';
import { CreateUserRequestDto } from '../dtos/request/create-user.request.dto';
import { UserResponseDto } from '../dtos/response/user-response.dto';
import { UserMapper } from '../mappers/user.mapper';
import { ICreateUserUseCase } from '../../domain';

@Injectable()
export class CreateUserUseCase implements ICreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) {}

  async execute(createUserDto: CreateUserRequestDto): Promise<UserResponseDto> {
    this.logger.log(`Creating user with email: ${createUserDto.email}`);
    
    try {
      const createdUser = new this.userModel(createUserDto);
      const savedUser = await createdUser.save();
      
      this.logger.log(`User created successfully with id: ${savedUser._id}`);
      return UserMapper.toResponseDto(savedUser);
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw error;
    }
  }
}
```

### 5. Controller Generation
- Use proper HTTP decorators
- Include Swagger documentation
- Follow REST conventions
- Include validation pipes
- Use MongoDB ObjectId validation
- Inject use cases using @Inject decorator with tokens
- Import interfaces and tokens from domain barrel export

```typescript
import { Controller, Get, Post, Put, Patch, Param, Body, Inject, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { CreateEntityRequestDto } from '../application/dtos/request/create-entity.request.dto';
import { UpdateEntityRequestDto } from '../application/dtos/request/update-entity.request.dto';
import { SoftDeleteEntityRequestDto } from '../application/dtos/request/soft-delete-entity.request.dto';
import { EntityResponseDto } from '../application/dtos/response/entity-response.dto';
import { ICreateEntityUseCase, IFindAllEntitiesUseCase, IFindEntityByIdUseCase, IUpdateEntityUseCase, ISoftDeleteEntityUseCase, EntitiesProvider } from '../domain';

@Controller('entities')
@ApiTags('entities')
export class EntityController {
  private readonly logger = new Logger(EntityController.name);

  constructor(
    @Inject(EntitiesProvider.createEntity)
    private readonly createEntityUseCase: ICreateEntityUseCase,
    @Inject(EntitiesProvider.findAllEntities)
    private readonly findAllEntitiesUseCase: IFindAllEntitiesUseCase,
    @Inject(EntitiesProvider.findEntityById)
    private readonly findEntityByIdUseCase: IFindEntityByIdUseCase,
    @Inject(EntitiesProvider.updateEntity)
    private readonly updateEntityUseCase: IUpdateEntityUseCase,
    @Inject(EntitiesProvider.softDeleteEntity)
    private readonly softDeleteEntityUseCase: ISoftDeleteEntityUseCase
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all entities' })
  @ApiResponse({ status: 200, type: [EntityResponseDto] })
  async findAll(): Promise<EntityResponseDto[]> {
    this.logger.log('Finding all entities');
    return this.findAllEntitiesUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get entity by id' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: 200, type: EntityResponseDto })
  async findById(@Param('id') @IsMongoId() id: string): Promise<EntityResponseDto> {
    this.logger.log(`Finding entity by id: ${id}`);
    return this.findEntityByIdUseCase.execute(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create entity' })
  @ApiResponse({ status: 201, type: EntityResponseDto })
  async create(@Body() createDto: CreateEntityRequestDto): Promise<EntityResponseDto> {
    this.logger.log('Creating new entity');
    return this.createEntityUseCase.execute(createDto);
  }
}
```

### 6. Module Generation
- Include MongooseModule for entity registration
- Export controllers and providers
- Follow dependency injection patterns
- Import providers from domain/providers

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntityName, EntityNameSchema } from './domain/entities/entity-name.entity';
import { EntityController } from './controllers/entity.controller';
import { ApiClient } from '../../infrastructure/api/api-client';
import { providers } from './domain/providers/entity.provider';

@Module({
  imports: [MongooseModule.forFeature([{ name: EntityName.name, schema: EntityNameSchema }])],
  controllers: [EntityController],
  providers: [
    ApiClient,
    ...providers
  ],
  exports: [...providers]
})
export class EntityModule {}
```

### 7. Provider Configuration
- Create providers array with dependency injection tokens
- Create tokens file for string-based injection
- Use Provider interface for proper dependency injection

**Tokens file (`{entities}.tokens.ts`):**
```typescript
export const EntitiesProvider = {
  createEntity: "CreateEntityUseCase",
  findAllEntities: "FindAllEntitiesUseCase",
  findEntityById: "FindEntityByIdUseCase",
  updateEntity: "UpdateEntityUseCase",
  softDeleteEntity: "SoftDeleteEntityUseCase"
};
```

**Provider file (`{entity}.provider.ts`):**
```typescript
import { CreateEntityUseCase } from '../../application/use-cases/create-entity.use-case';
import { FindAllEntitiesUseCase } from '../../application/use-cases/find-all-entities.use-case';
import { FindEntityByIdUseCase } from '../../application/use-cases/find-entity-by-id.use-case';
import { UpdateEntityUseCase } from '../../application/use-cases/update-entity.use-case';
import { SoftDeleteEntityUseCase } from '../../application/use-cases/soft-delete-entity.use-case';
import { Provider } from '@nestjs/common';
import { EntitiesProvider } from './entities.tokens';

export const providers: Provider[] = [
  {
    provide: EntitiesProvider.createEntity,
    useClass: CreateEntityUseCase
  },
  {
    provide: EntitiesProvider.findAllEntities,
    useClass: FindAllEntitiesUseCase
  },
  {
    provide: EntitiesProvider.findEntityById,
    useClass: FindEntityByIdUseCase
  },
  {
    provide: EntitiesProvider.updateEntity,
    useClass: UpdateEntityUseCase
  },
  {
    provide: EntitiesProvider.softDeleteEntity,
    useClass: SoftDeleteEntityUseCase
  }
];
```

### 8. Event Generation (for messaging)
- Create events in infrastructure/messaging/{module-name}/
- Follow event naming: {Entity}{Action}Event
- Include proper event data

```typescript
export class EntityCreatedEvent {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly createdAt: Date,
  ) {}
}
```

## Naming Conventions

### File Naming
- **Entities**: kebab-case (`user.entity.ts`, `user-profile.entity.ts`)
- **DTOs**: kebab-case (`create-user.request.dto.ts`, `user-response.dto.ts`)
- **Use Case Interfaces**: kebab-case (`create-user.interface.ts`, `find-all-users.interface.ts`)
- **Use Case Implementations**: kebab-case (`create-user.use-case.ts`, `find-all-users.use-case.ts`)

- **Controllers**: kebab-case (`user.controller.ts`, `user-profile.controller.ts`)
- **Providers**: kebab-case (`user.provider.ts`, `user-profile.provider.ts`)
- **Directories**: kebab-case (`user-profile/`, `use-cases/`, `interfaces/`)

### Class Naming
- **Entities**: PascalCase (`User`, `UserProfile`)
- **DTOs**: PascalCase (`CreateUserRequestDto`, `UserResponseDto`)
- **Use Case Interfaces**: PascalCase with 'I' prefix (`ICreateUserUseCase`, `IFindAllUsersUseCase`)
- **Use Case Classes**: PascalCase (`CreateUserUseCase`, `FindAllUsersUseCase`)

- **Controllers**: PascalCase (`UserController`, `UserProfileController`)

### Property Naming
- **Entity properties**: camelCase (`firstName`, `lastName`, `phoneNumber`)
- **Collection names**: snake_case (`user_profiles`, `travel_plans`, `place_reviews`)
- **Database fields**: camelCase (following MongoDB conventions)
- **DTO properties**: camelCase (`firstName`, `lastName`, `phoneNumber`)

### API Naming
- **Endpoints**: kebab-case (`/users`, `/user-profiles`)
- **URL parameters**: kebab-case (`/users/:id`, `/user-profiles/:user-id`)

### Method Naming
- **Use Case methods**: Always use `execute()` method
- **Mongoose Model methods**: Use standard MongoDB operations (`save()`, `find()`, `findById()`, `findByIdAndUpdate()`, `deleteOne()`)
- **Controller methods**: camelCase (`findAll`, `findById`, `create`, `update`)

### MongoDB Collection Naming Conventions
- **Collections**: Use snake_case and plural form
  - `users` (not `user` or `User`)
  - `user_profiles` (not `userProfiles` or `UserProfile`)
  - `travel_plans` (not `travelPlans`)
  - `place_reviews` (not `placeReviews`)
  - `chat_messages` (not `chatMessages`)
- **Indexes**: Use descriptive names with underscores
  - `idx_user_email` for email index
  - `idx_place_location_2dsphere` for geospatial index
  - `idx_created_at_desc` for timestamp index

### Import Conventions
- **From domain**: `from '../../domain'` (uses barrel exports)
- **From application**: Specific imports (`from '../dtos/request/create-user.request.dto'`)
- **External packages**: Import before internal modules

## Import Standards
- Use absolute imports with path mapping: `src/*`
- Group imports: external packages, then internal modules
- Use barrel exports where appropriate

## Centralized Logging
Implement consistent logging format across all modules:

### Logger Configuration
```typescript
// src/infrastructure/logging/logger.config.ts
import { LoggerService } from '@nestjs/common';

export interface LogContext {
  userId?: string;
  requestId?: string;
  module: string;
  operation: string;
  metadata?: Record<string, any>;
}

export class AppLogger implements LoggerService {
  log(message: string, context?: LogContext) {
    const logEntry = {
      level: 'info',
      timestamp: new Date().toISOString(),
      message,
      ...context
    };
    console.log(JSON.stringify(logEntry));
  }

  error(message: string, trace?: string, context?: LogContext) {
    const logEntry = {
      level: 'error',
      timestamp: new Date().toISOString(),
      message,
      trace,
      ...context
    };
    console.error(JSON.stringify(logEntry));
  }

  warn(message: string, context?: LogContext) {
    const logEntry = {
      level: 'warn',
      timestamp: new Date().toISOString(),
      message,
      ...context
    };
    console.warn(JSON.stringify(logEntry));
  }

  debug(message: string, context?: LogContext) {
    const logEntry = {
      level: 'debug',
      timestamp: new Date().toISOString(),
      message,
      ...context
    };
    console.debug(JSON.stringify(logEntry));
  }
}
```

### Usage in Use Cases
```typescript
private readonly logger = new Logger(UseCase.name);

// Info logging
this.logger.log(`Operation started`, {
  module: 'UserModule',
  operation: 'createUser',
  userId: request.userId
});

// Error logging
this.logger.error(`Operation failed: ${error.message}`, error.stack, {
  module: 'UserModule',
  operation: 'createUser',
  metadata: { requestData: createUserDto }
});
```

## Testing Standards
- Create test files in `tests/modules/{module-name}/`
- Follow naming: `{feature}.spec.ts`
- Use Jest testing framework
- Include unit tests for use cases

## Environment Configuration
- Use environment variables for configuration
- Support multiple environments (development, production)
- Include MongoDB connection configuration
- Configure database, cache, and messaging settings

```typescript
// Example MongoDB configuration
export const mongoConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/japasea',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  }
};
```

## Common Dependencies
- @nestjs/common, @nestjs/core
- @nestjs/mongoose, mongoose
- class-validator, class-transformer
- @nestjs/swagger
- @nestjs/cache-manager
- @nestjs/microservices

## Quality Standards
- **Use Case Implementation**: All use cases MUST implement their corresponding interface from domain
- **Interface Contracts**: Use case interfaces define clear contracts with `execute()` method
- **Error Handling**: Always include proper error handling with specific exceptions
- **HTTP Status Codes**: Use proper HTTP status codes (200, 201, 400, 404, 409, etc.)
- **Input Validation**: Add comprehensive validation with class-validator decorators
- **MongoDB Validation**: Use @IsMongoId() for ObjectId validation
- **Centralized Logging**: Use consistent logging format with proper context information
- **Single Responsibility**: Each use case handles one specific business operation
- **Dependency Injection**: Use Mongoose Model injection in use cases
- **Barrel Exports**: Always create index.ts files for clean imports
- **Type Safety**: Ensure all interfaces and implementations are strongly typed
- **MongoDB Indexes**: Create appropriate indexes for query performance
- **Collection Naming**: Follow snake_case naming for collections
- **Log Context**: Always include module, operation, and relevant metadata in logs

## Module Registration
Remember to register new modules in `src/app.module.ts`:
```typescript
@Module({
  imports: [
    // ... other imports
    EntityModule,
  ],
})
export class AppModule {}
```
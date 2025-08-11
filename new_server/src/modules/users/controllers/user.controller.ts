import { Controller, Get, Post, Put, Patch, Delete, Param, Body, Query, Inject, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { CreateUserRequestDto } from '../application/dtos/request/create-user.request.dto';
import { UpdateUserRequestDto } from '../application/dtos/request/update-user.request.dto';
import { SoftDeleteUserRequestDto } from '../application/dtos/request/soft-delete-user.request.dto';
import { UserResponseDto } from '../application/dtos/response/user-response.dto';
import { ICreateUserUseCase, IFindAllUsersUseCase, IFindUserByIdUseCase, IUpdateUserUseCase, ISoftDeleteUserUseCase, UsersProvider } from '../domain';
import { Roles, UserRole } from '../../../shared';

@Controller({ path: 'users', version: '1' })
@ApiTags('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    @Inject(UsersProvider.createUser)
    private readonly createUserUseCase: ICreateUserUseCase,
    @Inject(UsersProvider.findAllUsers)
    private readonly findAllUsersUseCase: IFindAllUsersUseCase,
    @Inject(UsersProvider.findUserById)
    private readonly findUserByIdUseCase: IFindUserByIdUseCase,
    @Inject(UsersProvider.updateUser)
    private readonly updateUserUseCase: IUpdateUserUseCase,
    @Inject(UsersProvider.softDeleteUser)
    private readonly softDeleteUserUseCase: ISoftDeleteUserUseCase
  ) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  async findAll(): Promise<UserResponseDto[]> {
    this.logger.log('Finding all users');
    return this.findAllUsersUseCase.execute();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    this.logger.log(`Finding user by id: ${id}`);
    return this.findUserByIdUseCase.execute(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  async create(@Body() createDto: CreateUserRequestDto): Promise<UserResponseDto> {
    this.logger.log('Creating new user');
    return this.createUserUseCase.execute(createDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserRequestDto
  ): Promise<UserResponseDto> {
    this.logger.log(`Updating user with id: ${id}`);
    return this.updateUserUseCase.execute(id, updateDto);
  }

  @Patch(':id/soft-delete')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Soft delete user' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async softDelete(@Param('id') id: string): Promise<UserResponseDto> {
    this.logger.log(`Soft deleting user with id: ${id}`);
    return this.softDeleteUserUseCase.execute({ id });
  }
}

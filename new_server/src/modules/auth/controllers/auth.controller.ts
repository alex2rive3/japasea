import { Controller, Post, Get, Put, Patch, Delete, Body, Inject, Logger, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoginRequestDto, RegisterRequestDto, RefreshTokenRequestDto, UpdateProfileRequestDto, ChangePasswordRequestDto } from '../application/dtos/request/auth.request.dto';
import { ForgotPasswordRequestDto } from '../application/dtos/request/forgot-password.request.dto';
import { ResetPasswordRequestDto } from '../application/dtos/request/reset-password.request.dto';
import { LoginResponseDto, RegisterResponseDto, RefreshTokenResponseDto, MessageResponseDto, ProfileResponseDto } from '../application/dtos/response/auth-response.dto';
import { ForgotPasswordResponseDto, ResetPasswordResponseDto } from '../application/dtos/response/password-recovery.response.dto';
import { ILoginUseCase, IRegisterUseCase, IRefreshTokenUseCase, ILogoutUseCase, AuthProvider } from '../domain';
import { ForgotPasswordUseCase, ResetPasswordUseCase } from '../domain/interfaces/password-recovery-use-cases.interface';
import { Public, CurrentUser } from '../../../shared';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    @Inject(AuthProvider.login)
    private readonly loginUseCase: ILoginUseCase,
    @Inject(AuthProvider.register)
    private readonly registerUseCase: IRegisterUseCase,
    @Inject(AuthProvider.refreshToken)
    private readonly refreshTokenUseCase: IRefreshTokenUseCase,
    @Inject(AuthProvider.logout)
    private readonly logoutUseCase: ILogoutUseCase,
    @Inject('ForgotPasswordUseCase')
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    @Inject('ResetPasswordUseCase')
    private readonly resetPasswordUseCase: ResetPasswordUseCase
  ) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, type: RegisterResponseDto })
  async register(@Body() registerDto: RegisterRequestDto): Promise<RegisterResponseDto> {
    this.logger.log('User registration request');
    return this.registerUseCase.execute(registerDto);
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  async login(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    this.logger.log('User login request');
    return this.loginUseCase.execute(loginDto);
  }

  @Post('refresh-token')
  @Public()
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, type: RefreshTokenResponseDto })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
    this.logger.log('Token refresh request');
    return this.refreshTokenUseCase.execute(refreshTokenDto);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  @ApiBearerAuth()
  async logout(@CurrentUser() user: any): Promise<MessageResponseDto> {
    this.logger.log(`Logout request for user: ${user.id}`);
    return this.logoutUseCase.execute(user.id);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  @ApiBearerAuth()
  async getProfile(@CurrentUser() user: any): Promise<ProfileResponseDto> {
    this.logger.log(`Profile request for user: ${user.id}`);
    // TODO: Implementar use case para obtener perfil
    return {
      success: true,
      message: 'Perfil obtenido exitosamente',
      data: {
        id: user.id,
        name: user.name || 'Usuario',
        email: user.email,
        phone: user.phone || null,
        role: user.role || 'user',
        isEmailVerified: user.isEmailVerified || false,
        createdAt: user.createdAt || new Date(),
      }
    };
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  @ApiBearerAuth()
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileRequestDto
  ): Promise<ProfileResponseDto> {
    this.logger.log(`Profile update request for user: ${user.id}`);
    // TODO: Implementar use case para actualizar perfil
    return {
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: {
        id: user.id,
        name: updateProfileDto.name || user.name || 'Usuario',
        email: user.email,
        phone: updateProfileDto.phone || user.phone || null,
        role: user.role || 'user',
        isEmailVerified: user.isEmailVerified || false,
        createdAt: user.createdAt || new Date(),
      }
    };
  }

  @Patch('change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  @ApiBearerAuth()
  async changePassword(
    @CurrentUser() user: any,
    @Body() changePasswordDto: ChangePasswordRequestDto
  ): Promise<MessageResponseDto> {
    this.logger.log(`Password change request for user: ${user.id}`);
    // TODO: Implementar use case para cambiar contraseña
    return {
      success: true,
      message: 'Contraseña cambiada exitosamente'
    };
  }

  @Post('forgot-password')
  @Public()
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, type: ForgotPasswordResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid email format' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordRequestDto): Promise<ForgotPasswordResponseDto> {
    this.logger.log(`Password reset request for email: ${forgotPasswordDto.email}`);
    return this.forgotPasswordUseCase.execute(forgotPasswordDto);
  }

  @Post('reset-password')
  @Public()
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, type: ResetPasswordResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid token or passwords do not match' })
  @ApiResponse({ status: 401, description: 'Token expired or invalid' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordRequestDto): Promise<ResetPasswordResponseDto> {
    this.logger.log(`Password reset attempt with token`);
    return this.resetPasswordUseCase.execute(resetPasswordDto);
  }

  // TODO: Implement email verification endpoints
  // @Post('verify-email')
  // @Public()
  // async verifyEmail(@Body() verifyEmailDto: VerifyEmailRequestDto) { ... }
}

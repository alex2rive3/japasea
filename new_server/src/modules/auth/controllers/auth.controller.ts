import { Controller, Post, Get, Put, Patch, Delete, Body, Inject, Logger, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoginRequestDto, RegisterRequestDto, RefreshTokenRequestDto } from '../application/dtos/request/auth.request.dto';
import { LoginResponseDto, RegisterResponseDto, RefreshTokenResponseDto, MessageResponseDto } from '../application/dtos/response/auth-response.dto';
import { ILoginUseCase, IRegisterUseCase, IRefreshTokenUseCase, ILogoutUseCase, AuthProvider } from '../domain';

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
    private readonly logoutUseCase: ILogoutUseCase
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, type: RegisterResponseDto })
  async register(@Body() registerDto: RegisterRequestDto): Promise<RegisterResponseDto> {
    this.logger.log('User registration request');
    return this.registerUseCase.execute(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  async login(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    this.logger.log('User login request');
    return this.loginUseCase.execute(loginDto);
  }

  @Post('refresh-token')
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
  async logout(@Request() req: any): Promise<MessageResponseDto> {
    const userId = req.user?.id; // Assuming JWT guard extracts user info
    this.logger.log(`Logout request for user: ${userId}`);
    return this.logoutUseCase.execute(userId);
  }

  // TODO: Implement remaining endpoints with guards
  // @Get('profile')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // async getProfile(@Request() req: any) { ... }

  // @Put('profile')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // async updateProfile(@Request() req: any, @Body() updateData: any) { ... }

  // @Patch('change-password')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // async changePassword(@Request() req: any, @Body() passwordData: any) { ... }

  // @Delete('account')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // async deleteAccount(@Request() req: any) { ... }

  // @Post('forgot-password')
  // async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordRequestDto) { ... }

  // @Post('reset-password')
  // async resetPassword(@Body() resetPasswordDto: ResetPasswordRequestDto) { ... }

  // @Post('verify-email')
  // async verifyEmail(@Body() verifyEmailDto: VerifyEmailRequestDto) { ... }
}

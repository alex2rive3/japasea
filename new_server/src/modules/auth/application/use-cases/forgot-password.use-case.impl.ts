import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { ForgotPasswordUseCase } from '../../domain/interfaces/password-recovery-use-cases.interface';
import { ForgotPasswordRequestDto } from '../dtos/request/forgot-password.request.dto';
import { ForgotPasswordResponseDto } from '../dtos/response/password-recovery.response.dto';
import { EmailService } from '../../../../shared/services/email.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../../../users/domain/entities/user.entity';

@Injectable()
export class ForgotPasswordUseCaseImpl implements ForgotPasswordUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: any,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(forgotPasswordDto: ForgotPasswordRequestDto): Promise<ForgotPasswordResponseDto> {
    const { email } = forgotPasswordDto;

    // Buscar el usuario por email
    const user = await this.userRepository.findByEmail(email);
    
    // Por seguridad, siempre devolvemos el mismo mensaje, exista o no el usuario
    const response: ForgotPasswordResponseDto = {
      success: true,
      message: 'Si el email existe en nuestro sistema, recibirás un enlace de recuperación en los próximos minutos.',
      maskedEmail: this.maskEmail(email)
    };

    // Solo continuar si el usuario existe
    if (!user) {
      return response;
    }

    // Verificar que el usuario esté activo
    if (!user.isActive) {
      return response; // No revelamos que la cuenta está inactiva
    }

    try {
      // Generar token de recuperación (válido por 1 hora)
      const resetToken = this.jwtService.sign(
        { 
          userId: user._id, 
          email: user.email,
          type: 'password-reset' 
        },
        { 
          expiresIn: '1h',
          secret: this.configService.get<string>('JWT_RESET_SECRET') || this.configService.get<string>('JWT_SECRET')
        }
      );

      // Crear enlace de recuperación
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
      const resetLink = `${frontendUrl}/auth/reset-password?token=${resetToken}`;

      // Enviar email de recuperación
      await this.emailService.sendPasswordResetEmail(user.email, {
        firstName: user.firstName,
        resetLink,
        expiresIn: '1 hora'
      });

      // Registrar el intento de recuperación (opcional)
      await this.userRepository.updateResetPasswordAttempt(user._id, new Date());

    } catch (error) {
      // Log del error pero no cambiar la respuesta por seguridad
      console.error('Error sending password reset email:', error);
    }

    return response;
  }

  private maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 3) {
      return `${localPart[0]}***@${domain}`;
    }
    return `${localPart.substring(0, 2)}***@${domain}`;
  }
}

import { Injectable, BadRequestException, UnauthorizedException, Inject } from '@nestjs/common';
import { ResetPasswordUseCase } from '../../domain/interfaces/password-recovery-use-cases.interface';
import { ResetPasswordRequestDto } from '../dtos/request/reset-password.request.dto';
import { ResetPasswordResponseDto } from '../dtos/response/password-recovery.response.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersProvider } from '../../../users/domain/providers/users.tokens';

@Injectable()
export class ResetPasswordUseCaseImpl implements ResetPasswordUseCase {
  constructor(
    @Inject(UsersProvider.userRepository) private readonly userRepository: any,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(resetPasswordDto: ResetPasswordRequestDto): Promise<ResetPasswordResponseDto> {
    const { token, newPassword, confirmPassword } = resetPasswordDto;

    // Verificar que las contraseñas coinciden
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    try {
      // Verificar y decodificar el token
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_RESET_SECRET') || this.configService.get<string>('JWT_SECRET')
      });

      // Verificar que es un token de reset
      if (payload.type !== 'password-reset') {
        throw new UnauthorizedException('Token inválido');
      }

      // Buscar el usuario
      const user = await this.userRepository.findById(payload.userId);
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      // Verificar que el usuario esté activo
      if (!user.isActive) {
        throw new UnauthorizedException('Cuenta inactiva');
      }

      // Verificar que el email coincide (seguridad adicional)
      if (user.email !== payload.email) {
        throw new UnauthorizedException('Token inválido');
      }

      // Hashear la nueva contraseña
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Actualizar la contraseña
      await this.userRepository.updatePassword(user._id, hashedPassword);

      // Invalidar tokens existentes (opcional, requiere lista negra)
      // await this.tokenBlacklistService.invalidateUserTokens(user._id);

      return {
        success: true,
        message: 'Contraseña cambiada exitosamente'
      };

    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token inválido o expirado');
      }
      throw error;
    }
  }
}

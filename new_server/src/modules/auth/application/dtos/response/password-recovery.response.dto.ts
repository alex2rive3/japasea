import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordResponseDto {
  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Si el email existe en nuestro sistema, recibirás un enlace de recuperación'
  })
  message: string;

  @ApiProperty({
    description: 'Email enmascarado para confirmar el envío',
    example: 'u***@ejemplo.com',
    required: false
  })
  maskedEmail?: string;
}

export class ResetPasswordResponseDto {
  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Contraseña cambiada exitosamente'
  })
  message: string;
}

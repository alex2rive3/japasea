import { ApiProperty } from '@nestjs/swagger';

export class UserAuthResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  isEmailVerified: boolean;

  @ApiProperty()
  createdAt: Date;
}

export class LoginResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({
    type: 'object',
    properties: {
      user: { type: 'object' },
      accessToken: { type: 'string' },
      refreshToken: { type: 'string' }
    }
  })
  data: {
    user: UserAuthResponseDto;
    accessToken: string;
    refreshToken: string;
  };
}

export class RegisterResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({
    type: 'object',
    properties: {
      user: { type: 'object' },
      accessToken: { type: 'string' },
      refreshToken: { type: 'string' }
    }
  })
  data: {
    user: UserAuthResponseDto;
    accessToken: string;
    refreshToken: string;
  };
}

export class RefreshTokenResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({
    type: 'object',
    properties: {
      accessToken: { type: 'string' },
      refreshToken: { type: 'string' }
    }
  })
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export class MessageResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;
}

export class ProfileResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: UserAuthResponseDto })
  data: UserAuthResponseDto;
}

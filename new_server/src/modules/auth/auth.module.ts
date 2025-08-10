import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from '../users/domain/entities/user.entity';
import { AuthController } from './controllers/auth.controller';
import { providers } from './domain/providers/auth.provider';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your_jwt_secret_key',
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '15m' 
        },
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [AuthController],
  providers: [...providers],
  exports: [...providers, JwtModule]
})
export class AuthModule {}

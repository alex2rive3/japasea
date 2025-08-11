import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from '../users/domain/entities/user.entity';
import { AuthController } from './controllers/auth.controller';
import { providers } from './domain/providers/auth.provider';
import { JwtStrategy } from '../../shared/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
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
  providers: [...providers, JwtStrategy],
  exports: [...providers, JwtModule, JwtStrategy]
})
export class AuthModule {}

import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from './services/email.service';
import { FileUploadService } from './services/file-upload.service';
import { FileUploadController } from './controllers/file-upload.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.register({})
  ],
  providers: [
    EmailService,
    FileUploadService,
    JwtStrategy
  ],
  controllers: [
    FileUploadController
  ],
  exports: [
    EmailService,
    FileUploadService,
    JwtStrategy
  ]
})
export class SharedModule {}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface PasswordResetEmailData {
  firstName: string;
  resetLink: string;
  expiresIn: string;
}

interface EmailVerificationData {
  firstName: string;
  verificationLink: string;
}

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  async sendPasswordResetEmail(
    email: string, 
    data: PasswordResetEmailData
  ): Promise<void> {
    // TODO: Implementar envío real de email (SendGrid, AWS SES, etc.)
    console.log(`Sending password reset email to: ${email}`);
    console.log(`Reset link: ${data.resetLink}`);
    console.log(`Expires in: ${data.expiresIn}`);
    
    // Simular éxito para desarrollo
    return Promise.resolve();
  }

  async sendEmailVerification(
    email: string,
    data: EmailVerificationData
  ): Promise<void> {
    // TODO: Implementar envío real de email
    console.log(`Sending verification email to: ${email}`);
    console.log(`Verification link: ${data.verificationLink}`);
    
    return Promise.resolve();
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    // TODO: Implementar envío real de email
    console.log(`Sending welcome email to: ${email} (${firstName})`);
    
    return Promise.resolve();
  }
}

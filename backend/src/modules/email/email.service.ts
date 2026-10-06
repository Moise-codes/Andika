import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter | null;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('SMTP_HOST');
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASSWORD');
    const port = Number(this.configService.get<string>('SMTP_PORT') ?? 587);

    this.from = this.configService.get<string>('SMTP_FROM') ?? 'noreply@andika.com';

    if (!host || !user || !pass) {
      this.logger.warn(
        'SMTP is not configured (SMTP_HOST / SMTP_USER / SMTP_PASSWORD). Transactional emails will be skipped.',
      );
      this.transporter = null;
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  private async send(to: string, subject: string, html: string) {
    if (!this.transporter) {
      this.logger.warn(`Skipped "${subject}" to ${to}: SMTP is not configured.`);
      return { success: false, error: 'SMTP not configured' };
    }

    try {
      await this.transporter.sendMail({ from: this.from, to, subject, html });
      return { success: true };
    } catch (error: any) {
      this.logger.error(`Failed to send "${subject}" to ${to}: ${error?.message}`);
      return { success: false, error: error?.message ?? 'Unknown error' };
    }
  }

  /** Sent once, when a new account's profile is created. */
  async sendWelcomeEmail(email: string, name: string) {
    const dashboardUrl =
      this.configService.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';

    return this.send(
      email,
      'Welcome to ANDIKA',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #415239;">Welcome to ANDIKA, ${name}!</h2>
          <p>Your account is ready. Start improving your typing speed and accuracy today.</p>
          <a href="${dashboardUrl}/dashboard"
             style="display: inline-block; padding: 12px 24px; background-color: #415239; color: #ffffff; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Go to your dashboard
          </a>
          <p style="color: #666; font-size: 12px;">You are receiving this because an ANDIKA account was created with this address.</p>
        </div>
      `,
    );
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${
      this.configService.get<string>('FRONTEND_URL') ?? 'http://localhost:3000'
    }/reset-password?token=${token}`;

    return this.send(
      email,
      'Reset your ANDIKA password',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #415239;">Reset your password</h2>
          <p>Click the button below to choose a new password. This link expires in 1 hour.</p>
          <a href="${resetUrl}"
             style="display: inline-block; padding: 12px 24px; background-color: #415239; color: #ffffff; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Reset password
          </a>
          <p style="color: #666; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    );
  }
}

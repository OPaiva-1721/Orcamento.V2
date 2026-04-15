import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NODEMAILER_TRANSPORT } from './nodemailer.provider';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

@Injectable()
export class NodemailerEmailService {
  constructor(
    @Inject(NODEMAILER_TRANSPORT) private readonly transporter: any,
    private readonly config: ConfigService,
  ) {}

  async send(options: SendEmailOptions): Promise<void> {
    await this.transporter.sendMail({
      from: this.config.get<string>('SMTP_FROM', 'noreply@empresa.com'),
      ...options,
    });
  }
}

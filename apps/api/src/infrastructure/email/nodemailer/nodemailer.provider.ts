import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export const NODEMAILER_TRANSPORT = 'NODEMAILER_TRANSPORT';

export const NodemailerProvider = {
  provide: NODEMAILER_TRANSPORT,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    return nodemailer.createTransport({
      host: config.get<string>('SMTP_HOST', 'smtp.gmail.com'),
      port: config.get<number>('SMTP_PORT', 587),
      secure: false,
      auth: {
        user: config.getOrThrow<string>('SMTP_USER'),
        pass: config.getOrThrow<string>('SMTP_PASS'),
      },
    });
  },
};

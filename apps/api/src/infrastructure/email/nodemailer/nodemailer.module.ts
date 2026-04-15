import { Global, Module } from '@nestjs/common';
import { NodemailerProvider } from './nodemailer.provider';
import { NodemailerEmailService } from './nodemailer-email.service';

@Global()
@Module({
  providers: [NodemailerProvider, NodemailerEmailService],
  exports: [NodemailerEmailService],
})
export class NodemailerModule {}

import { Global, Module } from '@nestjs/common';
import { DrizzleProvider } from './drizzle.provider';
import { DRIZZLE_CONNECTION } from './drizzle.constants';

@Global()
@Module({
  providers: [DrizzleProvider],
  exports: [DRIZZLE_CONNECTION],
})
export class DrizzleModule {}

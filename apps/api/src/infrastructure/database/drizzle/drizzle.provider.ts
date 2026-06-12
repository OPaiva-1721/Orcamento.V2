import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@orcamento/db';
import { DRIZZLE_CONNECTION } from './drizzle.constants';

export const DrizzleProvider = {
  provide: DRIZZLE_CONNECTION,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const pool = new Pool({
      connectionString: config.getOrThrow<string>('DATABASE_URL'),
    });
    return drizzle(pool, {
      schema,
      logger: process.env.NODE_ENV !== 'production',
    });
  },
};

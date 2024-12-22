import { env } from '@repo/env';
import { drizzle as drizzle_orm } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

const drizzle = drizzle_orm(pool, { schema });

export default drizzle;
/*
import { drizzle as drizzle_orm } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import postgres from 'postgres';

const client = postgres(process.env.DATABASE_URL!);
const drizzle = drizzle_orm(client, { schema });
export default drizzle;

*/

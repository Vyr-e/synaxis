import { neon } from '@neondatabase/serverless';
import { env } from '@repo/env';
import { drizzle as drizzle_orm } from 'drizzle-orm/neon-http';
import * as dbSchema from './schema';

const sql = neon(env.DATABASE_URL);

/**
 * @description Drizzle ORM client used to interact with the database
 * @type {import('drizzle-orm/neon-http').NeonClient}
 * @usage import { drizzle } from '@repo/database';
 */
const drizzle = drizzle_orm(sql, { schema: dbSchema });

export const schema = dbSchema;
export { drizzle };

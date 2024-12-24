import { env } from '@repo/env';
import { logger } from '@repo/logger';
import { Redis } from 'ioredis';

const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 2,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redis.on('connect', () => {
  logger.success('Redis connected');
});

redis.on('error', (error) => {
  logger.error('Redis Error:', error);
});
export { redis };

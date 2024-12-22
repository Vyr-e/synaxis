import kleur from 'kleur';
import pino from 'pino';

const transport = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    ignore: 'pid,hostname',
    singleLine: true,
    hideObject: true,
    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
  },
});

const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
  },
  transport
);

export { logger };

// Utility functions
export const success = (message: string, ...args: unknown[]) => {
  logger.info(kleur.green(`✓ ${message}`), ...args);
};

export const info = (message: string, ...args: unknown[]) => {
  logger.info(kleur.blue(`ℹ ${message}`), ...args);
};

export const warn = (message: string, ...args: unknown[]) => {
  logger.warn(kleur.yellow(`⚠ ${message}`), ...args);
};

export const error = (message: string, ...args: unknown[]) => {
  logger.error(kleur.red(`✖ ${message}`), ...args);
};

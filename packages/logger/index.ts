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

const pino_logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
  },
  transport
);

// Utility functions
export const success = <T>(message: T, ...args: unknown[]) => {
  logger.info(kleur.green(`✓ ${message}`), ...args);
};

export const info = <T>(message: T, ...args: unknown[]) => {
  logger.info(kleur.blue(`ℹ ${message}`), ...args);
};

export const warn = <T>(message: T, ...args: unknown[]) => {
  logger.warn(kleur.yellow(`⚠ ${message}`), ...args);
};

export const error = <T>(message: T, ...args: unknown[]) => {
  logger.error(kleur.red(`✖ ${message}`), ...args);
};

const logger = {
  success,
  info,
  warn,
  error,
};

export { logger, pino_logger };

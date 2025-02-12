import kleur from 'kleur';
import pino from 'pino';

/*
 * Edge logger with basic console
 * @param message - The message to log
 * @param args - The arguments to log
 */
const edgeLogger = {
  info: <T, K>(message: T, ...args: K[]) => {
    console.log(kleur.blue(`ℹ ${message}`), ...args);
  },
  success: <T, K>(message: T, ...args: K[]) => {
    console.log(kleur.green(`✓ ${message}`), ...args);
  },
  warn: <T, K>(message: T, ...args: K[]) => {
    console.warn(kleur.yellow(`⚠ ${message}`), ...args);
  },
  error: <T, K>(message: T, ...args: K[]) => {
    console.error(kleur.red(`✖ ${message}`), ...args);
  },
};

// Structured logger with pino
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

const structuredLogger = {
  info: <T, K>(message: T, ...args: K[]) => {
    pino_logger.info(kleur.blue(`ℹ ${message}`), ...args);
  },
  success: <T, K>(message: T, ...args: K[]) => {
    pino_logger.info(kleur.green(`✓ ${message}`), ...args);
  },
  warn: <T, K>(message: T, ...args: K[]) => {
    pino_logger.warn(kleur.yellow(`⚠ ${message}`), ...args);
  },
  error: <T, K>(message: T, ...args: K[]) => {
    pino_logger.error(kleur.red(`✖ ${message}`), ...args);
  },
};

// Export logger factory function
const logger = (runtime: 'edge' | 'nodejs') =>
  runtime === 'edge' ? edgeLogger : structuredLogger;

export { logger, pino_logger };

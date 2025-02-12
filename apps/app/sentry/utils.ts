import * as Sentry from '@sentry/nextjs';

export function captureException<T>(error: Error, context?: Record<string, T>) {
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.error(`Client Error: ${error.message}`, {
    error,
    ...context,
  });

  Sentry.captureException(error, {
    extra: context,
  });
}

export function captureMessage<T>(
  message: string,
  context?: Record<string, T>
) {
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.info(`Client Message: ${message}`, context);

  Sentry.captureMessage(message, {
    extra: context,
  });
}

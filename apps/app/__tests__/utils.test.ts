import { expect, test } from 'vitest';

test('environment is properly configured', () => {
  expect(process.env.NODE_ENV).toBeDefined();
});

test('can run basic assertions', () => {
  expect(true).toBe(true);
  expect(1 + 1).toBe(2);
});

test('async operations work', async () => {
  const result = await Promise.resolve('test');
  expect(result).toBe('test');
});

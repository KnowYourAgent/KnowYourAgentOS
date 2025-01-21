// tests/unit/logger.test.ts
import { describe, it, expect } from 'vitest';
import { logger } from '@/lib/logger';

describe('Logger', () => {
  it('should log info messages without crashing', () => {
    expect(() => logger.info('Test info log')).not.toThrow();
  });

  it('should log error messages without crashing', () => {
    expect(() => logger.error('Test error log')).not.toThrow();
  });

  it('should log debug messages without crashing', () => {
    expect(() => logger.debug('Test debug log')).not.toThrow();
  });
});
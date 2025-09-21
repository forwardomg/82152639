import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getRelativeTime, formatDate } from '../dateFormat';

describe('getRelativeTime', () => {
  beforeEach(() => {
    // Mock current date to have consistent test results
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should format time as "a few seconds ago" for recent times', () => {
    const date = new Date('2024-01-15T11:59:35Z');
    expect(getRelativeTime(date)).toBe('a few seconds ago');
  });

  it('should format time in minutes', () => {
    const date = new Date('2024-01-15T11:30:00Z');
    expect(getRelativeTime(date)).toBe('30 minutes ago');
  });

  it('should format singular minute', () => {
    const date = new Date('2024-01-15T11:59:00Z');
    expect(getRelativeTime(date)).toBe('a minute ago');
  });

  it('should format time in hours', () => {
    const date = new Date('2024-01-15T09:00:00Z');
    expect(getRelativeTime(date)).toBe('3 hours ago');
  });

  it('should handle string dates', () => {
    const date = '2024-12-25T09:00:00Z';
    expect(formatDate(date)).toMatch(/Dec 25, 2024/);
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { localStorage } from '../localStorage';
import { clearLocalStorage } from '../../test/mocks/localStorage';

describe('localStorage utils', () => {
  beforeEach(() => {
    clearLocalStorage();
    vi.clearAllMocks();
  });

  describe('getItem', () => {
    it('should get and parse JSON item from localStorage', () => {
      window.localStorage.setItem('test-key', JSON.stringify({ value: 'test' }));
      expect(localStorage.getItem('test-key')).toEqual({ value: 'test' });
    });

    it('should return null for non-existent key', () => {
      expect(localStorage.getItem('non-existent')).toBeNull();
    });

    it('should handle string values', () => {
      window.localStorage.setItem('string-key', JSON.stringify('simple string'));
      expect(localStorage.getItem('string-key')).toBe('simple string');
    });

    it('should handle invalid JSON gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      window.localStorage.setItem('bad-json', 'not-json{');
      expect(localStorage.getItem('bad-json')).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('setItem', () => {
    it('should stringify and set item in localStorage', () => {
      localStorage.setItem('new-key', { data: 'test-value' });
      expect(window.localStorage.getItem('new-key')).toBe('{"data":"test-value"}');
    });

    it('should overwrite existing values', () => {
      localStorage.setItem('key', 'value1');
      localStorage.setItem('key', 'value2');
      expect(JSON.parse(window.localStorage.getItem('key')!)).toBe('value2');
    });

    it('should handle array values', () => {
      localStorage.setItem('array-key', [1, 2, 3]);
      expect(JSON.parse(window.localStorage.getItem('array-key')!)).toEqual([1, 2, 3]);
    });

    it('should handle localStorage quota errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const setItemSpy = vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      localStorage.setItem('key', 'value');
      expect(consoleSpy).toHaveBeenCalled();

      setItemSpy.mockRestore();
      consoleSpy.mockRestore();
    });
  });

  describe('removeItem', () => {
    it('should remove item from localStorage', () => {
      window.localStorage.setItem('remove-key', 'value');
      localStorage.removeItem('remove-key');
      expect(window.localStorage.getItem('remove-key')).toBeNull();
    });

    it('should handle removing non-existent keys', () => {
      expect(() => localStorage.removeItem('non-existent')).not.toThrow();
    });
  });

  describe('clear', () => {
    it('should clear all items from localStorage', () => {
      window.localStorage.setItem('key1', 'value1');
      window.localStorage.setItem('key2', 'value2');
      localStorage.clear();
      expect(window.localStorage.length).toBe(0);
    });
  });
});

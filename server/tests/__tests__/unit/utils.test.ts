/**
 * Unit Tests for Utility Functions
 */

import { log, serveStatic } from '../../../utils';
import express from 'express';

describe('Utils', () => {
  describe('log', () => {
    it('should log a message with source', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      log('Test message', 'test-source');
      
      expect(consoleSpy).toHaveBeenCalledWith('[test-source]', 'Test message');
      consoleSpy.mockRestore();
    });

    it('should use default source if not provided', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      log('Test message');
      
      expect(consoleSpy).toHaveBeenCalledWith('[express]', 'Test message');
      consoleSpy.mockRestore();
    });
  });

  describe('serveStatic', () => {
    it('should configure static file serving', () => {
      const app = express();
      const useSpy = jest.spyOn(app, 'use');
      
      serveStatic(app);
      
      expect(useSpy).toHaveBeenCalled();
      useSpy.mockRestore();
    });
  });
});


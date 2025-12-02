/**
 * Unit Tests for Error Handler Helper Functions
 */

import {
  sendSuccess,
  sendError,
  ValidationError,
  NotFoundError,
} from '../../../../middleware/error-handler';
import { Response } from 'express';

describe('Error Handler Helpers', () => {
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      locals: {
        requestId: 'test-request-id',
        path: '/api/test',
      },
    };
  });

  describe('sendSuccess', () => {
    it('should send success response with data', () => {
      const data = { id: 1, name: 'Test' };

      sendSuccess(mockResponse as Response, data, 200);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data,
        meta: expect.objectContaining({
          timestamp: expect.any(String),
          requestId: 'test-request-id',
        }),
      });
    });

    it('should include default meta data', () => {
      const data = { id: 1 };

      sendSuccess(mockResponse as Response, data, 200);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          meta: expect.objectContaining({
            timestamp: expect.any(String),
            requestId: 'test-request-id',
          }),
        })
      );
    });
  });

  describe('sendError', () => {
    it('should send error response', () => {
      const error = new ValidationError('Validation failed');

      sendError(mockResponse as Response, error);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: expect.objectContaining({
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
        }),
        meta: expect.objectContaining({
          requestId: 'test-request-id',
        }),
      });
    });

    it('should hide internal errors in production', () => {
      process.env.NODE_ENV = 'production';
      const error = new Error('Internal error');
      (error as any).isOperational = false;

      sendError(mockResponse as Response, error);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: 'An internal error occurred',
          }),
        })
      );

      process.env.NODE_ENV = 'test';
    });
  });
});


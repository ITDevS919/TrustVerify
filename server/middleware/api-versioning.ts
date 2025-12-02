/**
 * API Versioning Middleware
 * Enforces API versioning and validates version compatibility
 */

import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import pino from 'pino';

const logger = pino({
  name: 'api-versioning',
  level: config.LOG_LEVEL || 'info'
});

export interface VersionedRequest extends Request {
  apiVersion?: string;
  apiVersionMajor?: number;
  apiVersionMinor?: number;
}

/**
 * Extract API version from request
 * Supports:
 * - Header: X-API-Version: v1
 * - URL path: /api/v1/endpoint
 * - Query param: ?version=v1
 */
export function extractApiVersion(req: VersionedRequest, res: Response, next: NextFunction): void | Response {
  // Try header first
  let version = req.headers['x-api-version'] as string;
  
  // Try URL path
  if (!version) {
    const pathMatch = req.path.match(/^\/api\/(v\d+)\//);
    if (pathMatch) {
      version = pathMatch[1];
    }
  }
  
  // Try query parameter
  if (!version && req.query.version) {
    version = req.query.version as string;
  }
  
  // Default to configured version
  if (!version) {
    version = config.API_VERSION || 'v1';
  }
  
  // Normalize version format
  version = version.toLowerCase().startsWith('v') ? version : `v${version}`;
  
  // Parse version numbers
  const versionMatch = version.match(/^v(\d+)\.?(\d+)?$/);
  if (versionMatch) {
    req.apiVersion = version;
    req.apiVersionMajor = parseInt(versionMatch[1], 10);
    req.apiVersionMinor = versionMatch[2] ? parseInt(versionMatch[2], 10) : 0;
  } else {
    req.apiVersion = config.API_VERSION || 'v1';
    req.apiVersionMajor = 1;
    req.apiVersionMinor = 0;
  }
  
  // Set version in response header
  res.setHeader('X-API-Version', req.apiVersion);
  
  next();
}

/**
 * Validate API version compatibility
 */
export function validateApiVersion(
  minVersion: string = 'v1',
  maxVersion?: string
) {
  return (req: VersionedRequest, res: Response, next: NextFunction): void | Response => {
    const requestedVersion = req.apiVersion || config.API_VERSION || 'v1';
    
    // Parse min/max versions
    const minMatch = minVersion.match(/^v(\d+)\.?(\d+)?$/);
    const maxMatch = maxVersion?.match(/^v(\d+)\.?(\d+)?$/);
    
    if (!minMatch) {
      logger.error({ minVersion }, 'Invalid minimum version format');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    const minMajor = parseInt(minMatch[1], 10);
    const minMinor = minMatch[2] ? parseInt(minMatch[2], 10) : 0;
    const maxMajor = maxMatch ? parseInt(maxMatch[1], 10) : undefined;
    const maxMinor = maxMatch && maxMatch[2] ? parseInt(maxMatch[2], 10) : undefined;
    
    // Check if version is too old
    if (req.apiVersionMajor! < minMajor || 
        (req.apiVersionMajor === minMajor && req.apiVersionMinor! < minMinor)) {
      return res.status(400).json({
        error: 'API version too old',
        message: `Minimum supported version is ${minVersion}`,
        requestedVersion,
        minimumVersion: minVersion,
      });
    }
    
    // Check if version is too new
    if (maxVersion && maxMajor !== undefined) {
      if (req.apiVersionMajor! > maxMajor ||
          (req.apiVersionMajor === maxMajor && req.apiVersionMinor! > (maxMinor || 0))) {
        return res.status(400).json({
          error: 'API version too new',
          message: `Maximum supported version is ${maxVersion}`,
          requestedVersion,
          maximumVersion: maxVersion,
        });
      }
    }
    
    next();
  };
}

/**
 * Route handler wrapper for versioned endpoints
 */
export function versionedRoute(
  handler: (req: VersionedRequest, res: Response, next: NextFunction) => void | Promise<void>,
  options: {
    minVersion?: string;
    maxVersion?: string;
  } = {}
) {
  return [
    extractApiVersion,
    validateApiVersion(options.minVersion, options.maxVersion),
    handler,
  ];
}


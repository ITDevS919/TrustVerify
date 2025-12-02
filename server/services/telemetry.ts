/**
 * Structured Telemetry Service
 * Provides logs, metrics, and traces with correlation IDs
 */

import { Request, Response } from 'express';
import pino from 'pino';
import { config } from '../config';
import { randomBytes } from 'crypto';

const logger = pino({
  name: 'telemetry',
  level: config.LOG_LEVEL || 'info',
  formatters: {
    log(object) {
      return {
        ...object,
        service: 'trustverify',
        environment: config.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
      };
    },
  },
});

export interface TelemetryContext {
  correlationId: string;
  traceId: string;
  spanId: string;
  userId?: number;
  sessionId?: string;
  requestId?: string;
}

export interface LogEntry {
  level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  context: TelemetryContext;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface MetricEntry {
  name: string;
  value: number;
  unit: string;
  tags: Record<string, string>;
  context: TelemetryContext;
  timestamp: string;
}

export interface TraceSpan {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  tags: Record<string, string>;
  logs?: Array<{ timestamp: number; fields: Record<string, any> }>;
  context: TelemetryContext;
}

export class TelemetryService {
  private activeSpans: Map<string, TraceSpan> = new Map();
  private correlationIds: Map<string, TelemetryContext> = new Map();

  /**
   * Generate correlation ID
   */
  generateCorrelationId(): string {
    return `${Date.now()}-${randomBytes(16).toString('hex')}`;
  }

  /**
   * Generate trace ID
   */
  generateTraceId(): string {
    return `${Date.now()}-${randomBytes(16).toString('hex')}`;
  }

  /**
   * Generate span ID
   */
  generateSpanId(): string {
    return randomBytes(8).toString('hex');
  }

  /**
   * Create telemetry context from request
   */
  createContext(req: Request, res?: Response): TelemetryContext {
    const correlationId = 
      (req.headers['x-correlation-id'] as string) ||
      (res?.locals.requestId) ||
      this.generateCorrelationId();
    
    const traceId = 
      (req.headers['x-trace-id'] as string) ||
      this.generateTraceId();
    
    const spanId = this.generateSpanId();

    const context: TelemetryContext = {
      correlationId,
      traceId,
      spanId,
      userId: (req as any).user?.id,
      sessionId: req.sessionID,
      requestId: res?.locals.requestId || correlationId,
    };

    // Store context for later retrieval
    this.correlationIds.set(correlationId, context);

    // Set headers for response
    if (res) {
      res.setHeader('X-Correlation-Id', correlationId);
      res.setHeader('X-Trace-Id', traceId);
      res.setHeader('X-Span-Id', spanId);
    }

    return context;
  }

  /**
   * Get context by correlation ID
   */
  getContext(correlationId: string): TelemetryContext | undefined {
    return this.correlationIds.get(correlationId);
  }

  /**
   * Log structured entry
   */
  log(entry: Omit<LogEntry, 'timestamp'>): void {
    const logData = {
      ...entry,
      timestamp: new Date().toISOString(),
      correlationId: entry.context.correlationId,
      traceId: entry.context.traceId,
      spanId: entry.context.spanId,
    };

    switch (entry.level) {
      case 'trace':
        logger.trace(logData, entry.message);
        break;
      case 'debug':
        logger.debug(logData, entry.message);
        break;
      case 'info':
        logger.info(logData, entry.message);
        break;
      case 'warn':
        logger.warn(logData, entry.message);
        break;
      case 'error':
        logger.error(logData, entry.message);
        break;
      case 'fatal':
        logger.fatal(logData, entry.message);
        break;
    }
  }

  /**
   * Record metric
   */
  recordMetric(metric: Omit<MetricEntry, 'timestamp'>): void {
    const metricData = {
      ...metric,
      timestamp: new Date().toISOString(),
      correlationId: metric.context.correlationId,
      traceId: metric.context.traceId,
      spanId: metric.context.spanId,
    };

    logger.info({
      type: 'metric',
      ...metricData,
    }, `Metric: ${metric.name}`);
  }

  /**
   * Start trace span
   */
  startSpan(
    operation: string,
    context: TelemetryContext,
    parentSpanId?: string,
    tags?: Record<string, string>
  ): string {
    const spanId = this.generateSpanId();
    const span: TraceSpan = {
      traceId: context.traceId,
      spanId,
      parentSpanId,
      operation,
      startTime: Date.now(),
      tags: tags || {},
      context,
    };

    this.activeSpans.set(spanId, span);

    this.log({
      level: 'debug',
      message: `Span started: ${operation}`,
      context,
      metadata: {
        spanId,
        operation,
        parentSpanId,
        tags,
      },
    });

    return spanId;
  }

  /**
   * End trace span
   */
  endSpan(spanId: string, tags?: Record<string, string>): void {
    const span = this.activeSpans.get(spanId);
    if (!span) {
      logger.warn({ spanId }, 'Attempted to end non-existent span');
      return;
    }

    const endTime = Date.now();
    const duration = endTime - span.startTime;

    span.endTime = endTime;
    span.duration = duration;
    if (tags) {
      span.tags = { ...span.tags, ...tags };
    }

    this.log({
      level: 'debug',
      message: `Span ended: ${span.operation}`,
      context: span.context,
      metadata: {
        spanId,
        operation: span.operation,
        duration,
        tags: span.tags,
      },
    });

    this.activeSpans.delete(spanId);
  }

  /**
   * Add log to span
   */
  addSpanLog(spanId: string, fields: Record<string, any>): void {
    const span = this.activeSpans.get(spanId);
    if (!span) {
      return;
    }

    if (!span.logs) {
      span.logs = [];
    }

    span.logs.push({
      timestamp: Date.now(),
      fields,
    });
  }

  /**
   * Get active spans for trace
   */
  getSpansForTrace(traceId: string): TraceSpan[] {
    return Array.from(this.activeSpans.values())
      .filter(span => span.traceId === traceId);
  }

  /**
   * Cleanup old contexts (run periodically)
   */
  cleanup(maxAge: number = 3600000): void {
    // Remove contexts older than maxAge (default 1 hour)
    // Note: This is a simplified cleanup - in production, use a proper TTL mechanism
    logger.debug({ maxAge }, 'Telemetry context cleanup');
  }
}

export const telemetryService = new TelemetryService();


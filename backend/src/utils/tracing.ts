import { Request, Response, NextFunction } from 'express'
import logger from './logger'
const crypto = require("crypto");

/**
 * Interface for trace context
 */
export interface TraceContext {
  traceId: string
  spanId: string
  startTime: number
  method: string
  url: string
  userAgent?: string | undefined
  ip?: string | undefined
}

/**
 * Generate a random trace ID
 * 
 * @returns string - A unique trace identifier
 */
function generateTraceId(): string {
  return crypto.randomUUID()
}

/**
 * Generate a random span ID
 * 
 * @returns string - A unique span identifier
 */
function generateSpanId(): string {
    return crypto.randomUUID()
}

/**
 * Create a new trace context for a request
 * 
 * @param req - Express request object
 * @returns TraceContext - The trace context
 */
export function createTraceContext(req: Request): TraceContext {
  return {
    traceId: generateTraceId(),
    spanId: generateSpanId(),
    startTime: Date.now(),
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress
  }
}

/**
 * Log trace information
 * 
 * @param context - The trace context
 * @param message - The message to log
 * @param level - The log level (default: 'info')
 */
export function logTrace(context: TraceContext, message: string, level: 'info' | 'debug' | 'warn' | 'error' = 'info'): void {
  const duration = Date.now() - context.startTime
  
  logger[level](`[${context.traceId}:${context.spanId}] ${message} - Duration: ${duration}ms`, {
    traceId: context.traceId,
    spanId: context.spanId,
    method: context.method,
    url: context.url,
    duration,
    userAgent: context.userAgent,
    ip: context.ip
  })
}

/**
 * Express middleware for request tracing
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export function tracingMiddleware(req: Request, res: Response, next: NextFunction): void {
  const traceContext = createTraceContext(req);
  
  // Add trace context to request object
  (req as any).traceContext = traceContext
  
  // Log request start
  logTrace(traceContext, `Request started: ${req.method} ${req.url}`, 'debug')
  
  // Override res.end to log response
  const originalEnd = res.end
  res.end = function(chunk?: any, encoding?: any): Response {
    
    logTrace(traceContext, `Request completed: ${req.method} ${req.url} - Status: ${res.statusCode}`, 'info')
    
    return originalEnd.call(this, chunk, encoding)
  }
  
  next()
}

/**
 * Get trace context from request
 * 
 * @param req - Express request object
 * @returns TraceContext | undefined - The trace context if available
 */
export function getTraceContext(req: Request): TraceContext | undefined {
  return (req as any).traceContext
}

/**
 * Create a child span for nested operations
 * 
 * @param parentContext - The parent trace context
 * @param operationName - The name of the operation
 * @returns TraceContext - The child trace context
 */
export function createChildSpan(parentContext: TraceContext, operationName: string): TraceContext {
  return {
    ...parentContext,
    spanId: generateSpanId(),
    startTime: Date.now()
  }
} 
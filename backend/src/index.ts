import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'

import logger from './utils/logger'
import { httpLogger } from './utils/logger'
import { requestCounter, requestDuration, errorCounter, activeRequests, getMetrics } from './utils/metrics'
import { tracingMiddleware, getTraceContext } from './utils/tracing'
import { convertIntegerToRoman } from './utils/romanConverter'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080


// Request parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../../frontend/build')))

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message: string) => {
      httpLogger.http(message.trim())
    }
  }
}))

// Tracing middleware
app.use(tracingMiddleware)

// Metrics middleware
app.use((req, res, next) => {
  activeRequests.inc()
  
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    
    requestCounter.inc({
      method: req.method,
      endpoint: req.path,
      status: res.statusCode.toString()
    });
    
    requestDuration.observe({
      method: req.method,
      endpoint: req.path
    }, duration)
    
    activeRequests.dec()
    
    if (res.statusCode >= 400) {
      errorCounter.inc({
        error_type: res.statusCode >= 500 ? 'server_error' : 'client_error',
        endpoint: req.path
      })
    }
  })
  
  next()
})

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  const traceContext = getTraceContext(req)
  logger.info('Health check requested', { traceId: traceContext?.traceId })
  
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

/**
 * Metrics endpoint for Prometheus
 */
app.get('/metrics', async (req, res) => {
  try {
    const metrics = await getMetrics()
    res.set('Content-Type', 'text/plain')
    res.send(metrics)
  } catch (error) {
    logger.error('Error getting metrics', { error })
    res.status(500).send('Error getting metrics')
  }
})

/**
 * Roman numeral conversion endpoint
 * GET /romannumeral?query={integer}
 */
app.get('/romannumeral', (req, res) => {
  const traceContext = getTraceContext(req)
  const query = req.query.query as string
  
  logger.info('Roman numeral conversion requested', {
    traceId: traceContext?.traceId,
    query,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  })
  
  try {
    // Validate input
    if (!query) {
      logger.warn('Missing query parameter', { traceId: traceContext?.traceId });
      return res.status(400).send('Missing query parameter')
    }
    
    // Convert to Roman numeral
    const result = convertIntegerToRoman(query);
    
    // Record successful conversion
    const { conversionSuccessCounter, inputValueHistogram } = require('./utils/metrics')
    conversionSuccessCounter.inc()
    inputValueHistogram.observe(parseInt(query, 10))
    
    logger.info('Roman numeral conversion successful', {
      traceId: traceContext?.traceId,
      input: result.input,
      output: result.output
    })
    
    return res.status(200).json(result)
    
  } catch (error) {
    const { conversionFailureCounter } = require('./utils/metrics')
    if (error && typeof error === 'object' && 'error' in error && 'message' in error) {
      const ve = error as { error: string; message: string }
      conversionFailureCounter.inc({ error_type: ve.error })
      logger.error('Roman numeral conversion failed', {
        traceId: traceContext?.traceId,
        error: ve.message,
        query
      })
      return res.status(400).send(ve.message)
    } else if (error instanceof Error) {
      conversionFailureCounter.inc({ error_type: 'UNKNOWN_ERROR' })
      logger.error('Roman numeral conversion failed', {
        traceId: traceContext?.traceId,
        error: error.message,
        query
      })
      return res.status(500).send('Internal server error')
    } else {
      conversionFailureCounter.inc({ error_type: 'UNKNOWN_ERROR' })
      logger.error('Roman numeral conversion failed', {
        traceId: traceContext?.traceId,
        error: 'Unknown error',
        query
      })
      return res.status(500).send('Internal server error')
    }
  }
})

/**
 * Root endpoint with API information
 */
app.get('/api', (req, res) => {
  res.json({
    name: 'Roman Numeral Converter API',
    version: '1.0.0',
    description: 'Convert integers between 1-3999 to Roman numerals',
    endpoints: {
      '/romannumeral?query={integer}': 'Convert integer to Roman numeral',
      '/health': 'Health check',
      '/metrics': 'Prometheus metrics'
    },
    example: '/romannumeral?query=42'
  })
})

/**
 * Catch-all handler for client-side routing
 * This should be the last route before the 404 handler
 */
app.get('*', (req, res, next) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/') || req.path.startsWith('/health') || req.path.startsWith('/metrics')) {
    return next()
  }
  
  res.sendFile(path.join(__dirname, '../../frontend/build/index.html'))
})

/**
 * 404 handler
 */
app.use('*', (req, res) => {
  logger.warn('Route not found', {
    method: req.method,
    url: req.originalUrl,
    traceId: getTraceContext(req)?.traceId
  })
  
  res.status(404).send('Route not found')
})

/**
 * Global error handler
 */
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const traceContext = getTraceContext(req)
  
  logger.error('Unhandled error', {
    traceId: traceContext?.traceId,
    error: error.message,
    stack: error.stack,
    method: req.method,
    url: req.url
  })
  
  res.status(500).send('Internal server error')
})

/**
 * Graceful shutdown handler
 */
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully')
  process.exit(0)
})

/**
 * Start the server
 */
app.listen(PORT, () => {
  logger.info(`Roman Numeral Converter API server started on port ${PORT}`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version
  })
})

export default app
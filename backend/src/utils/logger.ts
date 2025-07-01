import winston from 'winston'

/**
 * Log levels configuration
 */
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
}

/**
 * Log colors for console output
 */
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
}

// Add colors to Winston
winston.addColors(logColors);

/**
 * Custom log format for structured logging
 */
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  )
)

/**
 * Logger instance with configuration
 */
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  levels: logLevels,
  format: logFormat,
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // File transport for errors
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    // File transport for all logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
})

/**
 * HTTP request logger middleware
 */
export const httpLogger = winston.createLogger({
  level: 'http',
  levels: logLevels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/http.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
})

export default logger
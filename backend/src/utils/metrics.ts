import { register, Counter, Histogram, Gauge } from 'prom-client'

/**
 * Request counter - tracks total number of requests
 */
export const requestCounter = new Counter({
  name: 'roman_numeral_requests_total',
  help: 'Total number of Roman numeral conversion requests',
  labelNames: ['method', 'endpoint', 'status']
});

/**
 * Request duration histogram - tracks response times
 */
export const requestDuration = new Histogram({
  name: 'roman_numeral_request_duration_seconds',
  help: 'Duration of Roman numeral conversion requests in seconds',
  labelNames: ['method', 'endpoint'],
  buckets: [0.1, 0.5, 1, 2, 5]
})

/**
 * Error counter - tracks total number of errors
 */
export const errorCounter = new Counter({
  name: 'roman_numeral_errors_total',
  help: 'Total number of errors in Roman numeral conversion',
  labelNames: ['error_type', 'endpoint']
})

/**
 * Active requests gauge - tracks current number of active requests
 */
export const activeRequests = new Gauge({
  name: 'roman_numeral_active_requests',
  help: 'Number of currently active requests'
})

/**
 * Conversion success counter - tracks successful conversions
 */
export const conversionSuccessCounter = new Counter({
  name: 'roman_numeral_conversions_success_total',
  help: 'Total number of successful Roman numeral conversions'
})

/**
 * Conversion failure counter - tracks failed conversions
 */
export const conversionFailureCounter = new Counter({
  name: 'roman_numeral_conversions_failure_total',
  help: 'Total number of failed Roman numeral conversions',
  labelNames: ['error_type']
})

/**
 * Input value histogram - tracks distribution of input values
 */
export const inputValueHistogram = new Histogram({
  name: 'roman_numeral_input_values',
  help: 'Distribution of input values for Roman numeral conversion',
  buckets: [1, 10, 50, 100, 500, 1000, 2000, 3999]
})

/**
 * Get metrics in Prometheus format
 * 
 * @returns Promise<string> - Metrics in Prometheus text format
 */
export async function getMetrics(): Promise<string> {
  return await register.metrics()
}

/**
 * Reset all metrics (useful for testing)
 */
export function resetMetrics(): void {
  register.clear()
}

export { register }
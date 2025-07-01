# Roman Numeral Converter

A full-stack web application that converts integers between 1-3999 to their Roman numeral representation. Built with TypeScript, Express.js backend, React frontend with Adobe React Spectrum, and observability features.

Roman numeral specification:
https://en.wikipedia.org/wiki/Roman_numerals

## Features

- **Backend API**: RESTful service with Express.js and TypeScript
- **Frontend UI**: React application with Adobe React Spectrum components
- **Roman Numeral Conversion**: Custom implementation (no external libraries)
- **Observability**: Logs, metrics, and tracing
- **Docker Support**: Containerized deployment
- **Testing**: Frontend and Backend unit tests
- **Error Handling**: Input validation and error messages
- **Theme Support**: Light and dark mode based on system preferences

## Architecture

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   React Frontend │    │  Express Backend │    │   Monitoring     │
│                  │    │                  │    │                  │
│ - Adobe React    │◄──►│ - TypeScript     │◄──►│ - Prometheus     │
│   Spectrum       │    │ - Roman Numeral  │    │ - Grafana        │
│ - Light/Dark     │    │   Conversion     │    │ - Logs           │
│   Theme          │    │ - Observability  │    │ - Metrics        │
│ - Error Handling │    │                  │    │ - Tracing        │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Observability**: Winston (logs), Prometheus (metrics), custom tracing (via logs)
- **Testing**: Jest

```diff
@@These a were chosen to meet the criteria of the project but without access to paid services@@
@@Winston and Prometheus were chosen as alternatives to Scalyr/Dataset, Datadog, and Sentry which I am more familiar with because they were freely available.@@
```

### Frontend
- **Framework**: React
- **Language**: TypeScript
- **UI Library**: Adobe React Spectrum
- **HTTP Client**: Axios
- **Testing**: React Testing Library

```diff
@@These were also chosen to meet the criteria of the project@@
```

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Monitoring**: Prometheus & Grafana

```diff
@@Prometheus and Grafana were chosen as alternatives to other solutions I'm more familiar with because they were freely available.@@
```

## Quick Start

### Prerequisites
- Docker and Docker Compose

### Using Docker (build.sh can also be used and contains helpful commands for building and cleanup)

1. **Clone the repository**
   ```bash
   git clone https://github.com/b-bromiley/int-to-roman.git
   cd int-to-roman
   ```

2. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:8080
   - Prometheus: http://localhost:9090
   - Grafana: http://localhost:3001 (admin/admin)
      - Preconfigured dashboard "Roman Numeral Converter Dashboard" available

## Roman Numeral Conversion Logic

### Algorithm
Starting with the input value (between 1 - 3999), find and subtract the largest roman numeral value that is LESS THAN your current value. Append the roman numeral symbol for the removed number to the return value.
Repeat until your current value is '0' and return the concatinated string value.

This implementation uses the "subtractive notation" for 4, 9, 40, 90, and 900 as mentioned on wikipedia

## Observability

### Logs
- **Framework**: Winston
- **Levels**: error, warn, info, http, debug
- **Output**: Console and files (`logs/error.log`, `logs/combined.log`, `logs/http.log`)
- **Format**: Structured JSON with timestamps

```diff
@@In a true production application, I would likely use Scalyr/Dataset (or equivalent, maybe a DB) to offload logs from local servers.@@
```

### Metrics (Prometheus)
- **Request Count**: `roman_numeral_requests_total`
- **Response Time**: `roman_numeral_request_duration_seconds`
- **Error Count**: `roman_numeral_errors_total`
- **Active Requests**: `roman_numeral_active_requests`
- **Conversion Success**: `roman_numeral_conversions_success_total`
- **Input Distribution**: `roman_numeral_input_values`

```diff
@@In a true production application, I would likely use Datadog to move off local servers.@@
@@OpenTelemetry could be cool, too.@@
```

### Tracing (via logs)
- **Custom Implementation**: Request tracing with unique IDs
- **Information**: Method, URL, duration, user agent, IP
- **Integration**: Log correlation with trace IDs

```diff
@@In a true production application, I would use a solution like Datadog and Sentry for more robust tracing instead of relying on inspecting log files.@@
@@Tempo with Grafana seems like it could provide good results as well, but requires object storage that I didn't implement in this project@@
@@Also, Pendo or (more likely in this case) Adobe Analytics could be used to track user interactions.@@
```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

**Test Coverage:**
- Roman numeral conversion logic
- Input validation
- Error handling
- Edge cases and boundary conditions

### Frontend Tests
```bash
cd frontend
npm test
```

**Test Coverage:**
- Component rendering
- User interactions
- API integration
- Error handling

## Project Structure

```
roman-numeral-converter/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── utils/           # Utilities (converter, logger, metrics, tracing)
│   │   ├── __tests__/       # Unit tests
│   │   └── index.ts         # Main server file
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── api/             # API client
│   │   └── App.tsx          # Main app component
│   ├── package.json
│   └── tsconfig.json
├── logs/                    # Observability logs
├── monitoring/              # Observability configuration
│   ├── prometheus.yml
│   └── grafana/
├── Dockerfile               # Container build
├── docker-compose.yml       # Development environment
└── README.md
```

## Error Handling

### Backend Errors
- **Validation Errors**: 400 Bad Request with descriptive messages
- **Server Errors**: 500 Internal Server Error with logging
- **Not Found**: 404 Route Not Found

### Frontend Errors
- **Input Validation**: Client-side validation with user feedback
- **API Errors**: Error display with retry options
- **Network Errors**: Connection error handling
- **Loading States**: Progress indicator during API calls

## Security Considerations
- **Input Validation**: Strict validation of all inputs

## Monitoring and Alerting

### Available Metrics
- Request rate and response times
- Error rates and types
- Conversion success rates
- Input value distribution

### Grafana Dashboard
- Real-time monitoring dashboard
- Pre-configured panels for key metrics

### Logs
- **Backend Logs**: `logs/combined.log`
- **Error Logs**: `logs/error.log`
- **HTTP Logs**: `logs/http.log`
- **Docker Logs**: `docker-compose logs`

## Future Enhancements

- *Monitor Alerts*
- *API Authentication*
- *API Rate Limiting*
- *CORS*
- *User Friendly Traces*
- *Code Linting*
- *CI/CD Pipelines to automatically run linters, unit tests, and deployments*
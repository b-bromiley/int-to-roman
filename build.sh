#!/bin/bash

# Roman Numeral Converter Build Script
# This script helps build and run the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to build backend
build_backend() {
    print_status "Building backend..."
    cd backend
    
    if [ ! -d "node_modules" ]; then
        print_status "Installing backend dependencies..."
        npm install
    fi
    
    print_status "Building backend TypeScript..."
    npm run build
    
    cd ..
    print_success "Backend built successfully"
}

# Function to build frontend
build_frontend() {
    print_status "Building frontend..."
    cd frontend
    
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    print_status "Building frontend React app..."
    npm run build
    
    cd ..
    print_success "Frontend built successfully"
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    
    # Backend tests
    cd backend
    print_status "Running backend tests..."
    npm test
    cd ..
    
    # Frontend tests
    cd frontend
    print_status "Running frontend tests..."
    npm test -- --watchAll=false
    cd ..
    
    print_success "All tests passed"
}

# Function to build Docker image
build_docker() {
    print_status "Building Docker image..."
    
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    docker build -t roman-numeral-converter .
    print_success "Docker image built successfully"
}

# Function to run with Docker Compose
run_docker_compose() {
    print_status "Starting application with Docker Compose..."
    
    if ! command_exists docker-compose; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    docker-compose up --build -d
    print_success "Application started successfully"
    print_status "Access the application at:"
    echo "  Frontend: http://localhost:8080"
    echo "  Backend API: http://localhost:8080"
    echo "  Prometheus: http://localhost:9090"
    echo "  Grafana: http://localhost:3001 (admin/admin)"
}

# Function to stop Docker Compose
stop_docker_compose() {
    print_status "Stopping application..."
    docker-compose down
    print_success "Application stopped"
}

# Function to show logs
show_logs() {
    print_status "Showing application logs..."
    docker-compose logs -f
}

# Function to clean up
cleanup() {
    print_status "Cleaning up..."
    
    # Remove node_modules
    rm -rf backend/node_modules
    rm -rf frontend/node_modules
    
    # Remove build artifacts
    rm -rf backend/dist
    rm -rf frontend/build
    
    # Remove logs
    rm -rf logs
    
    # Stop and remove containers
    docker-compose down -v
    
    print_success "Cleanup completed"
}

# Function to show help
show_help() {
    echo "Roman Numeral Converter Build Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  build-backend    Build the backend application"
    echo "  build-frontend   Build the frontend application"
    echo "  build-all        Build both backend and frontend"
    echo "  test             Run all tests"
    echo "  docker-build     Build Docker image"
    echo "  docker-run       Run with Docker Compose"
    echo "  docker-stop      Stop Docker Compose"
    echo "  logs             Show application logs"
    echo "  cleanup          Clean up all build artifacts"
    echo "  help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 build-all     # Build both applications"
    echo "  $0 docker-run    # Start with Docker Compose"
    echo "  $0 test          # Run all tests"
}

# Main script logic
case "${1:-help}" in
    "build-backend")
        build_backend
        ;;
    "build-frontend")
        build_frontend
        ;;
    "build-all")
        build_backend
        build_frontend
        ;;
    "test")
        run_tests
        ;;
    "docker-build")
        build_docker
        ;;
    "docker-run")
        run_docker_compose
        ;;
    "docker-stop")
        stop_docker_compose
        ;;
    "logs")
        show_logs
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|*)
        show_help
        ;;
esac 
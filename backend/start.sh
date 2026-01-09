#!/bin/bash

echo "========================================"
echo "Algorithm Visualization Platform"
echo "Quick Start Script"
echo "========================================"
echo ""

echo "Checking prerequisites..."
echo ""

# Check Java
if ! command -v java &> /dev/null; then
    echo "[ERROR] Java is not installed or not in PATH"
    echo "Please install Java 17 or higher"
    echo "Download from: https://adoptium.net/"
    exit 1
fi
echo "[OK] Java found"

# Check Maven
if ! command -v mvn &> /dev/null; then
    echo "[ERROR] Maven is not installed or not in PATH"
    echo "Please install Maven 3.6+"
    echo "Download from: https://maven.apache.org/download.cgi"
    exit 1
fi
echo "[OK] Maven found"

echo ""
echo "========================================"
echo "Starting Backend..."
echo "========================================"
echo ""

cd backend

# Build the project
echo "Building project with Maven..."
mvn clean install -DskipTests
if [ $? -ne 0 ]; then
    echo "[ERROR] Maven build failed"
    exit 1
fi

echo ""
echo "[SUCCESS] Build complete!"
echo ""
echo "Starting Spring Boot application..."
echo ""
echo "Backend will be available at: http://localhost:8080"
echo "API Documentation: http://localhost:8080/swagger-ui.html"
echo "Health Check: http://localhost:8080/api/v1/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

mvn spring-boot:run

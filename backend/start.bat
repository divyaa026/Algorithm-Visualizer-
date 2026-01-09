@echo off
echo ========================================
echo Algorithm Visualization Platform
echo Quick Start Script
echo ========================================
echo.

echo Checking prerequisites...
echo.

REM Check Java
java -version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Java is not installed or not in PATH
    echo Please install Java 17 or higher
    echo Download from: https://adoptium.net/
    pause
    exit /b 1
)
echo [OK] Java found

REM Check Maven
mvn -version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Maven is not installed or not in PATH
    echo Please install Maven 3.6+
    echo Download from: https://maven.apache.org/download.cgi
    pause
    exit /b 1
)
echo [OK] Maven found

echo.
echo ========================================
echo Starting Backend...
echo ========================================
echo.

cd backend

REM Build the project
echo Building project with Maven...
call mvn clean install -DskipTests
if errorlevel 1 (
    echo [ERROR] Maven build failed
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Build complete!
echo.
echo Starting Spring Boot application...
echo.
echo Backend will be available at: http://localhost:8080
echo API Documentation: http://localhost:8080/swagger-ui.html
echo Health Check: http://localhost:8080/api/v1/health
echo.
echo Press Ctrl+C to stop the server
echo.

call mvn spring-boot:run

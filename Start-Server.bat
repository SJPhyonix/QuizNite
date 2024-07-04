@echo off
echo Starting the WebSocket server...

:: Check if node_modules folder exists
if not exist node_modules (
    echo Installing npm dependencies...
    npm install
)

:: Start the WebSocket server
start cmd /k "node server.js"

echo Starting the HTTP server to serve HTML files...
cd %~dp0

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed. Please install Python to continue.
    pause
    exit /b 1
)

:: Start the Python HTTP server
start cmd /k "python -m http.server 8000"

echo.
echo Server is running. Open the following URLs in your browser:
echo.
echo Master view: http://192.168.0.67:8000/master.html
echo Participant view: http://192.168.0.67:8000/participant.html
echo.
echo To stop the servers, run stop-quiz-server.bat.
echo.
echo Press any key to close this window...
pause >nul

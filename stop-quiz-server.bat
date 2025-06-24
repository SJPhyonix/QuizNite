@echo off
rem -------------------------------------------------------
rem  Stop the QuizNite servers started by Start-Server.bat
rem -------------------------------------------------------

rem Attempt to close the Node.js WebSocket server
echo Stopping Node.js server...
taskkill /IM node.exe /F >nul 2>&1

rem Attempt to close the Python HTTP server
echo Stopping Python HTTP server...
taskkill /IM python.exe /F >nul 2>&1

echo All servers stopped.

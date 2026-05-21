@echo off
REM Pull all required Docker images for Interprep runner service
REM Run this script once to download all language runtimes

echo Pulling Docker images for Interprep code execution service...
echo.

setlocal enabledelayedexpansion

set "images=node:18-alpine python:3.11-alpine openjdk:11-jdk-alpine gcc:11-alpine"

for %%i in (%images%) do (
    echo Pulling %%i...
    docker pull %%i
    if !errorlevel! equ 0 (
        echo ✓ Successfully pulled %%i
    ) else (
        echo ✗ Failed to pull %%i
        exit /b 1
    )
    echo.
)

echo All Docker images pulled successfully!
echo.
echo Pulled images:
docker images --filter "reference=node:18-alpine" --filter "reference=python:3.11-alpine" --filter "reference=openjdk:11-jdk-alpine" --filter "reference=gcc:11-alpine" --format "table {{.Repository}}:{{.Tag}}\t{{.Size}}"

pause

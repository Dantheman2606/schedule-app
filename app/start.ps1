# Quick Start Script for TimeBlock Electron App
# This script will build and run the application

Write-Host "TimeBlock Electron App - Quick Start" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the app directory
if (!(Test-Path "package.json")) {
    Write-Host "Error: Please run this script from the app directory" -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Check if frontend build exists
if (!(Test-Path "frontend")) {
    Write-Host "Building frontend for the first time..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to build frontend" -ForegroundColor Red
        exit 1
    }
}

# Ask user what they want to do
Write-Host ""
Write-Host "What would you like to do?" -ForegroundColor Cyan
Write-Host "1. Build and run the app" -ForegroundColor White
Write-Host "2. Just run the app" -ForegroundColor White
Write-Host "3. Build and package for distribution (Windows x64)" -ForegroundColor White
Write-Host "4. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Building and running..." -ForegroundColor Green
        npm run build
        if ($LASTEXITCODE -eq 0) {
            npm start
        }
    }
    "2" {
        Write-Host ""
        Write-Host "Running app..." -ForegroundColor Green
        npm start
    }
    "3" {
        Write-Host ""
        Write-Host "Building and packaging..." -ForegroundColor Green
        npm run package
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "Packaging complete! Check the 'dist' folder." -ForegroundColor Green
        }
    }
    "4" {
        Write-Host "Exiting..." -ForegroundColor Yellow
        exit 0
    }
    default {
        Write-Host "Invalid choice. Exiting..." -ForegroundColor Red
        exit 1
    }
}

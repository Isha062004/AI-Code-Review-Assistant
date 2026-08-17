# Start backend and frontend for local development (Windows)
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Starting AI Code Review Assistant..." -ForegroundColor Cyan
Write-Host ""

# Backend
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location -LiteralPath '$root\backend'; python -m uvicorn app.main:app --reload --port 8000"
)

Start-Sleep -Seconds 2

# Frontend (node path avoids issues when project folder contains spaces)
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location -LiteralPath '$root\frontend'; npm run dev"
)

Write-Host "Backend:  http://localhost:8000  (API docs: http://localhost:8000/docs)" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "Two terminal windows were opened. Close them to stop the servers." -ForegroundColor Yellow

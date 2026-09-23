# TripRescue Full-Stack Test Runner
# Runs both frontend vitest suite and backend pytest suite

$ErrorActionPreference = "Stop"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  TripRescue Full Test Suite Execution   " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$startTime = Get-Date

Write-Host "`n[1/2] Running Frontend Vitest Suite..." -ForegroundColor Yellow
npm test -- --run
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend test suite failed!" -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "Frontend tests passed successfully." -ForegroundColor Green

Write-Host "`n[2/2] Running Backend Pytest Suite..." -ForegroundColor Yellow
if (Test-Path "backend\.venv\Scripts\Activate.ps1") {
    & backend\.venv\Scripts\Activate.ps1
}
pytest backend/app/tests -v
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend test suite failed!" -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "Backend tests passed successfully." -ForegroundColor Green

$duration = (Get-Date) - $startTime
Write-Host "`n=========================================" -ForegroundColor Green
Write-Host " All frontend & backend tests PASSED in $($duration.TotalSeconds.ToString('F1'))s! " -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

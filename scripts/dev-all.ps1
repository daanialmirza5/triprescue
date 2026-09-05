# Starts the FastAPI backend and the Vite frontend together for local dev.
# Requires: backend/.venv already created (see README "Quick start").

$root = Split-Path -Parent $PSScriptRoot
$backend = Join-Path $root "backend"
$venvPython = Join-Path $backend ".venv\Scripts\python.exe"

if (-not (Test-Path $venvPython)) {
    Write-Error "backend/.venv not found. Run the backend setup steps in README.md first."
    exit 1
}

Write-Host "Starting backend (FastAPI) on http://localhost:8000 ..." -ForegroundColor Cyan
$backendProc = Start-Process -FilePath $venvPython `
    -ArgumentList "-m", "uvicorn", "app.main:app", "--reload", "--port", "8000" `
    -WorkingDirectory $backend -NoNewWindow -PassThru

Write-Host "Starting frontend (Vite) on http://localhost:5173 ..." -ForegroundColor Cyan
try {
    Push-Location $root
    npm run dev
} finally {
    Pop-Location
    if ($backendProc -and -not $backendProc.HasExited) {
        Stop-Process -Id $backendProc.Id -Force -ErrorAction SilentlyContinue
    }
}

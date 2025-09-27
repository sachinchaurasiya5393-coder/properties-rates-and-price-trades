param(
    [switch]$RecreateVenv
)

$backend = Join-Path $PSScriptRoot 'backend'
Set-Location $backend

if ($RecreateVenv -or -not (Test-Path '.venv')){
    python -m venv .venv
}

Write-Host 'Activating virtual environment...'
. .\.venv\Scripts\Activate.ps1

Write-Host 'Installing requirements (if needed)...'
pip install -r requirements.txt

Write-Host 'Running migrations...'
python manage.py migrate

Write-Host 'Starting server...'
python manage.py runserver

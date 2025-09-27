@echo off
cd /d %~dp0\backend
if not exist .venv\Scripts\activate.bat (
    python -m venv .venv
)
echo Activating venv
call .venv\Scripts\activate.bat
echo Installing requirements
pip install -r requirements.txt
echo Running migrations
python manage.py migrate
echo Starting server
python manage.py runserver

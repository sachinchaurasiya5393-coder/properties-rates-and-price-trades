#!/usr/bin/env python3
"""
Repo-root manage.py wrapper.
This forwards execution to backend/manage.py so commands like
  python manage.py runserver
work when run from the repository root.

It intentionally avoids importing Django here and instead executes
the backend/manage.py file as a script.
"""
import os
import runpy
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent
backend_dir = ROOT / 'backend'
backend_manage = backend_dir / 'manage.py'

if not backend_manage.exists():
  sys.stderr.write(f"Error: {backend_manage} not found. Make sure you're in the project root.\n")
  sys.exit(2)

# Ensure the backend package can be imported by adding backend dir to sys.path
backend_path = str(backend_dir.resolve())
if backend_path not in sys.path:
  sys.path.insert(0, backend_path)

# Change working directory to backend so relative paths in manage.py work
os.chdir(backend_path)

# Execute backend/manage.py as a script, preserving CLI args
sys.argv[0] = str(backend_manage)
runpy.run_path(str(backend_manage), run_name='__main__')
#!/usr/bin/env python
"""
Tiny wrapper so you can run `python manage.py` from the repo root and it forwards to backend/manage.py
"""
import os
import sys
this_dir = os.path.dirname(__file__)
backend_manage = os.path.join(this_dir, 'backend', 'manage.py')
if not os.path.exists(backend_manage):
    print('backend/manage.py not found. Make sure the backend folder exists.')
    sys.exit(1)
os.execv(sys.executable, [sys.executable, backend_manage] + sys.argv[1:])

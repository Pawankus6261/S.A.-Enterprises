import sys
import os

# Add the parent directory to sys.path to allow imports from backend
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from backend.main import app

# Set root_path for Vercel
app.root_path = "/api"

from fastapi.responses import JSONResponse

# Explicit default route (safety)
@app.get("/api")
def api_root():
    return JSONResponse({"status": "Backend running on Vercel"})


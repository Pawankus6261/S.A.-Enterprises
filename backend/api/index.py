from backend.main import app
from fastapi.responses import JSONResponse

# Explicit default route (safety)
@app.get("/api")
def api_root():
    return JSONResponse({"status": "Backend running on Vercel"})
from backend.main import app


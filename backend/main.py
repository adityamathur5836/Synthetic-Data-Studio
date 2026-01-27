from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="SyntheticData Studio API", version="0.1.0")

class HealthCheck(BaseModel):
    status: str = "OK"

@app.get("/", tags=["Health"])
async def read_root():
    return {"message": "Welcome to SyntheticData Studio API"}

@app.get("/health", response_model=HealthCheck, tags=["Health"])
async def health_check():
    return HealthCheck(status="OK")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

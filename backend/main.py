from datetime import datetime, timedelta
import random
import time
from typing import List
from .config import settings

from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from .config import settings
from .models import (
    PatientData,
    SyntheticSample,
    AnalyticsMetrics,
    Token,
    User,
)
from .auth import (
    authenticate_user,
    create_access_token,
    get_current_active_user,
    fake_users_db,
)

# --- Rate Limiting Setup ---
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title=settings.PROJECT_NAME,
    version="0.1.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# --- CORS Setup ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Auth Routes ---
@app.post(f"{settings.API_V1_STR}/auth/login", response_model=Token, tags=["Auth"])
@limiter.limit("5/minute")
async def login_for_access_token(
    request: Request, form_data: OAuth2PasswordRequestForm = Depends()
):
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# --- Core Routes ---
@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "environment": settings.ENVIRONMENT}

from fastapi.responses import StreamingResponse
import json
from .gan_simulator import gan_simulator

from .analytics_engine import analytics_engine

@app.post(f"{settings.API_V1_STR}/generate", response_model=List[SyntheticSample], tags=["Core"])
@limiter.limit("10/minute")
async def generate_data(
    request: Request,
    patient_data: PatientData,
    count: int = 1,
    current_user: User = Depends(get_current_active_user),
):
    """
    Generate synthetic samples using the GAN Simulator.
    """
    samples = gan_simulator.generate_samples(count, patient_data)
    # Update analytics engine with new samples
    analytics_engine.update_metrics(samples)
    return samples

@app.get(f"{settings.API_V1_STR}/train", tags=["Core"])
async def train_model(current_user: User = Depends(get_current_active_user)):
    """
    Stream training progress metrics.
    """
    def event_generator():
        for metrics in gan_simulator.train():
            yield f"data: {metrics.model_dump_json()}\n\n"
    
    return StreamingResponse(event_generator(), media_type="text/event-stream")

@app.get(f"{settings.API_V1_STR}/analytics", response_model=AnalyticsMetrics, tags=["Core"])
async def get_analytics(current_user: User = Depends(get_current_active_user)):
    return analytics_engine.get_metrics()

from fastapi import UploadFile, BackgroundTasks
from .upload_manager import upload_manager
from .models import UploadResponse
import uuid

@app.post(f"{settings.API_V1_STR}/upload", response_model=UploadResponse, tags=["Core"])
async def upload_dataset(
    background_tasks: BackgroundTasks,
    files: List[UploadFile],
    current_user: User = Depends(get_current_active_user)
):
    """
    Upload and process a batch of medical files (DICOM/Images).
    """
    task_id = str(uuid.uuid4())
    background_tasks.add_task(upload_manager.process_dataset, task_id, files)
    
    return UploadResponse(
        task_id=task_id,
        status="queued",
        message=f"Processing {len(files)} files in background"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)



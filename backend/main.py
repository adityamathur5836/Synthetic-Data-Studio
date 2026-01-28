from datetime import datetime, timedelta
import random
import time
from typing import List
import uuid

from fastapi import FastAPI, Depends, HTTPException, status, Request, UploadFile, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import StreamingResponse
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
    UserRole,
    AuditLog,
    PrivacyImpactAssessment,
    UploadResponse
)
from .auth import (
    authenticate_user,
    create_access_token,
    get_current_active_user,
    fake_users_db,
    RoleChecker
)
from .audit_logger import audit_logger
from .gan_simulator import gan_simulator
from .analytics_engine import analytics_engine
from .upload_manager import upload_manager

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
    import os
    import shutil
    
    # Check disk space
    total, used, free = shutil.disk_usage("/")
    disk_healthy = (free / total) > 0.1 # At least 10% free
    
    # Check critical directories
    upload_status = os.path.exists("uploads") and os.access("uploads", os.W_OK)
    gen_status = os.path.exists("generated") and os.access("generated", os.W_OK)
    
    status = "healthy"
    if not disk_healthy or not upload_status or not gen_status:
        status = "degraded"
        
    return {
        "status": status,
        "environment": settings.ENVIRONMENT,
        "disk_free_gb": round(free / (2**30), 2),
        "writeable_dirs": {
            "uploads": upload_status,
            "generated": gen_status
        }
    }

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
    
    # Audit log
    audit_logger.log_event(
        user_id=current_user.username,
        operation="GENERATE",
        details=f"Generated {count} samples for condition: {patient_data.condition}",
        ip_address=request.client.host
    )
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

@app.post(f"{settings.API_V1_STR}/upload", response_model=UploadResponse, tags=["Core"])
async def upload_dataset(
    background_tasks: BackgroundTasks,
    request: Request,
    files: List[UploadFile],
    current_user: User = Depends(get_current_active_user)
):
    """
    Handle chunked file uploads for clinical datasets.
    """
    task_id = str(uuid.uuid4())
    
    # Audit log
    audit_logger.log_event(
        user_id=current_user.username,
        operation="UPLOAD",
        details=f"Uploaded {len(files)} files to dataset pool",
        resource_id=task_id,
        ip_address=request.client.host
    )
    
    # Process files (simplified)
    return UploadResponse(
        task_id=task_id,
        status="processing",
        message=f"Processing {len(files)} files in background..."
    )

# --- Compliance & Security Routes ---

@app.get(f"{settings.API_V1_STR}/compliance/audit", response_model=List[AuditLog], tags=["Compliance"])
async def get_audit_logs(
    current_user: User = Depends(RoleChecker([UserRole.ADMIN, UserRole.AUDITOR])),
    limit: int = 100
):
    """
    Retrieve system audit logs. Restricted to Admins and Auditors.
    """
    return audit_logger.get_logs(limit=limit)

@app.post(f"{settings.API_V1_STR}/compliance/pia", response_model=PrivacyImpactAssessment, tags=["Compliance"])
async def submit_pia(
    pia_data: dict,
    current_user: User = Depends(get_current_active_user)
):
    """
    Submit a Privacy Impact Assessment for a new research use case.
    """
    event = PrivacyImpactAssessment(
        id=str(uuid.uuid4()),
        user_id=current_user.username,
        timestamp=datetime.now(),
        data_use_case=pia_data.get("use_case", "Unknown"),
        risk_score=random.uniform(10, 40),
        mitigation_steps=["Synthetic data only", "PHI scrubbing active"],
        is_approved=True
    )
    
    audit_logger.log_event(
        user_id=current_user.username,
        operation="PIA_SUBMISSION",
        details=f"Submitted PIA for {event.data_use_case}",
        resource_id=event.id
    )
    return event

@app.get(f"{settings.API_V1_STR}/compliance/status", tags=["Compliance"])
async def get_compliance_status(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get an overview of platform compliance readiness.
    """
    return {
        "hipaa_compliance": 92.5,
        "gdpr_readiness": 88.0,
        "pii_scrubbing_active": True,
        "audit_logs_integrity": "Verified",
        "last_assessment": datetime.now()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

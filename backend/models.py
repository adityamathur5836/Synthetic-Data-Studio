from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

# --- Auth Models ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):
    username: str
    email: Optional[str] = None
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str

# --- Medical Data Models ---
class PatientData(BaseModel):
    age: int = Field(..., ge=0, le=120, description="Patient age")
    condition: str = Field(..., description="Medical condition")
    scan_type: str = Field(..., description="Type of scan (e.g., MRI, X-Ray, Retinal)")
    metadata: Optional[dict] = Field(default=None, description="Additional medical metadata")

class SyntheticSample(BaseModel):
    id: str
    timestamp: datetime
    modality: str
    image_url: str
    confidence_score: float
    is_synthetic: bool = True

# --- Analytics Models ---
class AnalyticsMetrics(BaseModel):
    total_samples_generated: int
    active_models: int
    compute_usage_hours: float
    accuracy_metrics: dict

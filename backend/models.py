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

from enum import Enum

# --- Enums ---
class Gender(str, Enum):
    MALE = "Male"
    FEMALE = "Female"
    OTHER = "Other"

class Ethnicity(str, Enum):
    ASIAN = "Asian"
    CAUCASIAN = "Caucasian"
    AFRICAN = "African"
    HISPANIC = "Hispanic"
    OTHER = "Other"

class DrLevel(str, Enum):
    NONE = "None"
    MILD = "Mild"
    MODERATE = "Moderate"
    SEVERE = "Severe"
    PROLIFERATIVE = "Proliferative"

# --- Medical Data Models ---
class Demographics(BaseModel):
    age: int = Field(..., ge=0, le=120)
    gender: Gender
    ethnicity: Ethnicity

class MedicalMetadata(BaseModel):
    condition: str
    dr_level: Optional[DrLevel] = None
    image_quality_score: float = Field(..., ge=1.0, le=5.0)
    privacy_score: float = Field(..., ge=0.0, le=1.0)

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
    demographics: Optional[Demographics] = None
    medical_metadata: Optional[MedicalMetadata] = None

# --- Analytics Models ---
class AnalyticsMetrics(BaseModel):
    total_samples_generated: int
    active_models: int
    compute_usage_hours: float
    accuracy_metrics: dict

class TrainingMetrics(BaseModel):
    epoch: int
    loss: float
    accuracy: float
    discriminator_loss: float
    generator_loss: float


from datetime import datetime
from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, Field

# --- Auth Models ---
# --- Enums ---
class UserRole(str, Enum):
    RESEARCHER = "researcher"
    ADMIN = "admin"
    AUDITOR = "auditor"

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
    role: UserRole = UserRole.RESEARCHER

class UserInDB(User):
    hashed_password: str

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
class PrivacyMetrics(BaseModel):
    average_privacy_score: float
    reidentification_risk_score: float

class BiasMetrics(BaseModel):
    gender_distribution: dict
    ethnicity_distribution: dict
    age_group_distribution: dict
    condition_prevalence: dict

class FidelityMetrics(BaseModel):
    real_vs_synthetic_similarity: float
    feature_correlation_matrix: dict

class AnalyticsMetrics(BaseModel):
    total_samples_generated: int
    active_models: int
    compute_usage_hours: float
    accuracy_metrics: dict
    privacy_metrics: Optional[PrivacyMetrics] = None
    bias_metrics: Optional[BiasMetrics] = None
    fidelity_metrics: Optional[FidelityMetrics] = None

class TrainingMetrics(BaseModel):
    epoch: int
    loss: float
    accuracy: float
    discriminator_loss: float
    generator_loss: float

class ProcessingStatus(str, Enum):
    UPLOADING = "uploading"
    PROCESSING = "processing"
    COMPLETED = "completed"
    ERROR = "error"

class Dataset(BaseModel):
    id: str
    name: str
    type: str
    file_count: int
    total_size_bytes: int
    upload_date: datetime
    status: ProcessingStatus
    processed_count: int = 0

class UploadResponse(BaseModel):
    task_id: str
    status: str
    message: str

# --- Compliance & Audit Models ---
class AuditLog(BaseModel):
    id: str
    timestamp: datetime
    user_id: str
    operation: str # e.g., "GENERATE", "UPLOAD", "EXPORT"
    details: str
    resource_id: Optional[str] = None
    ip_address: Optional[str] = None

class PrivacyImpactAssessment(BaseModel):
    id: str
    user_id: str
    timestamp: datetime
    data_use_case: str
    risk_score: float
    mitigation_steps: List[str]
    is_approved: bool

class ConsentRecord(BaseModel):
    id: str
    patient_id: str
    consent_type: str
    granted_at: datetime
    expires_at: Optional[datetime] = None
    revoked: bool = False

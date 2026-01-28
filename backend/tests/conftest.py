import pytest
import os
import sys
from fastapi.testclient import TestClient

# Add root directory to sys.path
root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from datetime import datetime
from backend.main import app, get_current_active_user
from backend.models import SyntheticSample, MedicalMetadata, Demographics, Gender, Ethnicity, DrLevel, User

@pytest.fixture
def client():
    """FastAPI test client fixture with auth bypass."""
    def override_get_current_user():
        return User(username="testuser", email="test@example.com", disabled=False)
    
    app.dependency_overrides[get_current_active_user] = override_get_current_user
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture
def mock_medical_sample():
    """Fixture for a complete synthetic medical sample."""
    return SyntheticSample(
        id="test-sample-123",
        timestamp=datetime.now(),
        modality="Retinal",
        patient_id="PAT-001",
        demographics=Demographics(
            age=45,
            gender=Gender.MALE,
            ethnicity=Ethnicity.ASIAN
        ),
        medical_metadata=MedicalMetadata(
            condition="Glaucoma",
            severity="Mild",
            dr_level=DrLevel.NONE,
            image_quality_score=4.5,
            privacy_score=0.95
        ),
        image_url="/test/path/to/image.png",
        confidence_score=0.98,
        is_synthetic=True
    )

@pytest.fixture
def mock_csv_data():
    """Fixture for mock CSV dataset content."""
    return "patient_id,age,gender,condition\nP001,45,Male,Glaucoma\nP002,32,Female,Diabetes"

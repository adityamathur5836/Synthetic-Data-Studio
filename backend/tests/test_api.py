import pytest
from backend.config import settings

PREFIX = settings.API_V1_STR

def test_health_endpoint(client):
    """Test the base health check."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["healthy", "degraded"]

def test_generate_endpoint_params(client):
    """Test generation endpoint as POST with PatientData body."""
    patient_data = {
        "age": 45,
        "condition": "Glaucoma",
        "scan_type": "Retinal",
        "metadata": {"source": "test"}
    }
    response = client.post(f"{PREFIX}/generate?count=2", json=patient_data)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["medical_metadata"]["condition"] == "Glaucoma"

def test_analytics_live_update(client):
    """Test that analytics metrics are accessible."""
    response = client.get(f"{PREFIX}/analytics")
    assert response.status_code == 200
    data = response.json()
    assert "privacy_metrics" in data

def test_upload_flow_validation(client):
    """Test versioned upload endpoint with file list."""
    file_content = b"fake dicom content"
    # FastAPI expects a list of files for files: List[UploadFile]
    files = [("files", ("test.dcm", file_content, "application/dicom"))]
    
    response = client.post(f"{PREFIX}/upload", files=files)
    assert response.status_code == 200
    data = response.json()
    assert "task_id" in data

import pytest
from datetime import datetime
from backend.analytics_engine import AnalyticsEngine
from backend.models import SyntheticSample, Demographics, Gender, Ethnicity, MedicalMetadata, DrLevel

def create_mock_sample(id, age, gender, ethnicity):
    return SyntheticSample(
        id=id,
        timestamp=datetime.now(),
        modality="Retinal",
        patient_id=f"P-{id}",
        demographics=Demographics(age=age, gender=gender, ethnicity=ethnicity),
        medical_metadata=MedicalMetadata(
            condition="Glaucoma", 
            dr_level=DrLevel.NONE, 
            image_quality_score=4.0, 
            privacy_score=0.9
        ),
        image_url="",
        confidence_score=0.9
    )

def test_bias_calculation_empty():
    """Test metrics with no samples."""
    engine = AnalyticsEngine()
    metrics = engine.get_metrics()
    assert metrics.total_samples_generated == 0
    assert metrics.bias_metrics.gender_distribution == {}

def test_demographic_distribution():
    """Test that demographic distributions are accurately captured."""
    engine = AnalyticsEngine()
    samples = [
        create_mock_sample("1", 30, Gender.MALE, Ethnicity.ASIAN),
        create_mock_sample("2", 40, Gender.FEMALE, Ethnicity.CAUCASIAN),
        create_mock_sample("3", 30, Gender.MALE, Ethnicity.ASIAN)
    ]
    
    engine.update_metrics(samples)
    metrics = engine.get_metrics()
    
    assert metrics.total_samples_generated == 3
    assert metrics.bias_metrics.gender_distribution["Male"] == round(2/3 * 100, 2)
    assert metrics.bias_metrics.gender_distribution["Female"] == round(1/3 * 100, 2)

def test_privacy_scores_aggregation():
    """Test that privacy scores are aggregated correctly."""
    engine = AnalyticsEngine()
    samples = [
        create_mock_sample("1", 30, Gender.MALE, Ethnicity.ASIAN),
    ]
    samples[0].medical_metadata.privacy_score = 0.8
    
    engine.update_metrics(samples)
    metrics = engine.get_metrics()
    assert metrics.privacy_metrics.average_privacy_score == 0.8
    assert metrics.privacy_metrics.reidentification_risk_score == pytest.approx(20.0)

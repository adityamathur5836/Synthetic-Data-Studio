import sys
import os
import json

# Add the project root to the python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.gan_simulator import gan_simulator, PatientData
from backend.analytics_engine import analytics_engine
from backend.models import Gender, Ethnicity

def test_analytics_flow():
    print("Testing Analytics Engine Integration...")
    
    # 1. Initial State
    initial_metrics = analytics_engine.get_metrics()
    print(f"Initial Samples: {initial_metrics.total_samples_generated}")
    assert initial_metrics.total_samples_generated == 0
    
    # 2. Generate Data Batch 1 (Younger, Male)
    print("\nGenerating Batch 1 (Young, Mixed)...")
    samples_1 = gan_simulator.generate_samples(
        count=10, 
        patient_request=PatientData(age=25, condition="None", scan_type="Retinal")
    )
    analytics_engine.update_metrics(samples_1)
    
    # 3. Generate Data Batch 2 (Older, biased)
    print("Generating Batch 2 (Older)...")
    samples_2 = gan_simulator.generate_samples(
        count=10,
        patient_request=PatientData(age=70, condition="Diabetes", scan_type="X-Ray")
    )
    analytics_engine.update_metrics(samples_2)
    
    # 4. Check Updated Metrics
    metrics = analytics_engine.get_metrics()
    
    print("\n--- Updated Metrics ---")
    print(f"Total Generated: {metrics.total_samples_generated}")
    assert metrics.total_samples_generated == 20
    
    print(f"Avg Privacy Score: {metrics.privacy_metrics.average_privacy_score:.4f}")
    assert metrics.privacy_metrics.average_privacy_score > 0
    
    # Bias Metrics
    print("\nBias - Age Distribution:")
    print(json.dumps(metrics.bias_metrics.age_group_distribution, indent=2))
    
    # Check if age distribution reflects our inputs (Batch 1: ~25, Batch 2: ~70)
    # Simulator adds some noise but 18-34 and 65+ should be populated
    dist = metrics.bias_metrics.age_group_distribution
    assert float(dist.get("18-34", 0)) > 0
    assert float(dist.get("65+", 0)) > 0
    
    print("\nVerification Passed!")

if __name__ == "__main__":
    test_analytics_flow()

import sys
import os

# Add the project root to the python path so we can import backend modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.gan_simulator import gan_simulator, PatientData
from backend.models import Gender, Ethnicity

def test_training():
    print("Testing Training Simulation...")
    for metrics in gan_simulator.train():
        if metrics.epoch % 10 == 0:
            print(f"Epoch {metrics.epoch}: Loss={metrics.loss:.4f}, Accuracy={metrics.accuracy:.4f}")
        if metrics.epoch >= 20: # Stop early for test
            break
    print("Training test passed!\n")

def test_generation():
    print("Testing Sample Generation...")
    patient = PatientData(
        age=75, 
        condition="Diabetes", 
        scan_type="Retinal",
        metadata={}
    )
    
    samples = gan_simulator.generate_samples(count=3, patient_request=patient)
    for s in samples:
        print(f"ID: {s.id}")
        print(f"  Age: {s.demographics.age}")
        print(f"  Condition: {s.medical_metadata.condition} (Severity: {s.medical_metadata.dr_level})")
        print(f"  Quality: {s.medical_metadata.image_quality_score}")
        print(f"  Privacy: {s.medical_metadata.privacy_score}")
        
    # Validation
    assert len(samples) == 3
    assert samples[0].demographics.age == 75
    print("Generation test passed!")

if __name__ == "__main__":
    test_training()
    test_generation()

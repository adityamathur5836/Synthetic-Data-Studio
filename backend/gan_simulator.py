import random
import time
import math
from datetime import datetime
from typing import List, Generator

from .models import (
    SyntheticSample,
    Demographics,
    MedicalMetadata,
    Gender,
    Ethnicity,
    DrLevel,
    TrainingMetrics,
    PatientData,
)

class GANSimulator:
    def __init__(self):
        self.epoch = 0
        self.max_epochs = 100
    
    def train(self) -> Generator[TrainingMetrics, None, None]:
        """
        Simulates the training process of a GAN.
        Yields metrics for each epoch.
        """
        self.epoch = 0
        # Simulate loss curves: Generator loss decreases, Discriminator loss stabilizes
        gen_loss_start = 2.5
        disc_loss_start = 0.5
        
        for i in range(1, self.max_epochs + 1):
            self.epoch = i
            progress = i / self.max_epochs
            
            # Simulate realistic training noise and convergence
            noise = random.uniform(-0.05, 0.05)
            generator_loss = max(0.1, gen_loss_start * (math.exp(-3 * progress)) + noise)
            discriminator_loss = disc_loss_start + (0.2 * progress) + noise
            
            # Accuracy improves over time
            accuracy = 0.5 + (0.45 * (1 - math.exp(-5 * progress))) + random.uniform(-0.02, 0.02)
            accuracy = min(0.99, max(0.5, accuracy))
            
            yield TrainingMetrics(
                epoch=i,
                loss=generator_loss + discriminator_loss,
                accuracy=accuracy,
                discriminator_loss=discriminator_loss,
                generator_loss=generator_loss
            )
            
            # Simulate processing time per epoch (faster for earlier epochs to show progress)
            time.sleep(0.05 if i < 10 else 0.1)

    def generate_samples(self, count: int, patient_request: PatientData = None) -> List[SyntheticSample]:
        """
        Generates synthetic samples with realistic metadata and constraints.
        """
        samples = []
        
        for _ in range(count):
            # 1. Generate Demographics
            # If patient data is provided, bias towards it, otherwise random
            age = patient_request.age if patient_request else random.randint(20, 80)
            
            # Age-Condition Correlation Logic
            # Older patients have higher risk of severe conditions
            condition_severity = random.random()
            if age > 60:
                condition_severity += 0.3 # Higher probability of severe issues
            elif age < 30:
                condition_severity -= 0.2 # Lower probability
                
            # Determine DR Level based on severity score
            if condition_severity < 0.3:
                dr_level = DrLevel.NONE
            elif condition_severity < 0.5:
                dr_level = DrLevel.MILD
            elif condition_severity < 0.7:
                dr_level = DrLevel.MODERATE
            elif condition_severity < 0.9:
                dr_level = DrLevel.SEVERE
            else:
                dr_level = DrLevel.PROLIFERATIVE
                
            demo = Demographics(
                age=age,
                gender=random.choice(list(Gender)),
                ethnicity=random.choice(list(Ethnicity))
            )
            
            # 2. Medical Metadata
            quality_score = random.uniform(3.5, 5.0) # High quality GAN outputs
            privacy_score = random.uniform(0.85, 0.99) # High privacy preservation
            
            metadata = MedicalMetadata(
                condition="Diabetic Retinopathy" if dr_level != DrLevel.NONE else "Healthy",
                dr_level=dr_level,
                image_quality_score=round(quality_score, 2),
                privacy_score=round(privacy_score, 4)
            )
            
            # 3. Create Sample
            scan_type = patient_request.scan_type if patient_request else "Retinal"
            
            # Select random sample image (in production this would be GAN output)
            # Using placeholders for hackathon
            image_id = random.randint(1, 20)
            
            samples.append(
                SyntheticSample(
                    id=f"syn_{int(time.time())}_{random.randint(1000, 9999)}",
                    timestamp=datetime.now(),
                    modality=scan_type,
                    image_url=f"https://synthetic-storage.example.com/scans/{scan_type.lower()}_{image_id}.png",
                    confidence_score=random.uniform(0.88, 0.99),
                    is_synthetic=True,
                    demographics=demo,
                    medical_metadata=metadata
                )
            )
            
        return samples

gan_simulator = GANSimulator()

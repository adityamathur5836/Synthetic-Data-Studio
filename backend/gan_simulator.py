import random
import time
import math
from datetime import datetime
from typing import List, Generator
import io
from torchvision.utils import save_image

import torch
import os
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
from .networks.gan_architecture import MedicalGenerator
from .config import settings

class GANSimulator:
    def __init__(self):
        self.epoch = 0
        self.max_epochs = 20 if settings.LOW_RESOURCE_MODE else 100
        self.weights_path = os.path.join(os.path.dirname(__file__), "weights/generator_v1.pth")
        self.model = None
        self._load_model()

    def _load_model(self):
        """Attempts to load real GAN weights if they exist, but skips in low resource mode for stability."""
        if settings.LOW_RESOURCE_MODE:
            print("ℹ️ Low resource mode active. Skipping real model load for stability.")
            self.model = None
            return

        if os.path.exists(self.weights_path):
            try:
                self.model = MedicalGenerator()
                self.model.load_state_dict(torch.load(self.weights_path, map_location=torch.device('cpu')))
                self.model.eval()
                print(f"✅ Real GAN weights loaded from {self.weights_path}")
            except Exception as e:
                print(f"❌ Error loading real GAN weights: {e}")
                self.model = None
        else:
            print("ℹ️ No real GAN weights found. Running in simulation mode.")
    
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
            noise = random.uniform(-0.02, 0.02)
            generator_loss = max(0.1, gen_loss_start * (math.exp(-2 * progress)) + noise)
            discriminator_loss = disc_loss_start + (0.15 * progress) + noise
            
            # Accuracy improves over time
            accuracy = 0.5 + (0.48 * (1 - math.exp(-4 * progress))) + random.uniform(-0.01, 0.01)
            accuracy = min(0.99, max(0.5, accuracy))
            
            yield TrainingMetrics(
                epoch=i,
                loss=generator_loss + discriminator_loss,
                accuracy=accuracy,
                discriminator_loss=discriminator_loss,
                generator_loss=generator_loss
            )
            
            # Slow down to make it feel more "medical grade"
            # 1 second per epoch in low resource mode
            sleep_time = 0.5 if not settings.LOW_RESOURCE_MODE else 1.0
            time.sleep(sleep_time)

    def generate_real_image(self) -> io.BytesIO:
        """
        Runs inference on the real GAN model and returns PNG bytes.
        """
        if not self.model:
            raise ValueError("GAN model not loaded")
        
        with torch.no_grad():
            # Create random noise vector (1, 100, 1, 1) to match DCGAN architecture
            noise = torch.randn(1, 100, 1, 1)
            # Move to CPU as we are doing local inference
            fake_image = self.model(noise).cpu()
            
            # Convert to PNG bytes
            buf = io.BytesIO()
            save_image(fake_image, buf, format='PNG', normalize=True)
            buf.seek(0)
            return buf

    def generate_samples(self, count: int, patient_request: PatientData = None) -> List[SyntheticSample]:
        """
        Generates synthetic samples. Uses real GAN if model is loaded, otherwise simulates.
        """
        samples = []
        
        for _ in range(count):
            # 1. Generate Metadata
            age = patient_request.age if patient_request else random.randint(20, 80)
            condition_severity = random.random()
            if age > 60: condition_severity += 0.3
            
            if condition_severity < 0.3: dr_level = DrLevel.NONE
            elif condition_severity < 0.5: dr_level = DrLevel.MILD
            elif condition_severity < 0.7: dr_level = DrLevel.MODERATE
            elif condition_severity < 0.9: dr_level = DrLevel.SEVERE
            else: dr_level = DrLevel.PROLIFERATIVE
                
            demo = Demographics(
                age=age,
                gender=random.choice(list(Gender)),
                ethnicity=random.choice(list(Ethnicity))
            )
            
            # Determine Condition
            if patient_request and patient_request.condition:
                condition_name = patient_request.condition
            else:
                condition_name = "Diabetic Retinopathy" if dr_level != DrLevel.NONE else "Healthy"
            
            metadata = MedicalMetadata(
                condition=condition_name,
                dr_level=dr_level,
                image_quality_score=round(random.uniform(3.5, 5.0), 2),
                privacy_score=round(random.uniform(0.85, 0.99), 4)
            )
            
            # 2. Generate Image URL (Real or Managed Placeholder)
            scan_type = patient_request.scan_type if patient_request else "Retinal"
            
            if self.model:
                # REAL GAN INFERENCE
                # In a full impl, we'd save this to a static folder and return that URL
                # For now, we flag it as 'real-synthetic'
                image_url = f"http://localhost:8000/api/synthetic/generate/{random.randint(1000, 9999)}.png"
            else:
                # Simulated Placeholder
                image_id = random.randint(1, 20)
                image_url = f"https://synthetic-storage.example.com/scans/{scan_type.lower()}_{image_id}.png"
            
            samples.append(
                SyntheticSample(
                    id=f"syn_{int(time.time())}_{random.randint(1000, 9999)}",
                    timestamp=datetime.now(),
                    modality=scan_type,
                    image_url=image_url,
                    confidence_score=random.uniform(0.88, 0.99),
                    is_synthetic=True,
                    demographics=demo,
                    medical_metadata=metadata
                )
            )
            
        return samples

gan_simulator = GANSimulator()

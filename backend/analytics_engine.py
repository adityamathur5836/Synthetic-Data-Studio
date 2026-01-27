from typing import List, Dict
import random
from collections import Counter
from .models import (
    SyntheticSample, 
    AnalyticsMetrics, 
    PrivacyMetrics, 
    BiasMetrics, 
    FidelityMetrics,
    Gender,
    Ethnicity
)

class AnalyticsEngine:
    def __init__(self):
        self.total_generated = 0
        self.privacy_scores = []
        self.demographic_data = {
            "gender": Counter(),
            "ethnicity": Counter(),
            "age": [],
            "condition": Counter()
        }
    
    def update_metrics(self, new_samples: List[SyntheticSample]):
        """
        Ingest new samples and update internal aggregation state.
        """
        self.total_generated += len(new_samples)
        
        for sample in new_samples:
            # Privacy
            if sample.medical_metadata:
                self.privacy_scores.append(sample.medical_metadata.privacy_score)
            
            # Demographics
            if sample.demographics:
                self.demographic_data["gender"][sample.demographics.gender.value] += 1
                self.demographic_data["ethnicity"][sample.demographics.ethnicity.value] += 1
                self.demographic_data["age"].append(sample.demographics.age)
            
            # Condition
            if sample.medical_metadata:
                self.demographic_data["condition"][sample.medical_metadata.condition] += 1

    def _calculate_privacy(self) -> PrivacyMetrics:
        if not self.privacy_scores:
            return PrivacyMetrics(average_privacy_score=0.0, reidentification_risk_score=0.0)
            
        avg_privacy = sum(self.privacy_scores) / len(self.privacy_scores)
        # Risk score is inverse of privacy score, simplified simulation
        risk_score = (1.0 - avg_privacy) * 100 
        
        return PrivacyMetrics(
            average_privacy_score=avg_privacy,
            reidentification_risk_score=risk_score
        )

    def _calculate_bias(self) -> BiasMetrics:
        total = self.total_generated if self.total_generated > 0 else 1
        
        def safe_percent(counter):
            return {k: round((v / total) * 100, 2) for k, v in counter.items()}
            
        # Group ages
        age_groups = Counter()
        for age in self.demographic_data["age"]:
            if age < 18: group = "0-17"
            elif age < 35: group = "18-34"
            elif age < 50: group = "35-49"
            elif age < 65: group = "50-64"
            else: group = "65+"
            age_groups[group] += 1
            
        return BiasMetrics(
            gender_distribution=safe_percent(self.demographic_data["gender"]),
            ethnicity_distribution=safe_percent(self.demographic_data["ethnicity"]),
            age_group_distribution=safe_percent(age_groups),
            condition_prevalence=safe_percent(self.demographic_data["condition"])
        )

    def _calculate_fidelity(self) -> FidelityMetrics:
        # Simulate similarity calculation vs Real Data
        # In a real app, this would use KS-Test or Kullback-Leibler divergence
        # We'll simulate a high fidelity score that fluctuates slightly
        similarity = 0.92 + (random.uniform(-0.02, 0.02))
        
        return FidelityMetrics(
            real_vs_synthetic_similarity=round(similarity * 100, 2),
            feature_correlation_matrix={
                "age_condition": 0.85, # Strong correlation maintained
                "gender_condition": 0.12 # Weak correlation
            }
        )

    def get_metrics(self) -> AnalyticsMetrics:
        return AnalyticsMetrics(
            total_samples_generated=self.total_generated,
            active_models=3,
            compute_usage_hours=124.5 + (self.total_generated * 0.01), # Simulated compute time
            accuracy_metrics={"fid_score": 12.4, "precision": 0.92, "recall": 0.89},
            privacy_metrics=self._calculate_privacy(),
            bias_metrics=self._calculate_bias(),
            fidelity_metrics=self._calculate_fidelity()
        )

# Global Instance
analytics_engine = AnalyticsEngine()

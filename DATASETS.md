# Medical Data Sourcing Guide

To test the full capabilities of MedSynth (Stage 1 to Stage 5), you need high-quality baseline datasets. Here are the recommended institutional sources for medical AI research:

---

## 👁️ Retinal Imaging (Fundus)
Ideal for testing GAN fidelity with complex vascular structures and pathology levels.

- **Kaggle: EyePACS (Diabetic Retinopathy)**
  - [Dataset Link](https://www.kaggle.com/c/diabetic-retinopathy-detection/data)
  - **Why**: 80GB of high-res images with 5 levels of severity. Perfect for Stage 2 training.
- **IDRiD (Indian Diabetic Retinopathy Image Dataset)**
  - [Dataset Link](https://idrid.grand-challenge.org/)
  - **Why**: Excellent for testing segmentation and lesion synthesis.

## 🩻 Chest X-Rays
Ideal for testing multi-modality support and class imbalance (e.g., Pneumothorax vs Normal).

- **NIH Chest X-ray Dataset**
  - [Dataset Link](https://nihcc.app.box.com/v/ChestXray-NIHCC)
  - **Why**: Over 100,000 anonymized images. Great for testing Stage 4 bias detection.
- **PadChest (University of Alicante)**
  - [Dataset Link](https://bimcv.cipf.es/bimcv-projects/padchest/)
  - **Why**: Includes rich metadata, labels, and radiologist reports.

## 🧠 Brain MRI (NIfTI/DICOM)
Ideal for testing 3D volumetric synthesis and structural clinical utility.

- **OASIS (Open Access Series of Imaging Studies)**
  - [Dataset Link](https://www.oasis-brains.org/)
  - **Why**: Longitudinal MRI data for dementia research.
- **ADNI (Alzheimer's Disease Neuroimaging Initiative)**
  - [Dataset Link](https://adni.loni.usc.edu/)
  - **Why**: The gold standard for neuroimaging research.

---

## 🧪 Testing Workflow with Real Data

1. **Download**: Obtain a subset of the NIH Chest X-ray dataset (approx. 500 images for a quick test).
2. **Upload (Stage 1)**: Drag and drop the `.jpg` or `.png` images into MedSynth's Stage 1.
3. **Train (Stage 2)**: Set the training mode to "High-Fidelity" and monitor the FID score. Aim for a score under 50.
4. **Analyze (Stage 4)**: Verify that the generated images retain the lung field structure without echoing actual patient features.
5. **Export (Stage 5)**: Download the synthetic cohort and train a simple classifier (ResNet) to see if it performs as well as one trained on real data.

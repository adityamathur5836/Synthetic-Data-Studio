from typing import Tuple, List, Dict
import pydicom
import os

PHI_FIELDS = [
    'PatientName', 'PatientID', 'PatientBirthDate', 'PatientAddress',
    'PatientTelephoneNumbers', 'PatientAge', 'InstitutionName'
]

class MedicalValidator:
    @staticmethod
    def validate_dicom(file_path: str) -> Tuple[bool, str]:
        """
        Validates if a file is a valid DICOM medical image.
        Returns: (is_valid, error_message)
        """
        try:
            # Check if file has DICOM header
            with open(file_path, 'rb') as f:
                # DICOM files start with 128 bytes preamble + 4 bytes 'DICM'
                f.seek(128)
                header = f.read(4)
                if header != b'DICM':
                    # Some DICOMs might not have the header but still valid, try reading with pydicom
                    pass
            
            # Use pydicom to fully validate
            dcm = pydicom.dcmread(file_path, stop_before_pixels=True, force=True)
            # Check for critical tags (e.g. Modality)
            if 'Modality' not in dcm:
                return False, "Missing Modality tag in DICOM"
                
            return True, "Valid DICOM"
            
        except Exception as e:
            return False, f"Invalid DICOM file: {str(e)}"

    @staticmethod
    def check_phi(metadata: Dict) -> List[str]:
        """
        Checks extracted metadata for potential PHI leaks.
        Returns list of flagged fields.
        """
        leaks = []
        for key, value in metadata.items():
            if key in PHI_FIELDS and value:
                leaks.append(key)
        return leaks

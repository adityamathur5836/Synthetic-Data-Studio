import os
import shutil
import uuid
import aiofiles
from typing import List, Dict
from datetime import datetime
from fastapi import UploadFile

from .models import Dataset, ProcessingStatus
from .utils.medical_validator import MedicalValidator

UPLOAD_DIR = "backend/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class UploadManager:
    def __init__(self):
        self.active_tasks: Dict[str, Dataset] = {}

    async def save_upload(self, file: UploadFile) -> str:
        """
        Saves uploaded file to a temporary directory.
        """
        file_id = str(uuid.uuid4())
        file_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")
        
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
            
        return file_path

    async def process_dataset(self, task_id: str, files: List[UploadFile]):
        """
        Background task to process a batch of uploaded files.
        """
        # Create task entry
        dataset = Dataset(
            id=task_id,
            name=f"Dataset_{datetime.now().strftime('%Y%m%d_%H%M')}",
            type="Mixed", # Will be updated
            file_count=len(files),
            total_size_bytes=0,
            upload_date=datetime.now(),
            status=ProcessingStatus.UPLOADING
        )
        self.active_tasks[task_id] = dataset
        
        try:
            total_size = 0
            valid_files = 0
            
            for file in files:
                # 1. Save
                file_path = await self.save_upload(file)
                total_size += os.path.getsize(file_path)
                
                # 2. Validate
                if file.filename.lower().endswith('.dcm'):
                    is_valid, msg = MedicalValidator.validate_dicom(file_path)
                    if not is_valid:
                        print(f"Skipping invalid DICOM {file.filename}: {msg}")
                        os.remove(file_path) # Cleanup invalid
                        continue
                        
                valid_files += 1
                dataset.processed_count = valid_files
                
            dataset.total_size_bytes = total_size
            dataset.file_count = valid_files
            dataset.status = ProcessingStatus.COMPLETED
            
        except Exception as e:
            print(f"Error processing upload task {task_id}: {e}")
            dataset.status = ProcessingStatus.ERROR

    def get_status(self, task_id: str):
        return self.active_tasks.get(task_id)

upload_manager = UploadManager()

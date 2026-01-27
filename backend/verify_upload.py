import asyncio
from fastapi import UploadFile
import os
import sys

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.upload_manager import upload_manager, Dataset, ProcessingStatus
from backend.utils.image_processor import ImageProcessor

async def test_upload_pipeline():
    print("Testing Medical Upload Pipeline...")
    
    # 1. Create a dummy image file
    test_filename = "test_image.png"
    with open(test_filename, "wb") as f:
        # Create a tiny 1x1 black png
        f.write(b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82')
    
    # Mock UploadFile
    class MockUploadFile:
        def __init__(self, filename):
            self.filename = filename 
        async def read(self):
            with open(self.filename, "rb") as f:
                return f.read()

    # 2. Process Upload
    task_id = "test_task_123"
    files = [MockUploadFile(test_filename)]
    
    print(f"Uploading batch with ID: {task_id}")
    await upload_manager.process_dataset(task_id, files)
    
    # 3. Verify Status
    dataset = upload_manager.get_status(task_id)
    print(f"Task Status: {dataset.status}")
    print(f"Files Processed: {dataset.processed_count}")
    
    assert dataset.status == ProcessingStatus.COMPLETED
    assert dataset.file_count == 1
    assert dataset.processed_count == 1
    
    # 4. Test Image Processor
    print("Testing Image Processor...")
    # Find the uploaded file in backend/uploads
    uploaded_files = os.listdir("backend/uploads")
    latest_file = [f for f in uploaded_files if f.endswith(test_filename)][0]
    full_path = os.path.join("backend/uploads", latest_file)
    
    thumbnail = ImageProcessor.process_image(full_path)
    assert thumbnail is not None
    assert len(thumbnail) > 0
    print("Thumbnail generated successfully.")
    
    # Cleanup
    os.remove(test_filename)
    # Don't delete upload dir content to allow inspection if needed
    
    print("\nVerification Passed!")

if __name__ == "__main__":
    asyncio.run(test_upload_pipeline())

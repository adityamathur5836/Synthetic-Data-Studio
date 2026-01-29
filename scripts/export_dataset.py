import os
import shutil
import zipfile
from datetime import datetime

def export_for_colab(uploads_dir="backend/uploads", output_dir="generated"):
    """
    Finds all uploaded images and packages them into a ZIP file for Google Colab.
    """
    if not os.path.exists(uploads_dir):
        print(f"❌ Error: Uploads directory '{uploads_dir}' not found.")
        return

    # Create output dir if not exists
    os.makedirs(output_dir, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    zip_filename = os.path.join(output_dir, f"medical_dataset_{timestamp}.zip")
    
    # Count files
    files_to_zip = []
    for root, _, files in os.walk(uploads_dir):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.dcm')):
                files_to_zip.append(os.path.join(root, file))
    
    if not files_to_zip:
        print("⚠️ No images found in uploads folder. Please upload some files first!")
        return

    print(f"📦 Packaging {len(files_to_zip)} images into {zip_filename}...")
    
    with zipfile.ZipFile(zip_filename, 'w') as zipf:
        for file_path in files_to_zip:
            # Maintain a flat structure for simplicity in Colab
            arcname = os.path.basename(file_path)
            zipf.write(file_path, arcname)
            
    print(f"✅ Export complete! Please upload this file to Google Drive: {zip_filename}")

if __name__ == "__main__":
    export_for_colab()

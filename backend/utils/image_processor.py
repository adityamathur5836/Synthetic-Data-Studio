from PIL import Image
import pydicom
import numpy as np
import io

class ImageProcessor:
    @staticmethod
    def process_image(file_path: str, output_format: str = "PNG") -> bytes:
        """
        Reads a medical image (DICOM or standard), normalizes it, and returns bytes.
        """
        try:
            if file_path.lower().endswith('.dcm'):
                # Handle DICOM
                dcm = pydicom.dcmread(file_path)
                pixel_array = dcm.pixel_array
                
                # Normalize to 0-255 for display
                pixel_array = pixel_array.astype(float)
                pixel_array = (np.maximum(pixel_array, 0) / pixel_array.max()) * 255.0
                pixel_array = np.uint8(pixel_array)
                
                image = Image.fromarray(pixel_array)
            else:
                # Handle standard images
                image = Image.open(file_path)
            
            # Convert to RGB if needed
            if image.mode != 'RGB':
                image = image.convert('RGB')
                
            # Create thumbnail
            image.thumbnail((256, 256))
            
            # Save to bytes
            output = io.BytesIO()
            image.save(output, format=output_format)
            return output.getvalue()
            
        except Exception as e:
            print(f"Error processing image {file_path}: {e}")
            return None

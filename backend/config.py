import os
from pathlib import Path

class Config:
    # Get current working directory
    CURRENT_DIR = Path.cwd()
    
    # Find the AI_Revenue_Leakage_Detection directory
    BASE_DIR = None
    
    # Check if we're already in the project directory
    if CURRENT_DIR.name == 'AI_Revenue_Leakage_Detection':
        BASE_DIR = CURRENT_DIR
    elif CURRENT_DIR.parent.name == 'AI_Revenue_Leakage_Detection':
        BASE_DIR = CURRENT_DIR.parent
    else:
        # Search for the project root in the path
        current_path = CURRENT_DIR
        for _ in range(5):
            if (current_path / 'model').exists() and (current_path / 'backend').exists():
                BASE_DIR = current_path
                break
            current_path = current_path.parent
    
    # Fallback to current directory if not found
    if BASE_DIR is None:
        BASE_DIR = CURRENT_DIR
        # If we're in backend, go up one level
        if BASE_DIR.name == 'backend':
            BASE_DIR = BASE_DIR.parent
    
    # Backend directory
    BACKEND_DIR = BASE_DIR / "backend"
    
    # Upload and output directories - directly in backend
    UPLOAD_DIR = BACKEND_DIR / "uploads" 
    OUTPUT_DIR = BACKEND_DIR / "outputs"
    
    # Model directories
    SUPERMARKET_MODEL_DIR = BASE_DIR / "model" / "super_market" / "saved_models"
    TELECOM_MODEL_DIR = BASE_DIR / "model" / "telecom" / "saved_model"
    
    # Dataset directories
    SUPERMARKET_DATASET_DIR = BASE_DIR / "model" / "super_market" / "dataset"
    TELECOM_DATASET_DIR = BASE_DIR / "model" / "telecom" / "dataset"
    
    # File upload settings
    MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50MB
    ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}
    
    def __init__(self):
        # Create directories if they don't exist
        try:
            os.makedirs(self.UPLOAD_DIR, exist_ok=True)
            os.makedirs(self.OUTPUT_DIR, exist_ok=True)
            
            print(f"Base directory: {self.BASE_DIR}")
            print(f"Upload directory: {self.UPLOAD_DIR}")
            print(f"Output directory: {self.OUTPUT_DIR}")
            print(f"Supermarket models directory: {self.SUPERMARKET_MODEL_DIR}")
            
        except Exception as e:
            print(f"Error creating directories: {e}")
            print(f"Current working directory: {Path.cwd()}")
            print(f"Resolved BASE_DIR: {self.BASE_DIR}")

# Create global config instance
config = Config()
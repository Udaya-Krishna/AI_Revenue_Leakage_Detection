## 2. config.py

import os
from pathlib import Path

class Config:
    # Base paths
    BASE_DIR = Path(__file__).parent.parent
    MODEL_DIR = BASE_DIR / "model"
    UPLOAD_DIR = BASE_DIR / "backend" / "uploads"
    OUTPUT_DIR = BASE_DIR / "backend" / "outputs"
    
    # Model paths
    TELECOM_MODEL_DIR = MODEL_DIR / "telecom" / "saved_model"
    SUPERMARKET_MODEL_DIR = MODEL_DIR / "super_market" / "saved_models"
    
    TELECOM_OUTPUT_DIR = MODEL_DIR / "telecom" / "output_dataset"
    SUPERMARKET_OUTPUT_DIR = MODEL_DIR / "super_market" / "output_datasets"
    
    # Flask config
    MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50MB max file size
    UPLOAD_EXTENSIONS = ['.csv', '.xlsx', '.xls']
    
    # Create directories if they don't exist
    UPLOAD_DIR.mkdir(exist_ok=True)
    OUTPUT_DIR.mkdir(exist_ok=True)

config = Config()

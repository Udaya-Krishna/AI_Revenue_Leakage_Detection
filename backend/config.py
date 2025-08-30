import os
from pathlib import Path

class Config:
    # Base paths
    BASE_DIR = Path(__file__).parent.parent
    MODEL_DIR = BASE_DIR / "model"
    UPLOAD_DIR = BASE_DIR / "backend" / "uploads"
    OUTPUT_DIR = BASE_DIR / "backend" / "outputs"
    
    # Model paths - Updated to match your structure
    TELECOM_MODEL_DIR = MODEL_DIR / "telecom" / "saved_model"
    SUPERMARKET_MODEL_DIR = MODEL_DIR / "super_market" / "saved_models"
    
    TELECOM_OUTPUT_DIR = MODEL_DIR / "telecom" / "output_dataset"
    SUPERMARKET_OUTPUT_DIR = MODEL_DIR / "super_market" / "output_datasets"
    
    # Flask config
    MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50MB max file size
    UPLOAD_EXTENSIONS = ['.csv', '.xlsx', '.xls']
    
    # Create directories if they don't exist
    def __init__(self):
        self.UPLOAD_DIR.mkdir(exist_ok=True)
        self.OUTPUT_DIR.mkdir(exist_ok=True)
        
        # Print paths for debugging
        print(f"Model directory: {self.MODEL_DIR}")
        print(f"Telecom model path: {self.TELECOM_MODEL_DIR}")
        print(f"Supermarket model path: {self.SUPERMARKET_MODEL_DIR}")
        
        # Verify model files exist
        self.verify_model_files()
    
    def verify_model_files(self):
        """Verify that required model files exist"""
        # Telecom model files
        telecom_files = [
            self.TELECOM_MODEL_DIR / "telecom_pipeline.pkl",
            self.TELECOM_MODEL_DIR / "le_anomaly.pkl", 
            self.TELECOM_MODEL_DIR / "le_leakage.pkl"
        ]
        
        # Supermarket model files
        supermarket_files = [
            self.SUPERMARKET_MODEL_DIR / "trained_pipeline.pkl",
            self.SUPERMARKET_MODEL_DIR / "leakage_encoder.pkl",
            self.SUPERMARKET_MODEL_DIR / "anomaly_encoder.pkl"
        ]
        
        print("\n=== Model File Verification ===")
        print("Telecom Models:")
        for file_path in telecom_files:
            exists = file_path.exists()
            print(f"  {'✓' if exists else '✗'} {file_path} {'(EXISTS)' if exists else '(MISSING)'}")
        
        print("\nSupermarket Models:")
        for file_path in supermarket_files:
            exists = file_path.exists()
            print(f"  {'✓' if exists else '✗'} {file_path} {'(EXISTS)' if exists else '(MISSING)'}")
        print("================================\n")

config = Config()
#!/usr/bin/env python3
"""
Backend startup script for AI Revenue Leakage Detection
Run this script to start the backend server with proper error checking
"""

import sys
import os
from pathlib import Path

# Add backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

def check_requirements():
    """Check if all required packages are installed"""
    required_packages = {
        'flask': 'flask',
        'flask-cors': 'flask_cors', 
        'pandas': 'pandas',
        'numpy': 'numpy',
        'scikit-learn': 'sklearn',
        'joblib': 'joblib',
        'plotly': 'plotly',
        'openpyxl': 'openpyxl',
        'xgboost': 'xgboost',
        'lightgbm': 'lightgbm',
        'catboost': 'catboost'
    }
    
    missing_packages = []
    for pip_name, import_name in required_packages.items():
        try:
            __import__(import_name)
        except ImportError:
            missing_packages.append(pip_name)
    
    if missing_packages:
        print("❌ Missing required packages:")
        for pkg in missing_packages:
            print(f"   - {pkg}")
        print("\nInstall missing packages with:")
        print(f"pip install {' '.join(missing_packages)}")
        return False
    
    return True

def check_model_files():
    """Check if model files exist"""
    from config import config
    
    print("\n=== Checking Model Files ===")
    
    # Telecom model files
    telecom_files = [
        config.TELECOM_MODEL_DIR / "telecom_pipeline.pkl",
        config.TELECOM_MODEL_DIR / "le_anomaly.pkl", 
        config.TELECOM_MODEL_DIR / "le_leakage.pkl"
    ]
    
    # Supermarket model files
    supermarket_files = [
        config.SUPERMARKET_MODEL_DIR / "trained_pipeline.pkl",
        config.SUPERMARKET_MODEL_DIR / "leakage_encoder.pkl",
        config.SUPERMARKET_MODEL_DIR / "anomaly_encoder.pkl"
    ]
    
    telecom_ok = all(f.exists() for f in telecom_files)
    supermarket_ok = all(f.exists() for f in supermarket_files)
    
    print(f"Telecom models: {'✅ OK' if telecom_ok else '❌ MISSING'}")
    print(f"Supermarket models: {'✅ OK' if supermarket_ok else '❌ MISSING'}")
    
    if not (telecom_ok or supermarket_ok):
        print("\n❌ No model files found! Please ensure model training is completed.")
        return False
    
    return True

def start_server():
    """Start the Flask server"""
    try:
        print("\n🚀 Starting AI Revenue Leakage Detection Backend...")
        
        # Import and run the app
        from app import app
        app.run(debug=True, host='0.0.0.0', port=5000)
        
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        return False

def main():
    """Main function"""
    print("=== AI Revenue Leakage Detection Backend ===")
    
    # Check requirements
    print("Checking requirements...")
    if not check_requirements():
        sys.exit(1)
    print("✅ All required packages are installed")
    
    # Check model files
    if not check_model_files():
        print("\n⚠️  Some model files are missing, but proceeding anyway...")
    
    # Create directories
    try:
        from config import config
        print("✅ Configuration loaded successfully")
    except Exception as e:
        print(f"❌ Configuration error: {e}")
        sys.exit(1)
    
    # Start server
    start_server()

if __name__ == "__main__":
    main()
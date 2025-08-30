import pickle
import os
import pandas as pd
import numpy as np

def inspect_pickle_file(file_path):
    """Inspect what's inside a pickle file"""
    print(f"\n🔍 Inspecting: {file_path}")
    print("=" * 60)
    
    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        return None
    
    try:
        with open(file_path, 'rb') as f:
            obj = pickle.load(f)
        
        print(f"✅ Successfully loaded")
        print(f"📋 Type: {type(obj)}")
        print(f"📐 Shape/Size: {getattr(obj, 'shape', 'No shape attribute')}")
        
        # Check if it's a model with predict method
        if hasattr(obj, 'predict'):
            print("✅ Has predict method - This is a model/pipeline")
        else:
            print("❌ No predict method - This might be data, not a model")
        
        # Check if it's a numpy array
        if isinstance(obj, np.ndarray):
            print(f"⚠️  This is a numpy array with shape: {obj.shape}")
            print("   This should be a trained model, not an array!")
        
        # Check if it's a pipeline
        if hasattr(obj, 'named_steps'):
            print("✅ This is a Pipeline")
            print(f"   Steps: {list(obj.named_steps.keys())}")
        
        # Check if it's a label encoder
        if hasattr(obj, 'classes_'):
            print("✅ This is a Label Encoder")
            print(f"   Classes: {obj.classes_}")
        
        # Additional info
        if hasattr(obj, '__dict__'):
            attrs = [attr for attr in dir(obj) if not attr.startswith('_')]
            print(f"📝 Main attributes: {attrs[:10]}...")  # Show first 10 attributes
        
        return obj
        
    except Exception as e:
        print(f"❌ Error loading file: {e}")
        return None

def main():
    """Main inspection function"""
    print("🔍 AI Revenue Leakage Detection - Model Inspector")
    print("=" * 60)
    
    # Get current directory and find model folder
    current_dir = os.getcwd()
    print(f"Current directory: {current_dir}")
    
    # Look for model directory
    model_paths = [
        os.path.join(current_dir, 'model'),
        os.path.join(current_dir, '..', 'model'),
        os.path.join(current_dir, 'backend', 'model'),
    ]
    
    model_dir = None
    for path in model_paths:
        if os.path.exists(path):
            model_dir = os.path.abspath(path)
            print(f"✅ Found model directory: {model_dir}")
            break
    
    if not model_dir:
        print("❌ Model directory not found!")
        return
    
    # Inspect supermarket models
    print("\n🛒 SUPERMARKET MODELS")
    print("=" * 60)
    
    sm_model_dir = os.path.join(model_dir, 'super_market', 'saved_models')
    if os.path.exists(sm_model_dir):
        print(f"📁 Supermarket model directory: {sm_model_dir}")
        files = os.listdir(sm_model_dir)
        print(f"📋 Files: {files}")
        
        for file in files:
            if file.endswith('.pkl'):
                file_path = os.path.join(sm_model_dir, file)
                inspect_pickle_file(file_path)
    else:
        print(f"❌ Supermarket model directory not found: {sm_model_dir}")
    
    # Inspect telecom models
    print("\n📞 TELECOM MODELS")
    print("=" * 60)
    
    # Try both possible locations
    tc_paths = [
        os.path.join(model_dir, 'telecom', 'saved_models'),
        os.path.join(model_dir, 'Telecom', 'saved_models'),
        os.path.join(model_dir, 'telecom', 'saved_model'),
        os.path.join(model_dir, 'Telecom', 'saved_model'),
    ]
    
    tc_model_dir = None
    for path in tc_paths:
        if os.path.exists(path):
            tc_model_dir = path
            break
    
    if tc_model_dir:
        print(f"📁 Telecom model directory: {tc_model_dir}")
        files = os.listdir(tc_model_dir)
        print(f"📋 Files: {files}")
        
        for file in files:
            if file.endswith('.pkl'):
                file_path = os.path.join(tc_model_dir, file)
                inspect_pickle_file(file_path)
    else:
        print(f"❌ Telecom model directory not found. Searched: {tc_paths}")

if __name__ == "__main__":
    main()
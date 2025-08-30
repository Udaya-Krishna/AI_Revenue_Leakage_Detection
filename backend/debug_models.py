#!/usr/bin/env python3
"""
Simple script to find where your model files actually are
Run this from your backend directory
"""

import os

def find_model_files():
    print("Searching for model files...")
    
    # Start from current directory and go up to find the model folder
    current = os.getcwd()
    print(f"Starting from: {current}")
    
    # Try different possible locations
    possible_paths = [
        # Same level as backend (most likely)
        os.path.join(os.path.dirname(current), 'model'),
        # In backend directory
        os.path.join(current, 'model'),
        # Two levels up (in case of nested structure)
        os.path.join(os.path.dirname(os.path.dirname(current)), 'model'),
    ]
    
    for path in possible_paths:
        print(f"\nChecking: {path}")
        if os.path.exists(path):
            print(f"✅ FOUND MODEL DIRECTORY: {path}")
            
            # Check supermarket
            sm_path = os.path.join(path, 'super_market', 'saved_models')
            if os.path.exists(sm_path):
                print(f"✅ Supermarket path exists: {sm_path}")
                files = os.listdir(sm_path)
                print(f"   Files: {files}")
            else:
                print(f"❌ Supermarket path missing: {sm_path}")
            
            # Check telecom
            tc_path = os.path.join(path, 'telecom', 'saved_models')
            if os.path.exists(tc_path):
                print(f"✅ Telecom path exists: {tc_path}")
                files = os.listdir(tc_path)
                print(f"   Files: {files}")
            else:
                print(f"❌ Telecom path missing: {tc_path}")
            
            return path
        else:
            print(f"❌ Not found")
    
    print("\n❌ Could not find model directory in any expected location!")
    return None

if __name__ == "__main__":
    find_model_files()
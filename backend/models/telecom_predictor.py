import pandas as pd
import joblib
from pathlib import Path
import numpy as np
import traceback

class TelecomPredictor:
    def __init__(self):
        self.pipeline = None
        self.leakage_encoder = None
        self.anomaly_encoder = None
        self.load_models()
    
    def find_project_root(self):
        """Find the AI_Revenue_Leakage_Detection project root directory"""
        current_path = Path(__file__).parent
        
        for _ in range(5):
            if current_path.name == 'AI_Revenue_Leakage_Detection':
                return current_path
            elif (current_path / 'model' / 'telecom' / 'saved_model').exists():
                return current_path
            current_path = current_path.parent
        
        cwd = Path.cwd()
        if cwd.name == 'AI_Revenue_Leakage_Detection' or (cwd / 'model').exists():
            return cwd
        elif cwd.parent.name == 'AI_Revenue_Leakage_Detection':
            return cwd.parent
        
        return Path.cwd()
    
    def load_models(self):
        """Load trained models and encoders"""
        try:
            project_root = self.find_project_root()
            model_dir = project_root / "model" / "telecom" / "saved_model"
            
            pipeline_path = model_dir / "telecom_pipeline.pkl"
            leakage_encoder_path = model_dir / "le_leakage.pkl"
            anomaly_encoder_path = model_dir / "le_anomaly.pkl"
            
            print(f"Looking for telecom models in: {model_dir}")
            
            if not pipeline_path.exists():
                raise FileNotFoundError(f"Pipeline model not found at {pipeline_path}")
            if not leakage_encoder_path.exists():
                raise FileNotFoundError(f"Leakage encoder not found at {leakage_encoder_path}")
            if not anomaly_encoder_path.exists():
                raise FileNotFoundError(f"Anomaly encoder not found at {anomaly_encoder_path}")
            
            self.pipeline = joblib.load(pipeline_path)
            self.leakage_encoder = joblib.load(leakage_encoder_path)
            self.anomaly_encoder = joblib.load(anomaly_encoder_path)
            
            print("Telecom models loaded successfully")
        
        except Exception as e:
            print(f"Failed to load telecom models: {str(e)}")
            raise Exception(f"Failed to load telecom models: {str(e)}")
    
    def predict(self, df):
        """Make predictions - implement based on your telecom model logic"""
        try:
            # Add your telecom-specific preprocessing here
            # This is a placeholder - you'll need to implement based on your telecom model
            print(f"Making telecom predictions on {len(df)} records...")
            
            # For now, return empty results to prevent crashes
            result_df = df.copy()
            result_df["Leakage_Flag_Pred"] = "No Leakage"
            result_df["Anomaly_Type_Pred"] = "Normal"
            
            return result_df
            
        except Exception as e:
            print(f"Telecom prediction error: {str(e)}")
            raise Exception(f"Telecom prediction failed: {str(e)}")
    
    def separate_outputs(self, df_with_predictions):
        """Separate predictions into different categories"""
        try:
            all_predictions = df_with_predictions
            no_leakage_df = df_with_predictions[df_with_predictions["Leakage_Flag_Pred"] == "No Leakage"]
            anomaly_df = df_with_predictions[df_with_predictions["Leakage_Flag_Pred"] == "Anomaly"]
            
            return {
                "all_predictions": all_predictions,
                "no_leakage": no_leakage_df,
                "anomalies": anomaly_df
            }
        
        except Exception as e:
            print(f"Output separation error: {str(e)}")
            raise Exception(f"Failed to separate outputs: {str(e)}")
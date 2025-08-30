import pandas as pd
import joblib
from pathlib import Path
from config import config
import numpy as np

class TelecomPredictor:
    def __init__(self):
        self.pipeline = None
        self.le_anomaly = None
        self.le_leakage = None
        self.load_models()
    
    def load_models(self):
        """Load trained models and encoders"""
        try:
            model_dir = config.TELECOM_MODEL_DIR
            
            # Check if model files exist
            pipeline_path = model_dir / "telecom_pipeline.pkl"
            le_anomaly_path = model_dir / "le_anomaly.pkl"
            le_leakage_path = model_dir / "le_leakage.pkl"
            
            if not pipeline_path.exists():
                raise FileNotFoundError(f"Pipeline model not found at {pipeline_path}")
            if not le_anomaly_path.exists():
                raise FileNotFoundError(f"Anomaly encoder not found at {le_anomaly_path}")
            if not le_leakage_path.exists():
                raise FileNotFoundError(f"Leakage encoder not found at {le_leakage_path}")
            
            self.pipeline = joblib.load(pipeline_path)
            self.le_anomaly = joblib.load(le_anomaly_path)
            self.le_leakage = joblib.load(le_leakage_path)
            
            print("✅ Telecom models loaded successfully")
        
        except Exception as e:
            print(f"❌ Failed to load telecom models: {str(e)}")
            raise Exception(f"Failed to load telecom models: {str(e)}")
    
    def preprocess_data(self, df):
        """Preprocess input data for prediction"""
        try:
            processed_df = df.copy()
            
            # Feature engineering for dates
            date_cols = ['Billing_date', 'Plan_start_date', 'Plan_end_date']
            
            for col in date_cols:
                if col in processed_df.columns:
                    try:
                        processed_df[col] = pd.to_datetime(processed_df[col], dayfirst=True, errors='coerce')
                        processed_df[col + '_year'] = processed_df[col].dt.year
                        processed_df[col + '_month'] = processed_df[col].dt.month
                        processed_df[col + '_day'] = processed_df[col].dt.day
                        # Fill NaT values with default values
                        processed_df[col + '_year'] = processed_df[col + '_year'].fillna(2023)
                        processed_df[col + '_month'] = processed_df[col + '_month'].fillna(1)
                        processed_df[col + '_day'] = processed_df[col + '_day'].fillna(1)
                    except Exception as e:
                        print(f"Date processing error for {col}: {e}")
                        # Create dummy date features if date parsing fails
                        processed_df[col + '_year'] = 2023
                        processed_df[col + '_month'] = 1
                        processed_df[col + '_day'] = 1
            
            # Drop original date columns
            processed_df = processed_df.drop(columns=date_cols, errors='ignore')
            
            # Drop target columns if they exist
            processed_df = processed_df.drop(columns=['Leakage', 'Anomaly_type'], errors='ignore')
            
            # Handle categorical columns
            for col in processed_df.columns:
                if processed_df[col].dtype == 'object':
                    try:
                        # Try to convert to numeric first
                        processed_df[col] = pd.to_numeric(processed_df[col], errors='coerce')
                    except:
                        # If conversion fails, use label encoding
                        processed_df[col] = pd.Categorical(processed_df[col]).codes
            
            # Fill any remaining NaN values with 0
            processed_df = processed_df.fillna(0)
            
            return processed_df
        
        except Exception as e:
            print(f"Data preprocessing error: {str(e)}")
            raise Exception(f"Data preprocessing failed: {str(e)}")
    
    def predict(self, df):
        """Make predictions on input dataframe"""
        try:
            # Preprocess data
            processed_df = self.preprocess_data(df)
            
            print(f"Input data shape: {processed_df.shape}")
            print(f"Input columns: {list(processed_df.columns)}")
            
            # Make predictions
            y_pred = self.pipeline.predict(processed_df)
            
            print(f"Predictions shape: {y_pred.shape}")
            print(f"Predictions sample: {y_pred[:5] if len(y_pred) > 0 else 'No predictions'}")
            
            # Convert predictions back to original labels
            pred_df = pd.DataFrame(y_pred, columns=['Anomaly_type', 'Leakage'])
            pred_df['Anomaly_type'] = self.le_anomaly.inverse_transform(pred_df['Anomaly_type'])
            pred_df['Leakage'] = self.le_leakage.inverse_transform(pred_df['Leakage'])
            
            # Combine with original data (keeping original dates)
            result_df = pd.concat([df.reset_index(drop=True), pred_df], axis=1)
            
            return result_df
        
        except Exception as e:
            print(f"Prediction error: {str(e)}")
            raise Exception(f"Prediction failed: {str(e)}")
    
    def separate_outputs(self, df_with_predictions):
        """Separate predictions into different categories"""
        try:
            # All predictions
            all_predictions = df_with_predictions
            
            # No leakage data
            no_leakage_df = df_with_predictions[df_with_predictions["Leakage"] == "No"]
            
            # Anomaly data
            anomaly_df = df_with_predictions[df_with_predictions["Leakage"] == "Yes"]
            
            return {
                "all_predictions": all_predictions,
                "no_leakage": no_leakage_df,
                "anomalies": anomaly_df
            }
        
        except Exception as e:
            print(f"Output separation error: {str(e)}")
            raise Exception(f"Failed to separate outputs: {str(e)}")
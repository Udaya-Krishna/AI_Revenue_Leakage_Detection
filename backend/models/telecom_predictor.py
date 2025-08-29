import pandas as pd
import joblib
from pathlib import Path
from config import config

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
            
            self.pipeline = joblib.load(model_dir / "telecom_pipeline.pkl")
            self.le_anomaly = joblib.load(model_dir / "le_anomaly.pkl")
            self.le_leakage = joblib.load(model_dir / "le_leakage.pkl")
            
            print("✅ Telecom models loaded successfully")
        
        except Exception as e:
            raise Exception(f"Failed to load telecom models: {str(e)}")
    
    def preprocess_data(self, df):
        """Preprocess input data for prediction"""
        try:
            processed_df = df.copy()
            
            # Feature engineering for dates
            date_cols = ['Billing_date', 'Plan_start_date', 'Plan_end_date']
            
            for col in date_cols:
                if col in processed_df.columns:
                    processed_df[col] = pd.to_datetime(processed_df[col], dayfirst=True)
                    processed_df[col + '_year'] = processed_df[col].dt.year
                    processed_df[col + '_month'] = processed_df[col].dt.month
                    processed_df[col + '_day'] = processed_df[col].dt.day
            
            # Drop original date columns
            processed_df = processed_df.drop(columns=date_cols, errors='ignore')
            
            # Drop target columns if they exist
            processed_df = processed_df.drop(columns=['Leakage', 'Anomaly_type'], errors='ignore')
            
            return processed_df
        
        except Exception as e:
            raise Exception(f"Data preprocessing failed: {str(e)}")
    
    def predict(self, df):
        """Make predictions on input dataframe"""
        try:
            # Preprocess data
            processed_df = self.preprocess_data(df)
            
            # Make predictions
            y_pred = self.pipeline.predict(processed_df)
            
            # Convert predictions back to original labels
            pred_df = pd.DataFrame(y_pred, columns=['Anomaly_type', 'Leakage'])
            pred_df['Anomaly_type'] = self.le_anomaly.inverse_transform(pred_df['Anomaly_type'])
            pred_df['Leakage'] = self.le_leakage.inverse_transform(pred_df['Leakage'])
            
            # Combine with original data (keeping original dates)
            result_df = pd.concat([df.reset_index(drop=True), pred_df], axis=1)
            
            return result_df
        
        except Exception as e:
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
            raise Exception(f"Failed to separate outputs: {str(e)}")
import pandas as pd
import joblib
from pathlib import Path
from config import config
import numpy as np

class SupermarketPredictor:
    def __init__(self):
        self.pipeline = None
        self.leakage_encoder = None
        self.anomaly_encoder = None
        self.load_models()
    
    def load_models(self):
        """Load trained models and encoders"""
        try:
            model_dir = config.SUPERMARKET_MODEL_DIR
            
            # Check if model files exist
            pipeline_path = model_dir / "trained_pipeline.pkl"
            leakage_encoder_path = model_dir / "leakage_encoder.pkl"
            anomaly_encoder_path = model_dir / "anomaly_encoder.pkl"
            
            if not pipeline_path.exists():
                raise FileNotFoundError(f"Pipeline model not found at {pipeline_path}")
            if not leakage_encoder_path.exists():
                raise FileNotFoundError(f"Leakage encoder not found at {leakage_encoder_path}")
            if not anomaly_encoder_path.exists():
                raise FileNotFoundError(f"Anomaly encoder not found at {anomaly_encoder_path}")
            
            self.pipeline = joblib.load(pipeline_path)
            self.leakage_encoder = joblib.load(leakage_encoder_path)
            self.anomaly_encoder = joblib.load(anomaly_encoder_path)
            
            print("✅ Supermarket models loaded successfully")
        
        except Exception as e:
            print(f"❌ Failed to load supermarket models: {str(e)}")
            raise Exception(f"Failed to load supermarket models: {str(e)}")
    
    def preprocess_data(self, df):
        """Preprocess input data for prediction"""
        try:
            # Create a copy to avoid modifying original
            processed_df = df.copy()
            
            # Create Invoice_Num_Int if Invoice_Number exists
            if 'Invoice_Number' in processed_df.columns:
                processed_df['Invoice_Num_Int'] = processed_df['Invoice_Number'].str.replace("INV", "", regex=False).astype(int)
                processed_df = processed_df.sort_values(by='Invoice_Num_Int').reset_index(drop=True)
            
                # Create Is_Duplicate flag
                processed_df['Is_Duplicate'] = (
                    (processed_df['Invoice_Number'] == processed_df['Invoice_Number'].shift(1)) | 
                    (processed_df['Invoice_Number'] == processed_df['Invoice_Number'].shift(-1))
                ).astype(int)
            else:
                # If Invoice_Number doesn't exist, create dummy columns
                processed_df['Invoice_Num_Int'] = range(len(processed_df))
                processed_df['Is_Duplicate'] = 0
            
            # Create actual_billing_amnt if required columns exist
            required_cols = ["Actual_Amount", "Tax_Amount", "Service_Charge", "Discount_Amount"]
            if all(col in processed_df.columns for col in required_cols):
                processed_df["actual_billing_amnt"] = (
                    processed_df["Actual_Amount"] 
                    + processed_df["Tax_Amount"] 
                    + processed_df["Service_Charge"] 
                    - processed_df["Discount_Amount"]
                )
            elif "Actual_Amount" in processed_df.columns:
                # Use only Actual_Amount if other columns are missing
                processed_df["actual_billing_amnt"] = processed_df["Actual_Amount"]
            else:
                # Create dummy column if no amount columns exist
                processed_df["actual_billing_amnt"] = 0
            
            # Drop target columns if they exist
            processed_df = processed_df.drop(columns=['Leakage_Flag', 'Anomaly_Type'], errors='ignore')
            
            # Drop identifier columns for prediction
            identifier_cols = [
                "Invoice_Number", "Billing_Time", "Service_Category", 
                "Transaction_Type", "Store_Branch", "Cashier_ID", "Supplier_ID"
            ]
            X = processed_df.drop(columns=identifier_cols, errors="ignore")
            
            # Handle any remaining non-numeric columns
            for col in X.columns:
                if X[col].dtype == 'object':
                    try:
                        # Try to convert to numeric
                        X[col] = pd.to_numeric(X[col], errors='coerce')
                    except:
                        # If conversion fails, use label encoding
                        X[col] = pd.Categorical(X[col]).codes
                        
            # Fill any NaN values with 0
            X = X.fillna(0)
            
            return X, processed_df
        
        except Exception as e:
            print(f"Data preprocessing error: {str(e)}")
            raise Exception(f"Data preprocessing failed: {str(e)}")
    
    def predict(self, df):
        """Make predictions on input dataframe"""
        try:
            # Preprocess data
            X, original_df = self.preprocess_data(df)
            
            print(f"Input data shape: {X.shape}")
            print(f"Input columns: {list(X.columns)}")
            
            # Make predictions
            y_pred = self.pipeline.predict(X)
            
            print(f"Predictions shape: {y_pred.shape}")
            print(f"Predictions sample: {y_pred[:5] if len(y_pred) > 0 else 'No predictions'}")
            
            # Decode predictions
            pred_df = pd.DataFrame({
                "Leakage_Flag_Pred": self.leakage_encoder.inverse_transform(y_pred[:, 0]),
                "Anomaly_Type_Pred": self.anomaly_encoder.inverse_transform(y_pred[:, 1])
            })
            
            # Combine with original data
            result_df = pd.concat([original_df.reset_index(drop=True), pred_df], axis=1)
            
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
            no_leakage_df = df_with_predictions[
                df_with_predictions["Leakage_Flag_Pred"] == "No Leakage"
            ]
            
            # Anomaly data
            anomaly_df = df_with_predictions[
                df_with_predictions["Leakage_Flag_Pred"] == "Anomaly"
            ]
            
            return {
                "all_predictions": all_predictions,
                "no_leakage": no_leakage_df,
                "anomalies": anomaly_df
            }
        
        except Exception as e:
            print(f"Output separation error: {str(e)}")
            raise Exception(f"Failed to separate outputs: {str(e)}")
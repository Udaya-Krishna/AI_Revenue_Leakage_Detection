import pandas as pd
import joblib
from pathlib import Path
from config import config

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
            
            self.pipeline = joblib.load(model_dir / "trained_pipeline.pkl")
            self.leakage_encoder = joblib.load(model_dir / "leakage_encoder.pkl")
            self.anomaly_encoder = joblib.load(model_dir / "anomaly_encoder.pkl")
            
            print("✅ Supermarket models loaded successfully")
        
        except Exception as e:
            raise Exception(f"Failed to load supermarket models: {str(e)}")
    
    def preprocess_data(self, df):
        """Preprocess input data for prediction"""
        try:
            # Create a copy to avoid modifying original
            processed_df = df.copy()
            
            # Create Invoice_Num_Int if Invoice_Number exists
            if 'Invoice_Number' in processed_df.columns:
                processed_df['Invoice_Num_Int'] = processed_df['Invoice_Number'].str.replace("INV", "").astype(int)
                processed_df = processed_df.sort_values(by='Invoice_Num_Int').reset_index(drop=True)
            
            # Create Is_Duplicate flag
            if 'Invoice_Number' in processed_df.columns:
                processed_df['Is_Duplicate'] = (
                    (processed_df['Invoice_Number'] == processed_df['Invoice_Number'].shift(1)) | 
                    (processed_df['Invoice_Number'] == processed_df['Invoice_Number'].shift(-1))
                ).astype(int)
            
            # Create actual_billing_amnt if required columns exist
            required_cols = ["Actual_Amount", "Tax_Amount", "Service_Charge", "Discount_Amount"]
            if all(col in processed_df.columns for col in required_cols):
                processed_df["actual_billing_amnt"] = (
                    processed_df["Actual_Amount"] 
                    + processed_df["Tax_Amount"] 
                    + processed_df["Service_Charge"] 
                    - processed_df["Discount_Amount"]
                )
            
            # Drop target columns if they exist
            processed_df = processed_df.drop(columns=['Leakage_Flag', 'Anomaly_Type'], errors='ignore')
            
            # Drop identifier columns for prediction
            identifier_cols = [
                "Invoice_Number", "Billing_Time", "Service_Category", 
                "Transaction_Type", "Store_Branch", "Cashier_ID", "Supplier_ID"
            ]
            X = processed_df.drop(columns=identifier_cols, errors="ignore")
            
            return X, processed_df
        
        except Exception as e:
            raise Exception(f"Data preprocessing failed: {str(e)}")
    
    def predict(self, df):
        """Make predictions on input dataframe"""
        try:
            # Preprocess data
            X, original_df = self.preprocess_data(df)
            
            # Make predictions
            y_pred = self.pipeline.predict(X)
            
            # Decode predictions
            pred_df = pd.DataFrame({
                "Leakage_Flag_Pred": self.leakage_encoder.inverse_transform(y_pred[:, 0]),
                "Anomaly_Type_Pred": self.anomaly_encoder.inverse_transform(y_pred[:, 1])
            })
            
            # Combine with original data
            result_df = pd.concat([original_df.reset_index(drop=True), pred_df], axis=1)
            
            return result_df
        
        except Exception as e:
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
            raise Exception(f"Failed to separate outputs: {str(e)}")
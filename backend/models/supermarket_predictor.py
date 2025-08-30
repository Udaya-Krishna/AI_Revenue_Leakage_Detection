import pandas as pd
import joblib
from pathlib import Path
import numpy as np
import traceback

class SupermarketPredictor:
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
            elif (current_path / 'model' / 'super_market' / 'saved_models').exists():
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
            model_dir = project_root / "model" / "super_market" / "saved_models"
            
            pipeline_path = model_dir / "trained_pipeline.pkl"
            leakage_encoder_path = model_dir / "leakage_encoder.pkl"
            anomaly_encoder_path = model_dir / "anomaly_encoder.pkl"
            
            print(f"Looking for models in: {model_dir}")
            
            if not pipeline_path.exists():
                raise FileNotFoundError(f"Pipeline model not found at {pipeline_path}")
            if not leakage_encoder_path.exists():
                raise FileNotFoundError(f"Leakage encoder not found at {leakage_encoder_path}")
            if not anomaly_encoder_path.exists():
                raise FileNotFoundError(f"Anomaly encoder not found at {anomaly_encoder_path}")
            
            self.pipeline = joblib.load(pipeline_path)
            self.leakage_encoder = joblib.load(leakage_encoder_path)
            self.anomaly_encoder = joblib.load(anomaly_encoder_path)
            
            print("Supermarket models loaded successfully")
        
        except Exception as e:
            print(f"Failed to load supermarket models: {str(e)}")
            raise Exception(f"Failed to load supermarket models: {str(e)}")
    
    def clean_categorical_data(self, series):
        """Clean categorical data to prevent encoding issues"""
        try:
            # Convert to string and handle various problematic values
            series = series.astype(str)
            
            # Replace problematic values
            series = series.replace(['nan', 'NaN', 'None', 'null', ''], 'Unknown')
            
            # Remove leading/trailing whitespace
            series = series.str.strip()
            
            # Handle any remaining NaN-like values
            series = series.fillna('Unknown')
            
            return series
        except Exception as e:
            print(f"Warning: Categorical cleaning failed for series: {e}")
            return pd.Series(['Unknown'] * len(series), index=series.index)
    
    def preprocess_data(self, df):
        """Preprocess input data for prediction with robust categorical handling"""
        try:
            processed_df = df.copy()
            
            print(f"Original data shape: {processed_df.shape}")
            print(f"Original columns: {list(processed_df.columns)}")
            
            # Handle Invoice_Number processing
            if 'Invoice_Number' in processed_df.columns:
                try:
                    processed_df['Invoice_Num_Int'] = processed_df['Invoice_Number'].str.replace("INV", "", regex=False).astype(int)
                    processed_df = processed_df.sort_values(by='Invoice_Num_Int').reset_index(drop=True)
                    
                    processed_df['Is_Duplicate'] = (
                        (processed_df['Invoice_Number'] == processed_df['Invoice_Number'].shift(1)) | 
                        (processed_df['Invoice_Number'] == processed_df['Invoice_Number'].shift(-1))
                    ).astype(int)
                except Exception as e:
                    print(f"Warning: Invoice processing failed: {e}")
                    processed_df['Invoice_Num_Int'] = range(len(processed_df))
                    processed_df['Is_Duplicate'] = 0
            else:
                processed_df['Invoice_Num_Int'] = range(len(processed_df))
                processed_df['Is_Duplicate'] = 0
            
            # Create actual_billing_amnt
            required_cols = ["Actual_Amount", "Tax_Amount", "Service_Charge", "Discount_Amount"]
            if all(col in processed_df.columns for col in required_cols):
                processed_df["actual_billing_amnt"] = (
                    processed_df["Actual_Amount"] 
                    + processed_df["Tax_Amount"] 
                    + processed_df["Service_Charge"] 
                    - processed_df["Discount_Amount"]
                )
            elif "Actual_Amount" in processed_df.columns:
                processed_df["actual_billing_amnt"] = processed_df["Actual_Amount"]
            else:
                processed_df["actual_billing_amnt"] = 0
            
            # Drop target columns if they exist
            processed_df = processed_df.drop(columns=['Leakage_Flag', 'Anomaly_Type'], errors='ignore')
            
            # Store original data
            original_data = processed_df.copy()
            
            # Drop identifier columns for prediction
            identifier_cols = [
                "Invoice_Number", "Billing_Time", "Service_Category", 
                "Transaction_Type", "Store_Branch", "Cashier_ID", "Supplier_ID"
            ]
            X = processed_df.drop(columns=identifier_cols, errors="ignore")
            
            print(f"After dropping identifiers, X shape: {X.shape}")
            print(f"X columns: {list(X.columns)}")
            print(f"X dtypes before cleaning:\n{X.dtypes}")
            
            # Clean each column systematically
            for col in X.columns:
                try:
                    # Check if column should be numeric
                    if col in ['Customer_ID', 'Service_ID', 'Product_Quantity', 'Tax_Amount', 
                              'Actual_Amount', 'Billed_Amount', 'Paid_Amount', 'Balance_Amount', 
                              'Unit_Price', 'Tax_Rate', 'Service_Charge', 'Discount_Amount',
                              'Invoice_Num_Int', 'Is_Duplicate', 'actual_billing_amnt']:
                        # Convert to numeric
                        X[col] = pd.to_numeric(X[col], errors='coerce')
                        X[col] = X[col].fillna(0)
                        X[col] = X[col].replace([np.inf, -np.inf], 0)
                    else:
                        # Handle as categorical - clean thoroughly
                        print(f"Cleaning categorical column: {col}")
                        X[col] = self.clean_categorical_data(X[col])
                        
                        # Additional check for date columns
                        if 'Date' in col or 'date' in col:
                            try:
                                # Convert dates to a numeric representation
                                date_series = pd.to_datetime(X[col], errors='coerce')
                                X[col] = date_series.dt.year.fillna(2024).astype(int)
                            except:
                                # If date conversion fails, use categorical
                                X[col] = self.clean_categorical_data(X[col])
                
                except Exception as e:
                    print(f"Error processing column {col}: {e}")
                    # Set problematic column to safe default
                    if col in ['Customer_ID', 'Service_ID', 'Product_Quantity', 'Tax_Amount', 
                              'Actual_Amount', 'Billed_Amount', 'Paid_Amount', 'Balance_Amount', 
                              'Unit_Price', 'Tax_Rate', 'Service_Charge', 'Discount_Amount',
                              'Invoice_Num_Int', 'Is_Duplicate', 'actual_billing_amnt']:
                        X[col] = 0.0
                    else:
                        X[col] = 'Unknown'
            
            print(f"After cleaning, X dtypes:\n{X.dtypes}")
            
            # Final validation - ensure no mixed types
            for col in X.columns:
                if X[col].dtype == 'object':
                    # Make sure all object columns are truly strings
                    X[col] = X[col].astype(str)
                    # Ensure no NaN strings
                    X[col] = X[col].replace('nan', 'Unknown')
                elif pd.api.types.is_numeric_dtype(X[col]):
                    # Ensure numeric columns are properly numeric
                    X[col] = pd.to_numeric(X[col], errors='coerce').fillna(0)
            
            print("Data preprocessing completed successfully")
            return X, original_data
        
        except Exception as e:
            print(f"Data preprocessing error: {str(e)}")
            print(f"Traceback: {traceback.format_exc()}")
            raise Exception(f"Data preprocessing failed: {str(e)}")
    
    def predict(self, df):
        """Make predictions on input dataframe"""
        try:
            X, original_df = self.preprocess_data(df)
            
            print(f"Making predictions on {X.shape[0]} records...")
            print(f"Final X dtypes:\n{X.dtypes}")
            
            # Additional safety check before prediction
            print("Performing final data validation...")
            
            # Check for any remaining object columns that might cause issues
            object_cols = X.select_dtypes(include=['object']).columns
            if len(object_cols) > 0:
                print(f"Object columns found: {list(object_cols)}")
                for col in object_cols:
                    print(f"Sample values in {col}: {X[col].head().tolist()}")
                    unique_vals = X[col].unique()
                    print(f"Unique values in {col}: {unique_vals[:10]}...")  # Show first 10
            
            # Check for any NaN values
            nan_cols = X.columns[X.isnull().any()].tolist()
            if nan_cols:
                print(f"Columns with NaN values: {nan_cols}")
                X = X.fillna(0)
            
            print("Data validation passed. Making predictions...")
            y_pred = self.pipeline.predict(X)
            
            print(f"Predictions shape: {y_pred.shape}")
            print(f"Sample predictions: {y_pred[:3] if len(y_pred) > 0 else 'No predictions'}")
            
            pred_df = pd.DataFrame({
                "Leakage_Flag_Pred": self.leakage_encoder.inverse_transform(y_pred[:, 0]),
                "Anomaly_Type_Pred": self.anomaly_encoder.inverse_transform(y_pred[:, 1])
            })
            
            result_df = pd.concat([original_df.reset_index(drop=True), pred_df], axis=1)
            
            print(f"Predictions completed. Result shape: {result_df.shape}")
            return result_df
        
        except Exception as e:
            print(f"Prediction error: {str(e)}")
            print(f"Traceback: {traceback.format_exc()}")
            
            # Print additional debugging info
            try:
                print(f"X shape: {X.shape}")
                print(f"X dtypes: {X.dtypes}")
                print(f"X columns: {list(X.columns)}")
                print(f"Sample X values:\n{X.head()}")
            except:
                print("Could not print debugging info")
            
            raise Exception(f"Prediction failed: {str(e)}")
    
    def separate_outputs(self, df_with_predictions):
        """Separate predictions into different categories"""
        try:
            all_predictions = df_with_predictions
            
            no_leakage_df = df_with_predictions[
                df_with_predictions["Leakage_Flag_Pred"] == "No Leakage"
            ]
            
            anomaly_df = df_with_predictions[
                df_with_predictions["Leakage_Flag_Pred"] == "Anomaly"
            ]
            
            print(f"Output separation: Total={len(all_predictions)}, No Leakage={len(no_leakage_df)}, Anomalies={len(anomaly_df)}")
            
            return {
                "all_predictions": all_predictions,
                "no_leakage": no_leakage_df,
                "anomalies": anomaly_df
            }
        
        except Exception as e:
            print(f"Output separation error: {str(e)}")
            raise Exception(f"Failed to separate outputs: {str(e)}")

# Debug function to analyze data types in uploaded file
def debug_uploaded_data(file_path):
    """Debug function to analyze the uploaded data"""
    try:
        df = pd.read_csv(file_path)
        print(f"\n=== DATA DEBUG INFO ===")
        print(f"Shape: {df.shape}")
        print(f"Columns: {list(df.columns)}")
        print(f"Data types:\n{df.dtypes}")
        
        # Check for problematic data
        for col in df.columns:
            if df[col].dtype == 'object':
                print(f"\nCategorical column '{col}':")
                unique_vals = df[col].unique()
                print(f"  Unique values: {unique_vals[:10]}...")
                print(f"  Total unique: {len(unique_vals)}")
                print(f"  NaN count: {df[col].isnull().sum()}")
                
                # Check for mixed types
                sample_vals = df[col].dropna().head(10).tolist()
                val_types = [type(val).__name__ for val in sample_vals]
                print(f"  Sample value types: {set(val_types)}")
        
        print(f"=== END DEBUG INFO ===\n")
        return df
        
    except Exception as e:
        print(f"Debug analysis failed: {e}")
        return None
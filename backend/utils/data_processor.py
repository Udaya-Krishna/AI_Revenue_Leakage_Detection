import pandas as pd
import numpy as np
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

def allowed_file(filename, allowed_extensions={'csv', 'xlsx', 'xls'}):
    """Check if file has allowed extension"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def read_file(filepath):
    """Read CSV or Excel file and return DataFrame"""
    try:
        file_extension = filepath.rsplit('.', 1)[1].lower()
        
        if file_extension == 'csv':
            df = pd.read_csv(filepath, encoding='utf-8')
        elif file_extension in ['xlsx', 'xls']:
            df = pd.read_excel(filepath)
        else:
            raise ValueError(f"Unsupported file format: {file_extension}")
        
        logger.info(f"Successfully read file: {filepath}")
        logger.info(f"Shape: {df.shape}, Columns: {list(df.columns)}")
        
        return df
    except Exception as e:
        logger.error(f"Error reading file {filepath}: {str(e)}")
        raise

def preprocess_supermarket_data(df):
    """Preprocess supermarket data similar to the notebook logic"""
    try:
        logger.info("Starting supermarket data preprocessing...")
        logger.info(f"Original columns: {list(df.columns)}")
        
        # Create a copy to avoid modifying original
        df_processed = df.copy()
        
        # Create Invoice_Num_Int for sorting if Invoice_Number exists
        if 'Invoice_Number' in df_processed.columns:
            # Extract numeric part from invoice numbers
            try:
                df_processed['Invoice_Num_Int'] = df_processed['Invoice_Number'].str.replace("INV", "").astype(int)
            except:
                # Fallback: use row index if conversion fails
                logger.warning("Could not convert Invoice_Number to numeric, using row index")
                df_processed['Invoice_Num_Int'] = range(len(df_processed))
            
            df_processed = df_processed.sort_values(by='Invoice_Num_Int').reset_index(drop=True)
            
            # Create Is_Duplicate flag
            df_processed['Is_Duplicate'] = (
                (df_processed['Invoice_Number'] == df_processed['Invoice_Number'].shift(1)) | 
                (df_processed['Invoice_Number'] == df_processed['Invoice_Number'].shift(-1))
            ).astype(int)
        else:
            # Create dummy Invoice_Num_Int if Invoice_Number doesn't exist
            logger.warning("Invoice_Number column not found, creating dummy Invoice_Num_Int")
            df_processed['Invoice_Num_Int'] = range(len(df_processed))
            df_processed['Is_Duplicate'] = 0
        
        # Calculate actual billing amount if required columns exist
        required_cols = ['Actual_Amount', 'Tax_Amount', 'Service_Charge', 'Discount_Amount']
        if all(col in df_processed.columns for col in required_cols):
            df_processed["actual_billing_amnt"] = (
                df_processed["Actual_Amount"] 
                + df_processed["Tax_Amount"] 
                + df_processed["Service_Charge"] 
                - df_processed["Discount_Amount"]
            )
            logger.info("Calculated actual_billing_amnt column")
        else:
            logger.warning(f"Not all required columns found for billing calculation: {required_cols}")
            # Create dummy billing amount if needed
            if 'actual_billing_amnt' not in df_processed.columns:
                df_processed['actual_billing_amnt'] = 0
        
        # Remove target columns if they exist (for prediction)
        target_cols = ['Leakage_Flag', 'Anomaly_Type']
        df_processed = df_processed.drop(columns=target_cols, errors='ignore')
        
        # Prepare features for model (keep Invoice_Num_Int since model expects it)
        columns_to_drop = [
            "Invoice_Number", "Billing_Time", "Service_Category", 
            "Transaction_Type", "Store_Branch", "Cashier_ID", "Supplier_ID"
            # Note: We're NOT dropping Invoice_Num_Int since the model expects it
        ]
        
        # Only drop columns that actually exist
        existing_columns_to_drop = [col for col in columns_to_drop if col in df_processed.columns]
        X = df_processed.drop(columns=existing_columns_to_drop, errors="ignore")
        
        logger.info(f"Preprocessing complete. Final shape: {X.shape}")
        logger.info(f"Final columns for model: {list(X.columns)}")
        
        # Ensure Invoice_Num_Int is present for the model
        if 'Invoice_Num_Int' not in X.columns:
            logger.warning("Invoice_Num_Int missing from features, adding it back")
            X['Invoice_Num_Int'] = range(len(X))
        
        return X, df_processed
        
    except Exception as e:
        logger.error(f"Error preprocessing supermarket data: {str(e)}")
        raise

def preprocess_telecom_data(df):
    """Preprocess telecom data for prediction"""
    try:
        logger.info("Starting telecom data preprocessing...")
        logger.info(f"Original columns: {list(df.columns)}")
        
        # Create a copy to avoid modifying original
        df_processed = df.copy()
        
        # Handle missing values
        df_processed = df_processed.fillna(0)
        
        # Remove target columns if they exist
        target_cols = ['Revenue_Leakage', 'Anomaly_Type']
        df_processed = df_processed.drop(columns=target_cols, errors='ignore')
        
        # Drop identifier columns that don't help with prediction
        columns_to_drop = [
            "Customer_ID", "Account_Number", "Billing_Date", 
            "Service_Type", "Region", "Agent_ID"
        ]
        
        # Only drop columns that actually exist
        existing_columns_to_drop = [col for col in columns_to_drop if col in df_processed.columns]
        X = df_processed.drop(columns=existing_columns_to_drop, errors="ignore")
        
        logger.info(f"Telecom preprocessing complete. Final shape: {X.shape}")
        logger.info(f"Final columns for model: {list(X.columns)}")
        return X, df_processed
        
    except Exception as e:
        logger.error(f"Error preprocessing telecom data: {str(e)}")
        raise

def generate_summary_statistics(df, predictions_df):
    """Generate summary statistics for the results"""
    try:
        total_records = len(df)
        
        # For supermarket data
        if 'Leakage_Flag_Pred' in predictions_df.columns:
            leakage_counts = predictions_df['Leakage_Flag_Pred'].value_counts()
            anomaly_counts = predictions_df['Anomaly_Type_Pred'].value_counts()
            
            leakage_percentages = (leakage_counts / total_records * 100).round(2)
            anomaly_percentages = (anomaly_counts / total_records * 100).round(2)
            
            summary = {
                'total_records': total_records,
                'leakage_analysis': {
                    'counts': leakage_counts.to_dict(),
                    'percentages': leakage_percentages.to_dict()
                },
                'anomaly_analysis': {
                    'counts': anomaly_counts.to_dict(),
                    'percentages': anomaly_percentages.to_dict()
                }
            }
        
        # For telecom data
        elif 'Revenue_Leakage_Pred' in predictions_df.columns:
            leakage_counts = predictions_df['Revenue_Leakage_Pred'].value_counts()
            anomaly_counts = predictions_df['Anomaly_Type_Pred'].value_counts()
            
            leakage_percentages = (leakage_counts / total_records * 100).round(2)
            anomaly_percentages = (anomaly_counts / total_records * 100).round(2)
            
            summary = {
                'total_records': total_records,
                'leakage_analysis': {
                    'counts': leakage_counts.to_dict(),
                    'percentages': leakage_percentages.to_dict()
                },
                'anomaly_analysis': {
                    'counts': anomaly_counts.to_dict(),
                    'percentages': anomaly_percentages.to_dict()
                }
            }
        
        return summary
        
    except Exception as e:
        logger.error(f"Error generating summary statistics: {str(e)}")
        raise

def get_input_summary(df):
    """Generate input data summary"""
    try:
        summary = {
            'total_rows': len(df),
            'column_count': len(df.columns),
            'columns': list(df.columns),
            'missing_values': df.isnull().sum().to_dict(),
            'data_types': df.dtypes.astype(str).to_dict()
        }
        
        # Add numeric summary for numeric columns
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) > 0:
            summary['numeric_summary'] = df[numeric_cols].describe().to_dict()
        
        return summary
        
    except Exception as e:
        logger.error(f"Error generating input summary: {str(e)}")
        return {'error': str(e)}

def create_output_files_info(df_with_preds, domain_type='supermarket'):
    """Create information about output files that will be generated"""
    try:
        output_files = {}
        
        if domain_type == 'supermarket':
            leakage_col = 'Leakage_Flag_Pred'
            
            # All results
            output_files['all_results'] = {
                'count': len(df_with_preds),
                'description': 'Complete dataset with predictions'
            }
            
            # No leakage records
            no_leakage_df = df_with_preds[df_with_preds[leakage_col] == "No Leakage"]
            output_files['no_leakage'] = {
                'count': len(no_leakage_df),
                'description': 'Records with no revenue leakage detected'
            }
            
            # Anomaly records
            anomaly_df = df_with_preds[df_with_preds[leakage_col] == "Anomaly"]
            output_files['anomaly'] = {
                'count': len(anomaly_df),
                'description': 'Records with revenue leakage/anomalies detected'
            }
        
        elif domain_type == 'telecom':
            leakage_col = 'Revenue_Leakage_Pred'
            
            # All results
            output_files['all_results'] = {
                'count': len(df_with_preds),
                'description': 'Complete dataset with predictions'
            }
            
            # No leakage records
            no_leakage_df = df_with_preds[df_with_preds[leakage_col] == "No"]
            output_files['no_leakage'] = {
                'count': len(no_leakage_df),
                'description': 'Records with no revenue leakage detected'
            }
            
            # Leakage records
            leakage_df = df_with_preds[df_with_preds[leakage_col] == "Yes"]
            output_files['leakage'] = {
                'count': len(leakage_df),
                'description': 'Records with revenue leakage detected'
            }
        
        return output_files
        
    except Exception as e:
        logger.error(f"Error creating output files info: {str(e)}")
        return {}

def save_output_files(df_with_preds, session_id, output_folder, domain_type='supermarket'):
    """Save the output files and return file paths"""
    try:
        import os
        saved_files = {}
        
        if domain_type == 'supermarket':
            leakage_col = 'Leakage_Flag_Pred'
            
            # Save all results
            all_results_filename = f"{session_id}_supermarket_all_results.csv"
            all_results_path = os.path.join(output_folder, all_results_filename)
            df_with_preds.to_csv(all_results_path, index=False)
            saved_files['all_results'] = all_results_filename
            
            # Save no leakage records
            no_leakage_df = df_with_preds[df_with_preds[leakage_col] == "No Leakage"]
            no_leakage_filename = f"{session_id}_supermarket_no_leakage.csv"
            no_leakage_path = os.path.join(output_folder, no_leakage_filename)
            no_leakage_df.to_csv(no_leakage_path, index=False)
            saved_files['no_leakage'] = no_leakage_filename
            
            # Save anomaly records
            anomaly_df = df_with_preds[df_with_preds[leakage_col] == "Anomaly"]
            anomaly_filename = f"{session_id}_supermarket_anomaly.csv"
            anomaly_path = os.path.join(output_folder, anomaly_filename)
            anomaly_df.to_csv(anomaly_path, index=False)
            saved_files['anomaly'] = anomaly_filename
        
        elif domain_type == 'telecom':
            leakage_col = 'Revenue_Leakage_Pred'
            
            # Save all results
            all_results_filename = f"{session_id}_telecom_all_results.csv"
            all_results_path = os.path.join(output_folder, all_results_filename)
            df_with_preds.to_csv(all_results_path, index=False)
            saved_files['all_results'] = all_results_filename
            
            # Save no leakage records
            no_leakage_df = df_with_preds[df_with_preds[leakage_col] == "No"]
            no_leakage_filename = f"{session_id}_telecom_no_leakage.csv"
            no_leakage_path = os.path.join(output_folder, no_leakage_filename)
            no_leakage_df.to_csv(no_leakage_path, index=False)
            saved_files['no_leakage'] = no_leakage_filename
            
            # Save leakage records
            leakage_df = df_with_preds[df_with_preds[leakage_col] == "Yes"]
            leakage_filename = f"{session_id}_telecom_leakage.csv"
            leakage_path = os.path.join(output_folder, leakage_filename)
            leakage_df.to_csv(leakage_path, index=False)
            saved_files['leakage'] = leakage_filename
        
        return saved_files
        
    except Exception as e:
        logger.error(f"Error saving output files: {str(e)}")
        raise
def preprocess_telecom_data(df):
    """Preprocess telecom data for prediction - matches training logic"""
    try:
        logger.info("Starting telecom data preprocessing...")
        logger.info(f"Original columns: {list(df.columns)}")
        
        # Create a copy to avoid modifying original
        df_processed = df.copy()
        
        # Feature engineering for date columns (same as training)
        date_columns = ['Billing_date', 'Plan_start_date', 'Plan_end_date']
        for col in date_columns:
            if col in df_processed.columns:
                try:
                    df_processed[col] = pd.to_datetime(df_processed[col], dayfirst=True)
                    df_processed[col + '_year'] = df_processed[col].dt.year
                    df_processed[col + '_month'] = df_processed[col].dt.month
                    df_processed[col + '_day'] = df_processed[col].dt.day
                    logger.info(f"Processed date column: {col}")
                except Exception as e:
                    logger.warning(f"Could not process date column {col}: {str(e)}")
        
        # Drop original date columns after feature extraction
        df_processed = df_processed.drop(columns=date_columns, errors='ignore')
        
        # Handle missing values
        df_processed = df_processed.fillna(0)
        
        # Remove target columns if they exist
        target_cols = ['Revenue_Leakage', 'Anomaly_Type', 'Leakage', 'Anomaly_type']
        df_processed = df_processed.drop(columns=target_cols, errors='ignore')
        
        # Drop identifier columns that don't help with prediction
        columns_to_drop = [
            "Customer_ID", "Account_Number", "Billing_Date", 
            "Service_Type", "Region", "Agent_ID"
        ]
        
        # Only drop columns that actually exist
        existing_columns_to_drop = [col for col in columns_to_drop if col in df_processed.columns]
        X = df_processed.drop(columns=existing_columns_to_drop, errors="ignore")
        
        # Ensure all columns are numeric for the model
        for col in X.columns:
            if X[col].dtype == 'object':
                try:
                    X[col] = pd.to_numeric(X[col], errors='coerce')
                    X[col] = X[col].fillna(0)
                    logger.info(f"Converted {col} to numeric")
                except:
                    logger.warning(f"Could not convert column {col} to numeric")
        
        logger.info(f"Telecom preprocessing complete. Final shape: {X.shape}")
        logger.info(f"Final columns for model: {list(X.columns)}")
        return X, df_processed
        
    except Exception as e:
        logger.error(f"Error preprocessing telecom data: {str(e)}")
        raise
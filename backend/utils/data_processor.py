import pandas as pd
import numpy as np

def get_data_summary(df):
    """Generate data summary statistics"""
    try:
        summary = {
            "total_records": len(df),
            "columns": list(df.columns),
            "column_count": len(df.columns),
            "missing_values": df.isnull().sum().to_dict(),
            "data_types": df.dtypes.astype(str).to_dict(),
            "numeric_summary": {}
        }
        
        # Numeric columns summary
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            summary["numeric_summary"][col] = {
                "mean": float(df[col].mean()) if not df[col].isna().all() else None,
                "median": float(df[col].median()) if not df[col].isna().all() else None,
                "std": float(df[col].std()) if not df[col].isna().all() else None,
                "min": float(df[col].min()) if not df[col].isna().all() else None,
                "max": float(df[col].max()) if not df[col].isna().all() else None
            }
        
        return summary
    
    except Exception as e:
        raise Exception(f"Failed to generate data summary: {str(e)}")

def get_prediction_summary(df_with_predictions, domain):
    """Generate prediction summary based on domain"""
    try:
        if domain == "supermarket":
            leakage_col = "Leakage_Flag_Pred"
            anomaly_col = "Anomaly_Type_Pred"
        else:  # telecom
            leakage_col = "Leakage"
            anomaly_col = "Anomaly_type"
        
        total_records = len(df_with_predictions)
        
        # Leakage analysis
        leakage_counts = df_with_predictions[leakage_col].value_counts().to_dict()
        
        # Anomaly analysis
        anomaly_counts = df_with_predictions[anomaly_col].value_counts().to_dict()
        
        # Calculate percentages
        leakage_percentages = {k: (v/total_records)*100 for k, v in leakage_counts.items()}
        anomaly_percentages = {k: (v/total_records)*100 for k, v in anomaly_counts.items()}
        
        summary = {
            "total_records": total_records,
            "leakage_analysis": {
                "counts": leakage_counts,
                "percentages": leakage_percentages
            },
            "anomaly_analysis": {
                "counts": anomaly_counts,
                "percentages": anomaly_percentages
            }
        }
        
        # Risk assessment
        if domain == "supermarket":
            high_risk = df_with_predictions[df_with_predictions[leakage_col] == "Anomaly"]
        else:
            high_risk = df_with_predictions[df_with_predictions[leakage_col] == "Yes"]
        
        summary["risk_assessment"] = {
            "high_risk_count": len(high_risk),
            "high_risk_percentage": (len(high_risk)/total_records)*100 if total_records > 0 else 0
        }
        
        return summary
    
    except Exception as e:
        raise Exception(f"Failed to generate prediction summary: {str(e)}")
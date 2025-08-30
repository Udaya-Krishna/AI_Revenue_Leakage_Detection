from flask import Blueprint, request, jsonify, send_file
import os
import uuid
import pandas as pd
from models.telecom_predictor import TelecomPredictor
from utils.file_handler import allowed_file, save_uploaded_file, load_dataframe, save_output_csv, cleanup_file
from utils.data_processor import get_data_summary, get_prediction_summary
from utils.visualization import generate_visualization_data
from config import config

telecom_bp = Blueprint('telecom', __name__)

# Initialize predictor
try:
    predictor = TelecomPredictor()
except Exception as e:
    print(f"❌ Failed to initialize telecom predictor: {e}")
    predictor = None

@telecom_bp.route('/predict', methods=['POST'])
def predict():
    """Handle telecom prediction requests"""
    uploaded_filepath = None
    
    try:
        if predictor is None:
            return jsonify({"error": "Telecom model not available"}), 500
        
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid file type. Only CSV and Excel files are allowed"}), 400
        
        # Save uploaded file
        uploaded_filepath, filename = save_uploaded_file(file, "telecom")
        
        # Load dataframe
        input_df = load_dataframe(uploaded_filepath)
        
        # Get input data summary
        input_summary = get_data_summary(input_df)
        
        # Make predictions
        predictions_df = predictor.predict(input_df)
        
        # Get prediction summary
        prediction_summary = get_prediction_summary(predictions_df, "telecom")
        
        # Generate visualizations
        visualizations = generate_visualization_data(predictions_df, "telecom")
        
        # Separate outputs
        separated_outputs = predictor.separate_outputs(predictions_df)
        
        # Save output files
        session_id = str(uuid.uuid4())
        output_files = {}
        
        for output_type, df in separated_outputs.items():
            if not df.empty:
                output_filename = f"telecom_{output_type}_{session_id}.csv"
                output_path = save_output_csv(df, output_filename, config.OUTPUT_DIR)
                output_files[output_type] = {
                    "filename": output_filename,
                    "path": output_path,
                    "count": len(df)
                }
        
        # Cleanup uploaded file
        cleanup_file(uploaded_filepath)
        
        response = {
            "success": True,
            "session_id": session_id,
            "input_summary": input_summary,
            "prediction_summary": prediction_summary,
            "visualizations": visualizations,
            "output_files": output_files,
            "message": f"Successfully processed {len(predictions_df)} records"
        }
        
        return jsonify(response)
    
    except Exception as e:
        # Cleanup on error
        if uploaded_filepath:
            cleanup_file(uploaded_filepath)
        
        return jsonify({
            "error": f"Prediction failed: {str(e)}",
            "success": False
        }), 500

@telecom_bp.route('/download/<output_type>/<session_id>', methods=['GET'])
def download_output(output_type, session_id):
    """Download output files"""
    try:
        filename = f"telecom_{output_type}_{session_id}.csv"
        filepath = config.OUTPUT_DIR / filename
        
        if not filepath.exists():
            return jsonify({"error": "File not found"}), 404
        
        return send_file(
            filepath,
            as_attachment=True,
            download_name=f"telecom_{output_type}.csv",
            mimetype='text/csv'
        )
    
    except Exception as e:
        return jsonify({"error": f"Download failed: {str(e)}"}), 500

@telecom_bp.route('/generate-report/<session_id>', methods=['POST'])
def generate_report(session_id):
    """Generate comprehensive report"""
    try:
        # Find all output files for this session
        output_files = list(config.OUTPUT_DIR.glob(f"telecom_*_{session_id}.csv"))
        
        if not output_files:
            return jsonify({"error": "No data found for report generation"}), 404
        
        # Load all predictions file
        predictions_file = None
        for file in output_files:
            if "all_predictions" in file.name:
                predictions_file = file
                break
        
        if not predictions_file:
            return jsonify({"error": "Predictions file not found"}), 404
        
        # Load predictions dataframe
        df = pd.read_csv(predictions_file)
        
        # Generate comprehensive summary
        total_records = len(df)
        leakage_count = len(df[df["Leakage"] == "Yes"])
        no_leakage_count = len(df[df["Leakage"] == "No"])
        
        # Anomaly type breakdown
        anomaly_types = df["Anomaly_type"].value_counts().to_dict()
        
        # Financial impact estimation (if amount columns exist)
        financial_impact = {}
        amount_cols = [col for col in df.columns if 'amount' in col.lower() or 'cost' in col.lower()]
        if amount_cols:
            leakage_df = df[df["Leakage"] == "Yes"]
            if not leakage_df.empty:
                for col in amount_cols:
                    if pd.api.types.is_numeric_dtype(df[col]):
                        financial_impact[col] = {
                            "total_at_risk": float(leakage_df[col].sum()),
                            "average_leakage_amount": float(leakage_df[col].mean())
                        }
        
        report_data = {
            "session_id": session_id,
            "generated_at": pd.Timestamp.now().isoformat(),
            "summary": {
                "total_records": total_records,
                "leakage_count": leakage_count,
                "no_leakage_count": no_leakage_count,
                "leakage_rate": (leakage_count / total_records) * 100 if total_records > 0 else 0
            },
            "anomaly_breakdown": anomaly_types,
            "financial_impact": financial_impact,
            "recommendations": [
                "Investigate all records marked with 'Yes' for revenue leakage",
                "Focus on high-value transactions showing anomalies",
                "Review billing processes for identified anomaly patterns",
                "Implement real-time monitoring for detected leakage types"
            ]
        }
        
        return jsonify({
            "success": True,
            "report": report_data
        })
    
    except Exception as e:
        return jsonify({"error": f"Report generation failed: {str(e)}"}), 500

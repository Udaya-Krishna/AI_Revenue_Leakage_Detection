from flask import Blueprint, request, jsonify, send_file
import os
import uuid
from models.supermarket_predictor import SupermarketPredictor
from utils.file_handler import allowed_file, save_uploaded_file, load_dataframe, save_output_csv, cleanup_file
from utils.data_processor import get_data_summary, get_prediction_summary
from utils.visualization import generate_visualization_data
from config import config

supermarket_bp = Blueprint('supermarket', __name__)

# Initialize predictor
try:
    predictor = SupermarketPredictor()
except Exception as e:
    print(f"❌ Failed to initialize supermarket predictor: {e}")
    predictor = None

@supermarket_bp.route('/predict', methods=['POST'])
def predict():
    """Handle supermarket prediction requests"""
    uploaded_filepath = None
    
    try:
        if predictor is None:
            return jsonify({"error": "Supermarket model not available"}), 500
        
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid file type. Only CSV and Excel files are allowed"}), 400
        
        # Save uploaded file
        uploaded_filepath, filename = save_uploaded_file(file, "supermarket")
        
        # Load dataframe
        input_df = load_dataframe(uploaded_filepath)
        
        # Get input data summary
        input_summary = get_data_summary(input_df)
        
        # Make predictions
        predictions_df = predictor.predict(input_df)
        
        # Get prediction summary
        prediction_summary = get_prediction_summary(predictions_df, "supermarket")
        
        # Generate visualizations
        visualizations = generate_visualization_data(predictions_df, "supermarket")
        
        # Separate outputs
        separated_outputs = predictor.separate_outputs(predictions_df)
        
        # Save output files
        session_id = str(uuid.uuid4())
        output_files = {}
        
        for output_type, df in separated_outputs.items():
            if not df.empty:
                output_filename = f"supermarket_{output_type}_{session_id}.csv"
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

@supermarket_bp.route('/download/<output_type>/<session_id>', methods=['GET'])
def download_output(output_type, session_id):
    """Download output files"""
    try:
        filename = f"supermarket_{output_type}_{session_id}.csv"
        filepath = config.OUTPUT_DIR / filename
        
        if not filepath.exists():
            return jsonify({"error": "File not found"}), 404
        
        return send_file(
            filepath,
            as_attachment=True,
            download_name=f"supermarket_{output_type}.csv",
            mimetype='text/csv'
        )
    
    except Exception as e:
        return jsonify({"error": f"Download failed: {str(e)}"}), 500

@supermarket_bp.route('/generate-report/<session_id>', methods=['POST'])
def generate_report(session_id):
    """Generate comprehensive report"""
    try:
        # Find all output files for this session
        output_files = list(config.OUTPUT_DIR.glob(f"supermarket_*_{session_id}.csv"))
        
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
        anomaly_count = len(df[df["Leakage_Flag_Pred"] == "Anomaly"])
        no_leakage_count = len(df[df["Leakage_Flag_Pred"] == "No Leakage"])
        
        # Anomaly type breakdown
        anomaly_types = df["Anomaly_Type_Pred"].value_counts().to_dict()
        
        # Financial impact estimation (if amount columns exist)
        financial_impact = {}
        if "Actual_Amount" in df.columns:
            anomaly_df = df[df["Leakage_Flag_Pred"] == "Anomaly"]
            financial_impact = {
                "total_at_risk": float(anomaly_df["Actual_Amount"].sum()) if not anomaly_df.empty else 0,
                "average_anomaly_amount": float(anomaly_df["Actual_Amount"].mean()) if not anomaly_df.empty else 0
            }
        
        report_data = {
            "session_id": session_id,
            "generated_at": pd.Timestamp.now().isoformat(),
            "summary": {
                "total_records": total_records,
                "anomaly_count": anomaly_count,
                "no_leakage_count": no_leakage_count,
                "anomaly_rate": (anomaly_count / total_records) * 100 if total_records > 0 else 0
            },
            "anomaly_breakdown": anomaly_types,
            "financial_impact": financial_impact,
            "recommendations": [
                "Review all records marked as 'Anomaly' for potential revenue leakage",
                "Implement additional controls for high-risk transaction types",
                "Monitor duplicate invoice patterns",
                "Regular auditing of billing processes recommended"
            ]
        }
        
        return jsonify({
            "success": True,
            "report": report_data
        })
    
    except Exception as e:
        return jsonify({"error": f"Report generation failed: {str(e)}"}), 500

from flask import Flask, request, jsonify, send_file, render_template_string
from flask_cors import CORS
import os
import uuid
import pandas as pd
from pathlib import Path
from werkzeug.utils import secure_filename
from supermarket_predictor_simple import SimpleSupermarketPredictor

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size

# Enable CORS
CORS(app)

# Initialize predictor
try:
    predictor = SimpleSupermarketPredictor()
    print("✅ Predictor initialized successfully")
except Exception as e:
    print(f"❌ Failed to initialize predictor: {e}")
    predictor = None

# Create upload and output directories
UPLOAD_DIR = Path("uploads")
OUTPUT_DIR = Path("outputs")
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ['csv', 'xlsx', 'xls']

def load_dataframe(filepath):
    """Load dataframe from file path"""
    try:
        file_extension = Path(filepath).suffix.lower()
        
        if file_extension == '.csv':
            df = pd.read_csv(filepath)
        elif file_extension in ['.xlsx', '.xls']:
            df = pd.read_excel(filepath)
        else:
            raise ValueError(f"Unsupported file format: {file_extension}")
        
        return df
    
    except Exception as e:
        raise Exception(f"Failed to load dataframe: {str(e)}")

def save_output_csv(df, filename, output_dir):
    """Save dataframe as CSV to output directory"""
    try:
        filepath = Path(output_dir) / filename
        df.to_csv(filepath, index=False)
        return str(filepath)
    
    except Exception as e:
        raise Exception(f"Failed to save output CSV: {str(e)}")

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
        numeric_cols = df.select_dtypes(include=['number']).columns
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

def get_prediction_summary(df_with_predictions):
    """Generate prediction summary"""
    try:
        total_records = len(df_with_predictions)
        
        # Leakage analysis
        leakage_counts = df_with_predictions["Leakage_Flag_Pred"].value_counts().to_dict()
        
        # Anomaly analysis
        anomaly_counts = df_with_predictions["Anomaly_Type_Pred"].value_counts().to_dict()
        
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
        high_risk = df_with_predictions[df_with_predictions["Leakage_Flag_Pred"] == "Anomaly"]
        
        summary["risk_assessment"] = {
            "high_risk_count": len(high_risk),
            "high_risk_percentage": (len(high_risk)/total_records)*100 if total_records > 0 else 0
        }
        
        return summary
    
    except Exception as e:
        raise Exception(f"Failed to generate prediction summary: {str(e)}")

@app.route('/')
def index():
    """Serve the HTML interface"""
    html_template = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Supermarket Revenue Leakage Detection</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 {
                color: #2c3e50;
                text-align: center;
                margin-bottom: 30px;
            }
            .upload-section {
                border: 2px dashed #3498db;
                padding: 40px;
                text-align: center;
                border-radius: 10px;
                margin-bottom: 20px;
            }
            .upload-section:hover {
                border-color: #2980b9;
                background-color: #f8f9fa;
            }
            input[type="file"] {
                margin: 10px 0;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                width: 100%;
                max-width: 400px;
            }
            button {
                background-color: #3498db;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                margin: 10px 5px;
            }
            button:hover {
                background-color: #2980b9;
            }
            button:disabled {
                background-color: #bdc3c7;
                cursor: not-allowed;
            }
            .results {
                margin-top: 30px;
                display: none;
            }
            .summary-cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            .card {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #3498db;
            }
            .card h3 {
                margin: 0 0 10px 0;
                color: #2c3e50;
            }
            .card p {
                margin: 5px 0;
                font-size: 14px;
            }
            .anomaly {
                border-left-color: #e74c3c;
            }
            .clean {
                border-left-color: #27ae60;
            }
            .download-section {
                background: #ecf0f1;
                padding: 20px;
                border-radius: 8px;
                margin-top: 20px;
            }
            .error {
                background-color: #f8d7da;
                color: #721c24;
                padding: 10px;
                border-radius: 5px;
                margin: 10px 0;
            }
            .success {
                background-color: #d4edda;
                color: #155724;
                padding: 10px;
                border-radius: 5px;
                margin: 10px 0;
            }
            .loading {
                display: none;
                text-align: center;
                margin: 20px 0;
            }
            .spinner {
                border: 4px solid #f3f3f3;
                border-top: 4px solid #3498db;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 0 auto;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🛒 Supermarket Revenue Leakage Detection</h1>
            
            <div class="upload-section">
                <h2>Upload Your Dataset</h2>
                <p>Upload a CSV or Excel file containing supermarket billing data</p>
                <input type="file" id="fileInput" accept=".csv,.xlsx,.xls">
                <br>
                <button onclick="uploadFile()" id="uploadBtn">Analyze for Revenue Leakage</button>
            </div>

            <div class="loading" id="loading">
                <div class="spinner"></div>
                <p>Processing your data... This may take a few moments.</p>
            </div>

            <div id="error" class="error" style="display: none;"></div>
            <div id="success" class="success" style="display: none;"></div>

            <div class="results" id="results">
                <h2>Analysis Results</h2>
                
                <div class="summary-cards" id="summaryCards">
                    <!-- Summary cards will be populated here -->
                </div>

                <div class="download-section">
                    <h3>Download Results</h3>
                    <button onclick="downloadFile('all_predictions')">Download All Predictions</button>
                    <button onclick="downloadFile('no_leakage')">Download Clean Records</button>
                    <button onclick="downloadFile('anomalies')">Download Anomalies</button>
                </div>
            </div>
        </div>

        <script>
            let currentSessionId = null;

            function uploadFile() {
                const fileInput = document.getElementById('fileInput');
                const file = fileInput.files[0];
                
                if (!file) {
                    showError('Please select a file first');
                    return;
                }

                const formData = new FormData();
                formData.append('file', file);

                showLoading(true);
                hideError();
                hideSuccess();

                fetch('/predict', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    showLoading(false);
                    if (data.success) {
                        currentSessionId = data.session_id;
                        showResults(data);
                        showSuccess('Analysis completed successfully!');
                    } else {
                        showError(data.error || 'Analysis failed');
                    }
                })
                .catch(error => {
                    showLoading(false);
                    showError('Failed to connect to server. Please try again.');
                    console.error('Error:', error);
                });
            }

            function showResults(data) {
                const resultsDiv = document.getElementById('results');
                const summaryCards = document.getElementById('summaryCards');
                
                const summary = data.prediction_summary;
                
                summaryCards.innerHTML = `
                    <div class="card">
                        <h3>📊 Total Records</h3>
                        <p><strong>${summary.total_records.toLocaleString()}</strong></p>
                        <p>Records processed</p>
                    </div>
                    <div class="card anomaly">
                        <h3>⚠️ Anomalies Detected</h3>
                        <p><strong>${summary.leakage_analysis.counts.Anomaly || 0}</strong></p>
                        <p>${(summary.leakage_analysis.percentages.Anomaly || 0).toFixed(1)}% of total</p>
                    </div>
                    <div class="card clean">
                        <h3>✅ Clean Records</h3>
                        <p><strong>${summary.leakage_analysis.counts['No Leakage'] || 0}</strong></p>
                        <p>${(summary.leakage_analysis.percentages['No Leakage'] || 0).toFixed(1)}% of total</p>
                    </div>
                    <div class="card">
                        <h3>🎯 Risk Level</h3>
                        <p><strong>${summary.risk_assessment.high_risk_percentage.toFixed(1)}%</strong></p>
                        <p>High risk transactions</p>
                    </div>
                `;
                
                resultsDiv.style.display = 'block';
            }

            function downloadFile(outputType) {
                if (!currentSessionId) {
                    showError('No analysis session found');
                    return;
                }

                window.open(`/download/${outputType}/${currentSessionId}`, '_blank');
            }

            function showLoading(show) {
                document.getElementById('loading').style.display = show ? 'block' : 'none';
                document.getElementById('uploadBtn').disabled = show;
            }

            function showError(message) {
                const errorDiv = document.getElementById('error');
                errorDiv.textContent = message;
                errorDiv.style.display = 'block';
            }

            function hideError() {
                document.getElementById('error').style.display = 'none';
            }

            function showSuccess(message) {
                const successDiv = document.getElementById('success');
                successDiv.textContent = message;
                successDiv.style.display = 'block';
            }

            function hideSuccess() {
                document.getElementById('success').style.display = 'none';
            }
        </script>
    </body>
    </html>
    """
    return html_template

@app.route('/predict', methods=['POST'])
def predict():
    """Handle prediction requests"""
    uploaded_filepath = None
    
    try:
        if predictor is None:
            return jsonify({"error": "Model not available"}), 500
        
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid file type. Only CSV and Excel files are allowed"}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        file_id = str(uuid.uuid4())
        file_extension = filename.rsplit('.', 1)[1].lower()
        new_filename = f"upload_{file_id}.{file_extension}"
        uploaded_filepath = UPLOAD_DIR / new_filename
        file.save(uploaded_filepath)
        
        # Load dataframe
        input_df = load_dataframe(uploaded_filepath)
        
        # Get input data summary
        input_summary = get_data_summary(input_df)
        
        # Make predictions
        predictions_df = predictor.predict(input_df)
        
        # Get prediction summary
        prediction_summary = get_prediction_summary(predictions_df)
        
        # Separate outputs
        separated_outputs = predictor.separate_outputs(predictions_df)
        
        # Save output files
        session_id = str(uuid.uuid4())
        output_files = {}
        
        for output_type, df in separated_outputs.items():
            if not df.empty:
                output_filename = f"supermarket_{output_type}_{session_id}.csv"
                output_path = save_output_csv(df, output_filename, OUTPUT_DIR)
                output_files[output_type] = {
                    "filename": output_filename,
                    "path": output_path,
                    "count": len(df)
                }
        
        # Cleanup uploaded file
        if uploaded_filepath.exists():
            uploaded_filepath.unlink()
        
        response = {
            "success": True,
            "session_id": session_id,
            "input_summary": input_summary,
            "prediction_summary": prediction_summary,
            "output_files": output_files,
            "message": f"Successfully processed {len(predictions_df)} records"
        }
        
        return jsonify(response)
    
    except Exception as e:
        # Cleanup on error
        if uploaded_filepath and uploaded_filepath.exists():
            uploaded_filepath.unlink()
        
        return jsonify({
            "error": f"Prediction failed: {str(e)}",
            "success": False
        }), 500

@app.route('/download/<output_type>/<session_id>', methods=['GET'])
def download_output(output_type, session_id):
    """Download output files"""
    try:
        filename = f"supermarket_{output_type}_{session_id}.csv"
        filepath = OUTPUT_DIR / filename
        
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

@app.errorhandler(413)
def too_large(e):
    return jsonify({"error": "File too large. Maximum size is 50MB"}), 413

@app.errorhandler(500)
def internal_error(e):
    return jsonify({"error": "Internal server error occurred"}), 500

if __name__ == '__main__':
    print("🚀 Starting Simplified Supermarket Revenue Leakage Detection...")
    print(f"📁 Upload directory: {UPLOAD_DIR}")
    print(f"📁 Output directory: {OUTPUT_DIR}")
    app.run(debug=True, host='0.0.0.0', port=5000)

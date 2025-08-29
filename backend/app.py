from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import traceback
from config import config
from routes.telecom_routes import telecom_bp
from routes.supermarket_routes import supermarket_bp
from utils.file_handler import allowed_file

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = config.MAX_CONTENT_LENGTH

# Enable CORS for all routes
CORS(app, origins=['http://localhost:5173', 'http://localhost:3000'])

# Register blueprints
app.register_blueprint(telecom_bp, url_prefix='/api/telecom')
app.register_blueprint(supermarket_bp, url_prefix='/api/supermarket')

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "AI Revenue Leakage Detection API is running"})

@app.route('/api/upload-test', methods=['POST'])
def upload_test():
    """Test file upload functionality"""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid file type. Only CSV and Excel files are allowed"}), 400
        
        return jsonify({"message": "File upload test successful", "filename": file.filename})
    
    except Exception as e:
        return jsonify({"error": f"Upload test failed: {str(e)}"}), 500

@app.errorhandler(413)
def too_large(e):
    return jsonify({"error": "File too large. Maximum size is 50MB"}), 413

@app.errorhandler(500)
def internal_error(e):
    return jsonify({"error": "Internal server error occurred"}), 500

if __name__ == '__main__':
    print("🚀 Starting AI Revenue Leakage Detection Backend...")
    print(f"📁 Upload directory: {config.UPLOAD_DIR}")
    print(f"📁 Output directory: {config.OUTPUT_DIR}")
    app.run(debug=True, host='0.0.0.0', port=5000)
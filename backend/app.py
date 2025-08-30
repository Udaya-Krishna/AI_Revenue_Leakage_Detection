import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import uuid
import json
from config import Config
from routes.supermarket import supermarket_bp
from routes.telecom import telecom_bp

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, origins=['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'])

# Create directories if they don't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['OUTPUT_FOLDER'], exist_ok=True)

# Store results in memory (use Redis or database in production)
results_store = {}

# Register blueprints
app.register_blueprint(supermarket_bp, url_prefix='/api/supermarket')
app.register_blueprint(telecom_bp, url_prefix='/api/telecom')

@app.route('/')
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'AI Revenue Leakage Detection API is running',
        'version': '1.0.0',
        'endpoints': {
            'supermarket': '/api/supermarket',
            'telecom': '/api/telecom'
        }
    })

@app.route('/api/health')
def api_health():
    return jsonify({'status': 'healthy', 'timestamp': str(uuid.uuid4())})

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

@app.errorhandler(413)
def too_large(error):
    return jsonify({'error': 'File too large. Maximum size is 50MB'}), 413

if __name__ == '__main__':
    print("=" * 50)
    print("AI Revenue Leakage Detection Backend")
    print("=" * 50)
    print("🚀 Starting Flask server...")
    print("🔗 Frontend should connect to: http://localhost:5000")
    print("📊 Supermarket API: http://localhost:5000/api/supermarket")
    print("📞 Telecom API: http://localhost:5000/api/telecom")
    print("=" * 50)
    
    app.run(
        debug=True,
        host='0.0.0.0',
        port=5000,
        threaded=True
    )
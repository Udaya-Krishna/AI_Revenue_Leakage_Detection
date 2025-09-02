# RepoMix Backend

Flask-based API server with integrated machine learning pipeline for anomaly detection and revenue leakage analysis across Supermarket and Telecom domains.

## 🚀 Quick Start

bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your configurations

# Run development server
python app.py


## 📋 Tech Stack

- *Flask* - Lightweight web framework
- *Pandas* - Data manipulation and analysis
- *XGBoost* - Gradient boosting for ML
- *Scikit-learn* - ML preprocessing and utilities
- *NumPy* - Numerical computations
- *python-docx* - Word document generation
- *Google Generative AI* - LLM for report summaries
- *Flask-CORS* - Cross-origin resource sharing

## 🏗 Project Structure


backend/
├── app.py                          # Flask application entry point
├── requirements.txt                # Python dependencies
├── .env                           # Environment configuration
├── model/                         # ML models and datasets
│   ├── super_market/
│   │   ├── cleaning/              # Data preprocessing notebooks
│   │   ├── datasets/              # Training and test data
│   │   ├── models/                # Jupyter notebooks & LLM scripts
│   │   ├── saved_models/          # Trained model artifacts
│   │   └── output_datasets/       # Generated predictions
│   └── Telecom/
│       ├── cleaning/              # Data preprocessing
│       ├── dataset/               # Telecom training data
│       ├── model/                 # Model notebooks
│       ├── saved_model/           # Trained artifacts
│       └── output_dataset/        # Predictions output
├── report_generation/
│   └── integrated_analysis.py     # Core analysis engine
├── uploads/                       # Temporary file storage
└── outputs/                       # Generated reports cache


## 🔄 Core Workflow

### 1. File Upload & Validation
python
@app.route('/api/upload', methods=['POST'])
def upload_file():
    # Validate file format and size
    file = request.files['file']
    domain = request.form['domain']
    
    # Generate session ID
    session_id = str(uuid.uuid4())
    
    # Save file securely
    filepath = os.path.join(UPLOAD_FOLDER, f"{session_id}.csv")
    file.save(filepath)
    
    # Trigger analysis pipeline
    results = run_integrated_analysis(filepath, domain, session_id)
    return jsonify({"session_id": session_id, "status": "completed"})


### 2. Analysis Pipeline
python
def run_integrated_analysis(filepath, domain, session_id):
    # Load data
    df = pd.read_csv(filepath)
    
    # Load domain-specific model
    model_path = f'model/{domain}/saved_model*'
    model = load_trained_model(model_path)
    
    # Feature engineering
    processed_data = preprocess_data(df, domain)
    
    # Anomaly detection
    anomalies = detect_anomalies(processed_data, model, domain)
    
    # Generate reports
    summary = generate_llm_summary(anomalies)
    detailed_report = create_detailed_report(anomalies, session_id)
    
    return {
        'session_id': session_id,
        'anomalies': anomalies,
        'summary': summary,
        'metrics': calculate_metrics(df, anomalies)
    }


### 3. Machine Learning Models

#### Supermarket Model
- *Algorithm*: XGBoost + Rule-based validation
- *Features*: Price, quantity, tax, discount, category, timestamps
- *Anomaly Types*: Missing charges, incorrect rates, usage mismatches
- *Files*: trained_pipeline.pkl, anomaly_encoder.pkl, leakage_encoder.pkl

#### Telecom Model  
- *Algorithm*: XGBoost + Statistical thresholds
- *Features*: Usage patterns, billing amounts, payment history
- *Anomaly Types*: Payment mismatches, billing inconsistencies
- *Files*: telecom_pipeline.pkl, le_anomaly.pkl, le_leakage.pkl

## 🧠 ML Pipeline Details

### Feature Engineering
python
def preprocess_data(df, domain):
    if domain == 'supermarket':
        # Price-based features
        df['price_per_unit'] = df['total_price'] / df['quantity']
        df['tax_percentage'] = df['tax_amount'] / df['price']
        
        # Temporal features
        df['hour'] = pd.to_datetime(df['timestamp']).dt.hour
        df['is_weekend'] = pd.to_datetime(df['timestamp']).dt.dayofweek.isin([5, 6])
        
    elif domain == 'telecom':
        # Usage patterns
        df['usage_per_day'] = df['total_usage'] / df['billing_days']
        df['cost_per_unit'] = df['bill_amount'] / df['total_usage']
        
        # Payment behavior
        df['days_since_payment'] = (pd.to_datetime('today') - pd.to_datetime(df['last_payment'])).dt.days
        
    return df


### Anomaly Detection
python
def detect_anomalies(data, model, domain):
    # XGBoost predictions
    anomaly_scores = model.predict_proba(data)[:, 1]
    
    # Rule-based validation
    rule_anomalies = apply_business_rules(data, domain)
    
    # Combine and rank anomalies
    combined_results = merge_detections(anomaly_scores, rule_anomalies)
    
    return format_anomaly_output(combined_results)


## 📊 API Endpoints

### Core Endpoints

#### File Upload

POST /api/upload
Content-Type: multipart/form-data

Parameters:
- file: CSV file (required)
- domain: "supermarket" | "telecom" (required)

Response:
{
  "session_id": "uuid-string",
  "status": "completed"
}


#### Get Results

GET /api/results/{session_id}

Response:
{
  "session_id": "uuid-string",
  "domain": "supermarket",
  "summary": "AI-generated executive summary",
  "metrics": {
    "total_rows": 15234,
    "anomalies_detected": 523,
    "anomaly_rate": 0.034,
    "confidence_avg": 0.87
  },
  "anomalies": [...],
  "visualization_data": {...}
}


#### Download Reports

GET /api/download_detailed_report/{session_id}
Response: application/vnd.openxmlformats-officedocument.wordprocessingml.document

GET /api/download_anomalies/{session_id}
Response: text/csv


### Health Check

GET /health

Response:
{
  "status": "healthy",
  "timestamp": "2025-09-02T10:30:00Z",
  "models_loaded": 2,
  "active_sessions": 5
}


## 📄 Report Generation

### LLM Summary Generation
python
def generate_llm_summary(anomalies, metrics):
    prompt = f"""
    Analyze business data anomalies:
    - Total Records: {metrics['total_rows']}
    - Anomalies: {len(anomalies)} ({metrics['anomaly_rate']:.2%})
    - Key Types: {get_anomaly_breakdown(anomalies)}
    
    Provide 3-4 sentence executive summary with critical findings.
    """
    
    response = genai.generate_text(prompt=prompt)
    return response.text


### Detailed Report Creation
python
def create_detailed_report(anomalies, metrics, session_id):
    doc = Document()
    
    # Add title and metadata
    doc.add_heading('Data Analysis Report', 0)
    doc.add_paragraph(f'Generated: {datetime.now()}')
    
    # Executive summary section
    doc.add_heading('Executive Summary', 1)
    doc.add_paragraph(metrics['llm_summary'])
    
    # Metrics table
    add_metrics_table(doc, metrics)
    
    # Anomaly details
    add_anomaly_details(doc, anomalies)
    
    # Save and return path
    doc_path = f"outputs/{session_id}_detailed.docx"
    doc.save(doc_path)
    return doc_path


## 🔒 Security & Validation

### File Security
python
ALLOWED_EXTENSIONS = {'csv'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB

def secure_filename_custom(filename):
    # Remove path traversal
    filename = filename.replace('..', '')
    # Sanitize characters
    filename = re.sub(r'[^a-zA-Z0-9._-]', '', filename)
    return filename


### Session Management
python
# UUID-based sessions
session_id = str(uuid.uuid4())

# Session cleanup (24-hour TTL)
def cleanup_expired_sessions():
    cutoff = datetime.now() - timedelta(hours=24)
    expired = [sid for sid, data in sessions.items() 
               if data['created_at'] < cutoff]
    
    for sid in expired:
        cleanup_session_files(sid)
        del sessions[sid]


## ⚙ Configuration

### Environment Variables
env
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
FLASK_PORT=5000

# Google AI Integration
GOOGLE_AI_API_KEY=your_api_key_here

# File Storage
UPLOAD_FOLDER=uploads
OUTPUT_FOLDER=outputs
MAX_FILE_SIZE=16777216

# Session Management
SESSION_TTL=86400
CLEANUP_INTERVAL=3600


### Model Paths
python
MODEL_PATHS = {
    'supermarket': {
        'pipeline': 'model/super_market/saved_models/trained_pipeline.pkl',
        'anomaly_encoder': 'model/super_market/saved_models/anomaly_encoder.pkl',
        'leakage_encoder': 'model/super_market/saved_models/leakage_encoder.pkl'
    },
    'telecom': {
        'pipeline': 'model/Telecom/saved_model/telecom_pipeline.pkl',
        'anomaly_encoder': 'model/Telecom/saved_model/le_anomaly.pkl',
        'leakage_encoder': 'model/Telecom/saved_model/le_leakage.pkl'
    }
}


## 🧪 Testing & Development

### Running Tests
bash
# Run analysis tests
python -m pytest tests/

# Test specific module
python test.py

# Manual testing endpoints
curl -X POST -F "file=@test.csv" -F "domain=supermarket" http://localhost:5000/api/upload


### Development Mode
python
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)


## 📈 Performance Monitoring

### Key Metrics
- Upload success/failure rates
- Analysis processing times
- Model prediction accuracy
- Memory usage patterns
- Active session counts

### Logging
python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)


## 🔧 Deployment

### Production Setup
bash
# Install gunicorn
pip install gunicorn

# Run with multiple workers
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# With nginx reverse proxy
# nginx.conf:
location /api/ {
    proxy_pass http://localhost:5000/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}


### Docker Deployment
dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]


## 📋 Dependencies

### Core ML Stack
txt
Flask==2.3.2
Flask-CORS==4.0.0
pandas==2.0.3
numpy==1.24.3
scikit-learn==1.3.0
xgboost==1.7.6
python-docx==0.8.11
google-generativeai==0.3.2
requests==2.31.0


### Model Loading & Persistence
python
import pickle
import joblib
from sklearn.externals import joblib

def load_trained_model(model_path):
    """Load pre-trained ML models and encoders"""
    try:
        if model_path.endswith('.pkl'):
            with open(model_path, 'rb') as f:
                model = pickle.load(f)
        else:
            model = joblib.load(model_path)
        return model
    except Exception as e:
        logger.error(f"Model loading failed: {e}")
        raise


## 🔍 Data Processing Pipeline

### Input Validation
python
def validate_csv_structure(df, domain):
    required_columns = {
        'supermarket': ['price', 'quantity', 'tax', 'category'],
        'telecom': ['usage', 'bill_amount', 'payment_status']
    }
    
    missing_cols = set(required_columns[domain]) - set(df.columns)
    if missing_cols:
        raise ValueError(f"Missing columns: {missing_cols}")


### Data Preprocessing
python
def preprocess_data(df, domain):
    """Domain-specific feature engineering"""
    if domain == 'supermarket':
        # Handle missing values
        df['tax_amount'].fillna(0, inplace=True)
        df['discount'].fillna(0, inplace=True)
        
        # Create derived features
        df['price_per_unit'] = df['total_price'] / df['quantity']
        df['tax_percentage'] = df['tax_amount'] / df['price']
        df['discount_percentage'] = df['discount'] / df['price']
        
        # Temporal features
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df['hour'] = df['timestamp'].dt.hour
        df['day_of_week'] = df['timestamp'].dt.dayofweek
        df['is_weekend'] = df['day_of_week'].isin([5, 6])
        
        # Category encoding
        le = LabelEncoder()
        df['category_encoded'] = le.fit_transform(df['category'])
        
    elif domain == 'telecom':
        # Usage pattern analysis
        df['usage_per_day'] = df['total_usage'] / df['billing_days']
        df['cost_per_unit'] = df['bill_amount'] / df['total_usage']
        
        # Payment behavior features
        df['last_payment'] = pd.to_datetime(df['last_payment'])
        df['days_since_payment'] = (pd.to_datetime('today') - df['last_payment']).dt.days
        df['payment_delay'] = df['days_since_payment'] > 30
        
        # Service type encoding
        le = LabelEncoder()
        df['service_type_encoded'] = le.fit_transform(df['service_type'])
        
    return df


### Anomaly Classification
python
def classify_anomaly_type(row, domain, prediction):
    """Classify anomaly based on business rules and ML predictions"""
    if domain == 'supermarket':
        if row['tax'] == 0 and row['price'] > 0:
            return 'Missing Tax Charges'
        elif row['discount'] > row['price']:
            return 'Invalid Discount'
        elif prediction == 1:
            return 'Revenue Leakage'
        else:
            return 'Usage Mismatch'
            
    elif domain == 'telecom':
        if row['payment_status'] != row['expected_status']:
            return 'Payment Status Mismatch'
        elif abs(row['bill_amount'] - row['expected_bill']) > threshold:
            return 'Billing Inconsistency'
        else:
            return 'Usage Pattern Anomaly'


## 🔧 Model Management

### Model Loading Strategy
python
class ModelManager:
    def __init__(self):
        self.models = {}
        self.encoders = {}
        
    def load_domain_models(self, domain):
        """Load all models for a specific domain"""
        if domain not in self.models:
            base_path = f'model/{domain}/saved_model*'
            
            if domain == 'supermarket':
                self.models[domain] = {
                    'pipeline': joblib.load(f'{base_path}/trained_pipeline.pkl'),
                    'anomaly_encoder': joblib.load(f'{base_path}/anomaly_encoder.pkl'),
                    'leakage_encoder': joblib.load(f'{base_path}/leakage_encoder.pkl')
                }
            else:  # telecom
                self.models[domain] = {
                    'pipeline': joblib.load(f'{base_path}/telecom_pipeline.pkl'),
                    'anomaly_encoder': joblib.load(f'{base_path}/le_anomaly.pkl'),
                    'leakage_encoder': joblib.load(f'{base_path}/le_leakage.pkl')
                }
                
        return self.models[domain]


### Business Rules Engine
python
def apply_business_rules(df, domain):
    """Apply domain-specific business validation rules"""
    anomalies = []
    
    if domain == 'supermarket':
        # Rule 1: Missing tax on taxable items
        missing_tax_mask = (df['price'] > 0) & (df['tax_amount'] == 0) & (df['category'] != 'tax_exempt')
        missing_tax_indices = df[missing_tax_mask].index.tolist()
        
        for idx in missing_tax_indices:
            anomalies.append({
                'row_index': idx,
                'type': 'Missing Tax Charges',
                'severity': 'high',
                'rule': 'TAX_001',
                'description': 'Item has price but no tax applied'
            })
        
        # Rule 2: Discount exceeds item price
        invalid_discount_mask = df['discount'] > df['price']
        invalid_discount_indices = df[invalid_discount_mask].index.tolist()
        
        for idx in invalid_discount_indices:
            anomalies.append({
                'row_index': idx,
                'type': 'Invalid Discount',
                'severity': 'critical',
                'rule': 'DISC_001',
                'description': 'Discount amount exceeds item price'
            })
            
    elif domain == 'telecom':
        # Rule 1: Payment status inconsistency
        status_mismatch_mask = df['payment_status'] != df['expected_payment_status']
        status_indices = df[status_mismatch_mask].index.tolist()
        
        for idx in status_indices:
            anomalies.append({
                'row_index': idx,
                'type': 'Payment Status Mismatch',
                'severity': 'medium',
                'rule': 'PAY_001',
                'description': 'Payment status does not match expected status'
            })
    
    return anomalies


## 📊 Analytics & Metrics

### Performance Metrics
python
def calculate_metrics(df, anomalies):
    """Calculate comprehensive analysis metrics"""
    return {
        'total_rows': len(df),
        'anomalies_detected': len(anomalies),
        'anomaly_rate': len(anomalies) / len(df),
        'confidence_avg': np.mean([a['confidence'] for a in anomalies]),
        'severity_breakdown': get_severity_counts(anomalies),
        'processing_time': time.time() - start_time,
        'generated_at': datetime.now().isoformat(),
        'data_quality_score': calculate_data_quality(df),
        'revenue_impact': calculate_revenue_impact(anomalies)
    }


### Business Impact Calculation
python
def calculate_revenue_impact(anomalies, domain):
    """Calculate potential revenue impact of detected anomalies"""
    total_impact = 0
    
    for anomaly in anomalies:
        if anomaly['type'] == 'Missing Tax Charges':
            total_impact += anomaly['evidence']['expected_value']
        elif anomaly['type'] == 'Revenue Leakage':
            total_impact += anomaly['evidence']['lost_revenue']
        elif anomaly['type'] == 'Invalid Discount':
            total_impact += anomaly['evidence']['excess_discount']
            
    return {
        'total_revenue_at_risk': total_impact,
        'average_per_anomaly': total_impact / len(anomalies) if anomalies else 0,
        'high_impact_anomalies': len([a for a in anomalies if a['severity'] == 'critical']),
        'currency': 'USD'
    }


### Visualization Data Preparation
python
def prepare_visualization_data(anomalies):
    """Prepare data for frontend charts"""
    # Anomaly type distribution
    type_counts = Counter(a['type'] for a in anomalies)
    anomaly_by_type = [
        {'label': k, 'count': v, 'percentage': round(v/len(anomalies)*100, 1)}
        for k, v in type_counts.items()
    ]
    
    # Severity distribution
    severity_counts = Counter(a['severity'] for a in anomalies)
    severity_distribution = [
        {'severity': k, 'count': v}
        for k, v in severity_counts.items()
    ]
    
    # Confidence score distribution
    confidence_bins = np.histogram([a['confidence'] for a in anomalies], bins=10)
    confidence_distribution = [
        {'range': f"{confidence_bins[1][i]:.1f}-{confidence_bins[1][i+1]:.1f}", 
         'count': confidence_bins[0][i]}
        for i in range(len(confidence_bins[0]))
    ]
    
    return {
        'anomaly_by_type': anomaly_by_type,
        'severity_distribution': severity_distribution,
        'confidence_distribution': confidence_distribution,
        'total_anomalies': len(anomalies)
    }


## 🔧 Configuration Management

### Flask Configuration
python
class Config:
    # File upload settings
    UPLOAD_FOLDER = 'uploads'
    OUTPUT_FOLDER = 'outputs' 
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
    
    # Model settings
    MODEL_CACHE_SIZE = 2
    PREDICTION_BATCH_SIZE = 1000
    ANOMALY_THRESHOLD = 0.7
    
    # Session settings
    SESSION_TTL = 86400  # 24 hours
    CLEANUP_INTERVAL = 3600  # 1 hour
    
    # API settings
    CORS_ORIGINS = ['http://localhost:3000']
    API_RATE_LIMIT = '100/hour'
    
    # LLM settings
    LLM_MAX_TOKENS = 1000
    LLM_TEMPERATURE = 0.3


### Error Handling
python
def safe_analysis_wrapper(func):
    """Decorator for safe analysis execution with comprehensive error handling"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except FileNotFoundError as e:
            logger.error(f"File not found: {e}")
            return {"error": "File not found", "code": 404}
        except pd.errors.EmptyDataError:
            logger.error("Empty CSV file")
            return {"error": "CSV file is empty", "code": 400}
        except ValueError as e:
            logger.error(f"Data validation error: {e}")
            return {"error": str(e), "code": 400}
        except MemoryError:
            logger.error("Insufficient memory for analysis")
            return {"error": "Dataset too large", "code": 413}
        except Exception as e:
            logger.error(f"Analysis failed: {str(e)}")
            return {"error": "Analysis failed", "code": 500}
    return wrapper


## 🚀 Production Deployment

### Process Management
bash
# Using gunicorn with multiple workers
gunicorn -w 4 -b 0.0.0.0:5000 app:app --timeout 300 --max-requests 1000

# With supervisor for process monitoring
[program:repomix-backend]
command=gunicorn -w 4 -b 0.0.0.0:5000 app:app
directory=/app/backend
user=www-data
autostart=true
autorestart=true
stdout_logfile=/var/log/repomix/backend.log
stderr_logfile=/var/log/repomix/backend_error.log


### Load Balancing
nginx
upstream backend {
    server 127.0.0.1:5000;
    server 127.0.0.1:5001;
    server 127.0.0.1:5002;
}

server {
    listen 80;
    server_name your-domain.com;
    
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_connect_timeout 30s;
        proxy_read_timeout 300s;
    }
    
    # Static file serving for reports
    location /downloads/ {
        alias /app/backend/outputs/;
        expires 1h;
        add_header Cache-Control "public, immutable";
    }
}


## 📈 Advanced Features

### Batch Processing
python
def process_large_dataset(filepath, domain, session_id, batch_size=1000):
    """Process large datasets in batches to manage memory"""
    results = {'anomalies': [], 'metrics': {}}
    
    # Read file in chunks
    chunk_iter = pd.read_csv(filepath, chunksize=batch_size)
    
    total_rows = 0
    all_anomalies = []
    
    for chunk_idx, chunk in enumerate(chunk_iter):
        # Process chunk
        processed_chunk = preprocess_data(chunk, domain)
        chunk_anomalies = detect_anomalies(processed_chunk, domain)
        
        # Adjust row indices for global reference
        for anomaly in chunk_anomalies:
            anomaly['row_reference'] += chunk_idx * batch_size
            
        all_anomalies.extend(chunk_anomalies)
        total_rows += len(chunk)
        
        # Update progress
        update_progress(session_id, chunk_idx)
    
    results['anomalies'] = all_anomalies
    results['metrics'] = calculate_metrics_from_summary(total_rows, all_anomalies)
    
    return results


### Caching System
python
import redis
from functools import wraps

# Redis connection for production caching
redis_client = redis.Redis(host='localhost', port=6379, db=0)

def cache_results(ttl=3600):
    """Cache analysis results with TTL"""
    def decorator(func):
        @wraps(func)
        def wrapper(session_id, *args, **kwargs):
            cache_key = f"results:{session_id}"
            
            # Try to get from cache
            cached_result = redis_client.get(cache_key)
            if cached_result:
                return json.loads(cached_result)
            
            # Execute function and cache result
            result = func(session_id, *args, **kwargs)
            redis_client.setex(cache_key, ttl, json.dumps(result))
            
            return result
        return wrapper
    return decorator


## 🔍 Monitoring & Health Checks

### Application Health
python
@app.route('/health')
def health_check():
    """Comprehensive health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "models_loaded": check_models_status(),
        "disk_space": get_disk_usage(),
        "memory_usage": get_memory_usage(),
        "active_sessions": len(session_store),
        "uptime": get_uptime()
    })

def check_models_status():
    """Verify all required models are loaded"""
    required_models = [
        'model/super_market/saved_models/trained_pipeline.pkl',
        'model/Telecom/saved_model/telecom_pipeline.pkl'
    ]
    
    loaded_count = sum(1 for path in required_models if os.path.exists(path))
    return f"{loaded_count}/{len(required_models)}"


### Performance Monitoring
python
import time
from functools import wraps

def monitor_performance(f):
    """Monitor function execution time and log performance metrics"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        start_time = time.time()
        start_memory = get_memory_usage()
        
        result = f(*args, **kwargs)
        
        execution_time = time.time() - start_time
        memory_used = get_memory_usage() - start_memory
        
        logger.info(f"{f.__name__} executed in {execution_time:.2f}s, memory: {memory_used}MB")
        
        # Log to monitoring system
        metrics_collector.record({
            'function': f.__name__,
            'execution_time': execution_time,
            'memory_usage': memory_used,
            'timestamp': datetime.now()
        })
        
        return result
    return decorated_function


## 🧪 Testing Framework

### Unit Tests
python
# test_analysis.py
import unittest
from unittest.mock import patch, MagicMock
from integrated_analysis import run_integrated_analysis

class TestAnalysisEngine(unittest.TestCase):
    
    def setUp(self):
        self.test_data_path = 'test_data/sample_supermarket.csv'
        self.session_id = 'test-session-123'
    
    def test_supermarket_analysis(self):
        """Test supermarket domain analysis"""
        result = run_integrated_analysis(
            self.test_data_path, 'supermarket', self.session_id
        )
        
        self.assertIn('anomalies', result)
        self.assertIn('metrics', result)
        self.assertGreater(len(result['anomalies']), 0)
        self.assertEqual(result['session_id'], self.session_id)
    
    def test_telecom_analysis(self):
        """Test telecom domain analysis"""
        result = run_integrated_analysis(
            'test_data/sample_telecom.csv', 'telecom', self.session_id
        )
        
        self.assertIn('anomalies', result)
        self.assertIn('metrics', result)
        self.assertEqual(result['domain'], 'telecom')
    
    @patch('integrated_analysis.genai.generate_text')
    def test_llm_summary_generation(self, mock_llm):
        """Test LLM summary generation"""
        mock_llm.return_value.text = "Test summary generated successfully"
        
        anomalies = [{'type': 'Missing Tax', 'confidence': 0.9}]
        metrics = {'total_rows': 100, 'anomaly_rate': 0.01}
        
        summary = generate_llm_summary(anomalies, metrics)
        self.assertIsInstance(summary, str)
        self.assertGreater(len(summary), 0)
    
    def test_invalid_domain(self):
        """Test handling of invalid domain"""
        with self.assertRaises(ValueError):
            run_integrated_analysis('test_data.csv', 'invalid_domain', 'test-session')
    
    def test_malformed_csv(self):
        """Test handling of malformed CSV files"""
        with self.assertRaises(pd.errors.ParserError):
            run_integrated_analysis('test_data/malformed.csv', 'supermarket', 'test-session')


### Integration Tests
python
# test_api.py
import unittest
import json
from app import app

class TestAPIEndpoints(unittest.TestCase):
    
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
    
    def test_health_endpoint(self):
        """Test health check endpoint"""
        response = self.app.get('/health')
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'healthy')
        self.assertIn('timestamp', data)
    
    def test_file_upload_success(self):
        """Test successful file upload"""
        with open('test_data/sample_supermarket.csv', 'rb') as test_file:
            response = self.app.post('/api/upload', 
                data={
                    'file': (test_file, 'test.csv'),
                    'domain': 'supermarket'
                },
                content_type='multipart/form-data'
            )
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('session_id', data)
    
    def test_results_retrieval(self):
        """Test results endpoint"""
        # First upload a file
        with open('test_data/sample_supermarket.csv', 'rb') as test_file:
            upload_response = self.app.post('/api/upload', 
                data={
                    'file': (test_file, 'test.csv'),
                    'domain': 'supermarket'
                },
                content_type='multipart/form-data'
            )
        
        session_id = json.loads(upload_response.data)['session_id']
        
        # Then get results
        results_response = self.app.get(f'/api/results/{session_id}')
        self.assertEqual(results_response.status_code, 200)
        
        results_data = json.loads(results_response.data)
        self.assertIn('anomalies', results_data)
        self.assertIn('metrics', results_data)


## 📊 Data Quality Assessment

### Data Quality Metrics
python
def calculate_data_quality(df):
    """Assess overall data quality of uploaded dataset"""
    quality_metrics = {
        'completeness': calculate_completeness(df),
        'consistency': calculate_consistency(df),
        'validity': calculate_validity(df),
        'accuracy': calculate_accuracy(df)
    }
    
    # Overall quality score (weighted average)
    weights = {'completeness': 0.3, 'consistency': 0.25, 'validity': 0.25, 'accuracy': 0.2}
    overall_score = sum(quality_metrics[metric] * weights[metric] 
                       for metric in quality_metrics)
    
    quality_metrics['overall_score'] = overall_score
    quality_metrics['quality_grade'] = get_quality_grade(overall_score)
    
    return quality_metrics

def calculate_completeness(df):
    """Calculate data completeness percentage"""
    total_cells = df.shape[0] * df.shape[1]
    missing_cells = df.isnull().sum().sum()
    return (total_cells - missing_cells) / total_cells

def calculate_consistency(df):
    """Check data consistency across related fields"""
    consistency_checks = 0
    total_checks = 0
    
    # Domain-specific consistency rules
    if 'price' in df.columns and 'tax_amount' in df.columns:
        # Check if tax is reasonable percentage of price
        valid_tax = df[(df['tax_amount'] / df['price']).between(0, 0.3)]
        consistency_checks += len(valid_tax)
        total_checks += len(df)
    
    return consistency_checks / total_checks if total_checks > 0 else 1.0


### Data Profiling
python
def profile_dataset(df, domain):
    """Generate comprehensive data profile"""
    profile = {
        'basic_stats': {
            'rows': len(df),
            'columns': len(df.columns),
            'memory_usage': df.memory_usage(deep=True).sum(),
            'file_size_mb': os.path.getsize(filepath) / (1024 * 1024)
        },
        'column_info': {},
        'data_types': df.dtypes.to_dict(),
        'missing_values': df.isnull().sum().to_dict(),
        'unique_counts': df.nunique().to_dict()
    }
    
    # Detailed column analysis
    for col in df.columns:
        if df[col].dtype in ['int64', 'float64']:
            profile['column_info'][col] = {
                'type': 'numeric',
                'min': df[col].min(),
                'max': df[col].max(),
                'mean': df[col].mean(),
                'std': df[col].std(),
                'outliers': detect_outliers(df[col])
            }
        else:
            profile['column_info'][col] = {
                'type': 'categorical',
                'unique_values': df[col].nunique(),
                'top_values': df[col].value_counts().head(5).to_dict()
            }
    
    return profile


## 🔧 Advanced Configuration

### Model Configuration
python
MODEL_CONFIG = {
    'supermarket': {
        'anomaly_threshold': 0.7,
        'confidence_threshold': 0.8,
        'feature_columns': [
            'price', 'quantity', 'tax_rate', 'discount', 
            'category_encoded', 'hour', 'is_weekend'
        ],
        'categorical_columns': ['category', 'payment_method'],
        'model_type': 'xgboost',
        'preprocessing': {
            'handle_outliers': True,
            'normalize_features': True,
            'fill_missing_strategy': 'median'
        }
    },
    'telecom': {
        'anomaly_threshold': 0.65,
        'confidence_threshold': 0.75,
        'feature_columns': [
            'usage', 'bill_amount', 'payment_days', 
            'service_type_encoded', 'usage_per_day'
        ],
        'categorical_columns': ['service_type', 'customer_segment'],
        'model_type': 'xgboost',
        'preprocessing': {
            'handle_outliers': True,
            'normalize_features': False,
            'fill_missing_strategy': 'mean'
        }
    }
}


### Logging Configuration
python
import logging
from logging.handlers import RotatingFileHandler
import os

def setup_logging():
    """Configure comprehensive logging system"""
    if not os.path.exists('logs'):
        os.makedirs('logs')
    
    # Main application log
    file_handler = RotatingFileHandler(
        'logs/app.log', maxBytes=10000000, backupCount=3
    )
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    
    # Performance log
    perf_handler = RotatingFileHandler(
        'logs/performance.log', maxBytes=5000000, backupCount=2
    )
    perf_handler.setFormatter(logging.Formatter(
        '%(asctime)s PERF: %(message)s'
    ))
    
    # Error log
    error_handler = RotatingFileHandler(
        'logs/errors.log', maxBytes=5000000, backupCount=3
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(logging.Formatter(
        '%(asctime)s ERROR: %(message)s\n%(exc_info)s'
    ))
    
    app.logger.addHandler(file_handler)
    app.logger.addHandler(perf_handler)
    app.logger.addHandler(error_handler)
    app.logger.setLevel(logging.INFO)


## 🚦 Error Recovery & Resilience

### Graceful Failure Handling
python
class AnalysisError(Exception):
    """Custom exception for analysis failures"""
    def __init__(self, message, error_code=500, details=None):
        self.message = message
        self.error_code = error_code
        self.details = details or {}
        super().__init__(self.message)

def handle_analysis_failure(session_id, error):
    """Handle analysis failures gracefully"""
    error_details = {
        'session_id': session_id,
        'error_type': type(error).__name__,
        'error_message': str(error),
        'timestamp': datetime.now().isoformat(),
        'recovery_suggestions': get_recovery_suggestions(error)
    }
    
    # Log error details
    logger.error(f"Analysis failed for session {session_id}: {error_details}")
    
    # Store error state for debugging
    store_error_state(session_id, error_details)
    
    return error_details


### Recovery Mechanisms
python
def get_recovery_suggestions(error):
    """Provide recovery suggestions based on error type"""
    if isinstance(error, pd.errors.EmptyDataError):
        return [
            "Ensure CSV file contains data rows",
            "Check for proper CSV formatting",
            "Verify file is not corrupted"
        ]
    elif isinstance(error, KeyError):
        return [
            "Verify required columns are present",
            "Check column names match expected format",
            "Review data structure requirements"
        ]
    elif isinstance(error, MemoryError):
        return [
            "Reduce dataset size",
            "Process data in smaller batches",
            "Remove unnecessary columns"
        ]
    else:
        return [
            "Check file format and structure",
            "Verify data quality",
            "Contact support if issue persists"
        ]


## 🔄 Session & State Management

### Session Store Implementation
python
import threading
from datetime import datetime, timedelta

class SessionStore:
    """Thread-safe session storage with TTL"""
    
    def __init__(self):
        self._store = {}
        self._lock = threading.RLock()
        self._cleanup_timer = None
        self.start_cleanup_timer()
    
    def create_session(self, session_id, data):
        """Create new session with TTL"""
        with self._lock:
            self._store[session_id] = {
                'data': data,
                'created_at': datetime.now(),
                'last_accessed': datetime.now()
            }
    
    def get_session(self, session_id):
        """Retrieve session data"""
        with self._lock:
            if session_id in self._store:
                self._store[session_id]['last_accessed'] = datetime.now()
                return self._store[session_id]['data']
            return None
    
    def cleanup_expired_sessions(self):
        """Remove expired sessions"""
        cutoff_time = datetime.now() - timedelta(seconds=SESSION_TTL)
        
        with self._lock:
            expired_sessions = [
                sid for sid, session_info in self._store.items()
                if session_info['last_accessed'] < cutoff_time
            ]
            
            for session_id in expired_sessions:
                self.delete_session(session_id)
        
        logger.info(f"Cleaned up {len(expired_sessions)} expired sessions")
    
    def delete_session(self, session_id):
        """Delete session and associated files"""
        with self._lock:
            if session_id in self._store:
                # Cleanup associated files
                cleanup_session_files(session_id)
                del self._store[session_id]


## 🎯 Performance Optimization

### Memory Management
python
import gc
import psutil

def optimize_memory_usage():
    """Optimize memory usage during analysis"""
    # Force garbage collection
    gc.collect()
    
    # Get current memory usage
    process = psutil.Process(os.getpid())
    memory_info = process.memory_info()
    
    logger.info(f"Memory usage: {memory_info.rss / 1024 / 1024:.2f} MB")
    
    # If memory usage is high, trigger cleanup
    if memory_info.rss > 1024 * 1024 * 1024:  # 1GB threshold
        cleanup_memory_intensive_operations()

def cleanup_memory_intensive_operations():
    """Clean up memory-intensive cached objects"""
    # Clear model cache if too many models loaded
    if len(model_manager.models) > MODEL_CACHE_SIZE:
        model_manager.clear_oldest_models()
    
    # Clean temporary DataFrames
    gc.collect()


### Async Processing
python
import asyncio
from concurrent.futures import ThreadPoolExecutor

class AsyncAnalysisProcessor:
    """Asynchronous analysis processor for handling multiple requests"""
    
    def __init__(self, max_workers=4):
        self.executor = ThreadPoolExecutor(max_workers=max_workers)
        self.processing_queue = {}
    
    async def process_analysis(self, filepath, domain, session_id):
        """Process analysis asynchronously"""
        # Add to processing queue
        self.processing_queue[session_id] = {
            'status': 'processing',
            'started_at': datetime.now()
        }
        
        try:
            # Execute analysis in thread pool
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                self.executor, 
                run_integrated_analysis, 
                filepath, domain, session_id
            )
            
            # Update queue status
            self.processing_queue[session_id]['status'] = 'completed'
            self.processing_queue[session_id]['completed_at'] = datetime.now()
            
            return result
            
        except Exception as e:
            self.processing_queue[session_id]['status'] = 'failed'
            self.processing_queue[session_id]['error'] = str(e)
            raise
    
    def get_processing_status(self, session_id):
        """Get current processing status"""
        return self.processing_queue.get(session_id, {'status': 'not_found'})


## 🔍 Advanced Analytics

### Statistical Analysis
python
def perform_statistical_analysis(df, anomalies):
    """Perform comprehensive statistical analysis"""
    stats = {
        'descriptive_stats': df.describe().to_dict(),
        'correlation_matrix': df.corr().to_dict(),
        'anomaly_patterns': analyze_anomaly_patterns(anomalies),
        'seasonal_trends': detect_seasonal_trends(df),
        'outlier_analysis': perform_outlier_analysis(df)
    }
    
    return stats

def analyze_anomaly_patterns(anomalies):
    """Analyze patterns in detected anomalies"""
    patterns = {
        'temporal_patterns': {},
        'severity_patterns': {},
        'confidence_patterns': {}
    }
    
    # Temporal clustering
    if anomalies:
        timestamps = [a.get('timestamp') for a in anomalies if a.get('timestamp')]
        if timestamps:
            patterns['temporal_patterns'] = find_temporal_clusters(timestamps)
    
    # Severity distribution analysis
    severity_counts = Counter(a['severity'] for a in anomalies)
    patterns['severity_patterns'] = dict(severity_counts)
    
    # Confidence score analysis
    confidences = [a['confidence'] for a in anomalies]
    patterns['confidence_patterns'] = {
        'mean': np.mean(confidences),
        'std': np.std(confidences),
        'distribution': np.histogram(confidences, bins=10)[0].tolist()
    }
    
    return patterns


### Predictive Analytics
python
def predict_future_anomalies(df, domain):
    """Predict potential future anomalies based on trends"""
    if 'timestamp' not in df.columns:
        return None
    
    # Time series analysis
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    daily_anomalies = df.groupby(df['timestamp'].dt.date).size()
    
    # Simple trend analysis
    if len(daily_anomalies) >= 7:
        trend_slope = calculate_trend_slope(daily_anomalies)
        
        forecast = {
            'trend_direction': 'increasing' if trend_slope > 0 else 'decreasing',
            'predicted_daily_anomalies': daily_anomalies.mean() + trend_slope,
            'confidence_interval': calculate_confidence_interval(daily_anomalies),
            'forecast_period': '7_days'
        }
        
        return forecast
    
    return None


## 📱 API Rate Limiting & Security

### Rate Limiting
python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["100 per hour", "20 per minute"]
)

@app.route('/api/upload', methods=['POST'])
@limiter.limit("5 per minute")
def upload_file():
    # Implementation
    pass


### Request Validation
python
from werkzeug.utils import secure_filename
import magic

def validate_upload_request(request):
    """Comprehensive upload request validation"""
    errors = []
    
    # Check if file is present
    if 'file' not in request.files:
        errors.append('No file provided')
        return errors
    
    file = request.files['file']
    domain = request.form.get('domain')
    
    # Validate domain
    if domain not in ['supermarket', 'telecom']:
        errors.append('Invalid domain specified')
    
    # Validate file
    if file.filename == '':
        errors.append('No file selected')
    
    # Check file extension
    if not file.filename.lower().endswith('.csv'):
        errors.append('Only CSV files are allowed')
    
    # Validate file content type using python-magic
    file_content = file.read(1024)  # Read first 1KB
    file.seek(0)  # Reset file pointer
    
    mime_type = magic.from_buffer(file_content, mime=True)
    if mime_type not in ['text/csv', 'text/plain', 'application/csv']:
        errors.append('Invalid file format detected')
    
    # Check file size
    file.seek(0, 2)  # Seek to end
    file_size = file.tell()
    file.seek(0)  # Reset
    
    if file_size > app.config['MAX_CONTENT_LENGTH']:
        errors.append('File size exceeds 16MB limit')
    
    if file_size == 0:
        errors.append('File is empty')
    
    return errors


## 🚀 Production Optimizations

### Database Integration (Optional)
python
from sqlalchemy import create_engine, Column, String, DateTime, Text, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class AnalysisSession(Base):
    __tablename__ = 'analysis_sessions'
    
    session_id = Column(String(36), primary_key=True)
    domain = Column(String(20), nullable=False)
    status = Column(String(20), default='processing')
    created_at = Column(DateTime, default=datetime.now)
    completed_at = Column(DateTime)
    anomaly_count = Column(Float)
    processing_time = Column(Float)
    file_size = Column(Float)
    results_json = Column(Text)

# Database operations
def store_session_to_db(session_id, domain, results):
    """Store session results to database"""
    session = AnalysisSession(
        session_id=session_id,
        domain=domain,
        status='completed',
        completed_at=datetime.now(),
        anomaly_count=len(results['anomalies']),
        processing_time=results['metrics']['processing_time'],
        results_json=json.dumps(results)
    )
    
    db_session.add(session)
    db_session.commit()


### Microservices Architecture
python
# analysis_service.py - Separate analysis microservice
class AnalysisService:
    """Dedicated service for ML analysis"""
    
    def __init__(self, model_manager):
        self.model_manager = model_manager
        self.processing_queue = Queue()
        
    def submit_analysis(self, filepath, domain, session_id):
        """Submit analysis job to queue"""
        job = {
            'filepath': filepath,
            'domain': domain,
            'session_id': session_id,
            'submitted_at': datetime.now()
        }
        
        self.processing_queue.put(job)
        return job
    
    def process_queue(self):
        """Process analysis jobs from queue"""
        while True:
            try:
                job = self.processing_queue.get(timeout=1)
                result = self.execute_analysis(job)
                self.notify_completion(job['session_id'], result)
                self.processing_queue.task_done()
            except Empty:
                continue
            except Exception as e:
                logger.error(f"Queue processing error: {e}")


## 📋 System Requirements

### Development Environment
- *Python*: 3.8+ (recommended 3.11+)
- *Memory*: 4GB+ RAM for large datasets
- *Storage*: 2GB+ for models and temporary files
- *OS*: Linux, macOS, Windows (WSL recommended)

### Production Environment
- *Python*: 3.11+
- *Memory*: 8GB+ RAM for concurrent processing
- *Storage*: 10GB+ with fast SSD for optimal performance
- *CPU*: Multi-core processor for parallel processing
- *Network*: High bandwidth for file uploads

### Optional Dependencies
txt
# Production optimizations
redis==4.5.4                # Caching layer
celery==5.3.4               # Async task processing
gunicorn==21.2.0            # WSGI server
supervisord==4.2.5          # Process management

# Monitoring & observability
prometheus-client==0.17.1   # Metrics collection
sentry-sdk==1.32.0          # Error tracking

# Database (optional)
SQLAlchemy==2.0.20          # ORM
psycopg2-binary==2.9.7      # PostgreSQL adapter


## 🛠 Maintenance & Operations

### Regular Maintenance Tasks
python
def perform_maintenance():
    """Regular maintenance operations"""
    # Clean up old files
    cleanup_expired_sessions()
    
    # Optimize model cache
    optimize_model_cache()
    
    # Archive old logs
    archive_old_logs()
    
    # Check disk space
    check_disk_space()
    
    # Validate model integrity
    validate_model_files()

def setup_maintenance_schedule():
    """Setup automated maintenance schedule"""
    import schedule
    
    schedule.every().hour.do(cleanup_expired_sessions)
    schedule.every().day.at("02:00").do(archive_old_logs)
    schedule.every().week.do(validate_model_files)
    
    while True:
        schedule.run_pending()
        time.sleep(60)


## 🔍 Troubleshooting Guide

### Common Issues & Solutions

#### Model Loading Errors
bash
# Check model file permissions
ls -la model/*/saved_model*/

# Verify model file integrity
python -c "import pickle; pickle.load(open('model/super_market/saved_models/trained_pipeline.pkl', 'rb'))"


#### Memory Issues
bash
# Monitor memory usage
python -c "import psutil; print(f'Memory: {psutil.virtual_memory().percent}%')"

# Reduce batch size in config
export PREDICTION_BATCH_SIZE=500


#### API Connection Issues
bash
# Test API connectivity
curl -X GET http://localhost:5000/health

# Check CORS configuration
curl -X OPTIONS http://localhost:5000/api/upload \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST"


### Debug Mode Setup
python
# Enable detailed error logging
app.config['DEBUG'] = True
app.config['PROPAGATE_EXCEPTIONS'] = True
app.config['TESTING'] = True

# Add debug routes
@app.route('/debug/sessions')
def debug_sessions():
    """Debug endpoint to view active sessions"""
    if not app.debug:
        abort(404)
    
    return jsonify({
        'active_sessions': list(session_store._store.keys()),
        'session_count': len(session_store._store),
        'memory_usage': get_memory_usage()
    })


## 📊 Monitoring Dashboard Data

### Metrics Collection
python
class MetricsCollector:
    """Collect and aggregate system metrics"""
    
    def __init__(self):
        self.metrics = {
            'requests_total': 0,
            'requests_failed': 0,
            'analysis_times': [],
            'file_sizes': [],
            'anomaly_rates': []
        }
    
    def record_request(self, endpoint, status_code, duration):
        """Record API request metrics"""
        self.metrics['requests_total'] += 1
        if status_code >= 400:
            self.metrics['requests_failed'] += 1
    
    def record_analysis(self, duration, file_size, anomaly_rate):
        """Record analysis performance metrics"""
        self.metrics['analysis_times'].append(duration)
        self.metrics['file_sizes'].append(file_size)
        self.metrics['anomaly_rates'].append(anomaly_rate)
    
    def get_summary_stats(self):
        """Get summary statistics"""
        return {
            'total_requests': self.metrics['requests_total'],
            'error_rate': self.metrics['requests_failed'] / max(self.metrics['requests_total'], 1),
            'avg_analysis_time': np.mean(self.metrics['analysis_times']) if self.metrics['analysis_times'] else 0,
            'avg_file_size': np.mean(self.metrics['file_sizes']) if self.metrics['file_sizes'] else 0,
            'avg_anomaly_rate': np.mean(self.metrics['anomaly_rates']) if self.metrics['anomaly_rates'] else 0
        }


This completes the comprehensive backend README covering all aspects of the Flask-based API server, ML pipeline, deployment strategies, and operational considerations for the RepoMix platform.
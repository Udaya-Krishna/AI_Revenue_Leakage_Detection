# AI REVENUE LEAKAGE DETECTION
```AI_Revenue_Leakage_Detection
├── .env
├── .gitignore
├── inspect_models.py
├── README.md
├── backend
│   ├── .env
│   ├── .gitignore
│   ├── app.py
│   ├── README.md
│   ├── requirements.txt
│   ├── model
│   │   ├── Readme.md
│   │   ├── super_market
│   │   │   ├── cleaning
│   │   │   │   ├── clean.ipynb
│   │   │   │   ├── cleaning2.ipynb
│   │   │   │   └── train.ipynb
│   │   │   ├── datasets
│   │   │   │   ├── input_dataset_cleaned.csv
│   │   │   │   └── supermarket_dataset.csv
│   │   │   ├── models
│   │   │   │   ├── model.ipynb
│   │   │   │   ├── modelwith_input.ipynb
│   │   │   │   └── Report Generation using_LLM.py
│   │   │   ├── output_datasets
│   │   │   │   ├── anomaly_data.csv
│   │   │   │   ├── new_supermarket_with_predictions.csv
│   │   │   │   └── no_leakage_data.csv
│   │   │   └── saved_models
│   │   │       ├── anomaly_encoder.pkl
│   │   │       ├── leakage_encoder.pkl
│   │   │       └── trained_pipeline.pkl
│   │   └── Telecom
│   │       ├── cleaning
│   │       │   └── cleaning_1.ipynb
│   │       ├── dataset
│   │       │   ├── telecom_billing_dataset.csv
│   │       │   └── telecom_input.csv
│   │       ├── model
│   │       │   ├── model.ipynb
│   │       │   └── model_with_input2.ipynb
│   │       ├── output_dataset
│   │       │   ├── telecom_anomaly_data.csv
│   │       │   ├── telecom_no_leakage_data.csv
│   │       │   └── telecom_predictions.csv
│   │       └── saved_model
│   │           ├── le_anomaly.pkl
│   │           ├── le_leakage.pkl
│   │           └── telecom_pipeline.pkl
│   └── report_generation
│       ├── integrated_analysis.py
│       ├── test.py
│       └── __pycache__
│           └── integrated_analysis.cpython-312.pyc
└── frontend
    ├── .env
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── postcss.config.js
    ├── README.md
    ├── tailwind.config.js
    ├── vite.config.js
    ├── public
    │   └── vite.svg
    └── src
        ├── App.css
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        ├── assets
        │   └── react.svg
        ├── components
        │   ├── common
        │   │   ├── ErrorMessage.jsx
        │   │   ├── FileUpload.jsx
        │   │   ├── LoadingSpinner.jsx
        │   │   └── StatsCard.jsx
        │   ├── HomePage
        │   │   ├── GlobalThemeContext.jsx
        │   │   ├── HomePage.jsx
        │   │   ├── ChatBot
        │   │   │   └── ChatBot.jsx
        │   │   └── Developers
        │   │       └── Developers.jsx
        │   ├── Results
        │   │   └── ResultsPage.jsx
        │   ├── Super_market
        │   │   ├── Old_Super.txt
        │   │   └── Super_market.jsx
        │   ├── Telecommunication
        │   │   ├── old_telecom.txt
        │   │   └── Telecommunication.jsx
        │   └── Visualization
        │       └── VisualizationDashboard.jsx
        └── utils
            ├── api.js
            ├── chartUtils.js
            └── constants.js
```


# RepoMix - AI-Powered Data Analysis & Anomaly Detection Platform

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [User Journey](#user-journey)
5. [Technical Implementation](#technical-implementation)
6. [API Reference](#api-reference)
7. [Data Flow & Processing](#data-flow--processing)
8. [Machine Learning Pipeline](#machine-learning-pipeline)
9. [File Structure](#file-structure)
10. [Setup & Deployment](#setup--deployment)

## Project Overview

RepoMix is a comprehensive web application designed to analyze business datasets for anomalies and revenue leakages. The platform serves two primary domains:
- *Supermarket*: Detects pricing anomalies, missing charges, and usage mismatches
- *Telecom*: Identifies billing inconsistencies and payment status mismatches

The application provides automated analysis through machine learning models, generates professional reports, and offers interactive visualizations to help businesses identify and address operational inefficiencies.

## Architecture

mermaid
graph TD
    subgraph "Client Browser"
        User[👤 User]
        Frontend[🌐 React Frontend<br/>Vite + React Router]
    end

    subgraph "Backend Server (Flask)"
        API[🔗 Flask API Server<br/>app.py]
        FileStorage[📁 File Storage<br/>/uploads, /outputs]
        AnalysisEngine[⚙ Analysis Engine<br/>integrated_analysis.py]
        MLModels[🧠 ML Models<br/>XGBoost + Rules Engine]
        ReportGen[📄 Report Generators<br/>LLM + python-docx]
        LLMService[🤖 Google Generative AI<br/>Summary Generation]
    end

    User --> Frontend
    Frontend <--> API
    API --> FileStorage
    API --> AnalysisEngine
    AnalysisEngine --> MLModels
    AnalysisEngine --> ReportGen
    ReportGen --> LLMService
    ReportGen --> FileStorage


## Tech Stack

### Frontend
- *React 18*: Modern JavaScript UI library
- *Vite*: Fast build tool and development server
- *React Router*: Client-side routing
- *Axios*: HTTP client for API communication
- *Chart.js*: Interactive data visualizations
- *Tailwind CSS*: Utility-first CSS framework
- *Lucide React*: Icon library

### Backend
- *Flask*: Lightweight Python web framework
- *Pandas*: Data manipulation and analysis
- *NumPy*: Numerical computations
- *Scikit-learn*: Machine learning library
- *XGBoost*: Gradient boosting framework
- *python-docx*: Word document generation
- *Google Generative AI*: LLM for report summaries
- *Flask-CORS*: Cross-origin resource sharing

### Storage & Processing
- *CSV Processing*: Pandas + NumPy
- *Session Management*: UUID-based sessions
- *File Storage*: Local filesystem (/uploads, /outputs)
- *Report Generation*: .docx format with embedded charts

## User Journey

### 1. Homepage & Domain Selection
*User Experience*: User lands on a clean, modern homepage with two primary options: Supermarket or Telecom analysis.

*Technical Implementation*: React Router renders HomePage.jsx component at the root path /. Navigation links use React Router's <Link> components to navigate to domain-specific upload pages without full page reloads.

### 2. File Upload
*User Experience*: User selects their domain and uploads a CSV file via drag-and-drop or file browser.

*Technical Implementation*:
- FileUpload.jsx component handles file selection using HTML5 file input
- File validation occurs client-side (CSV format, size limits)
- FormData object created with file and domain parameters
- Axios POST request to /api/upload endpoint

### 3. Analysis Processing
*User Experience*: Loading spinner shows while analysis runs in background.

*Technical Implementation*:
- Flask receives multipart/form-data request
- File saved to /uploads/{session_id}.csv
- run_integrated_analysis() function triggered
- Domain-specific ML model loaded from /backend/model/
- Anomaly detection and prediction algorithms executed
- Results stored in JSON format

### 4. Results Display
*User Experience*: Comprehensive dashboard showing summary statistics, anomaly highlights, and navigation to detailed views.

*Technical Implementation*:
- Frontend polls /api/results/{session_id} endpoint
- JSON response contains metrics, anomalies, and visualization data
- React state updated to trigger component re-renders
- Summary cards and anomaly tables dynamically generated

### 5. Interactive Visualizations
*User Experience*: Rich dashboard with interactive charts showing anomaly distributions, trends, and patterns.

*Technical Implementation*:
- VisualizationDashboard.jsx component renders Chart.js visualizations
- Data from /api/results transformed into Chart.js format
- Responsive charts with hover effects and interactive legends

### 6. Report Generation & Download
*User Experience*: Two report options available - concise summary and detailed analysis, both downloadable as professional documents.

*Technical Implementation*:
- *Summary Report*: LLM generates executive summary via Google Generative AI
- *Detailed Report*: python-docx creates comprehensive .docx with tables, charts, and explanations
- Download endpoints stream files directly to user browser

## Technical Implementation

### Frontend Architecture

#### Component Structure

src/
├── components/
│   ├── HomePage/           # Landing page components
│   ├── Super_market/       # Supermarket domain pages
│   ├── Telecommunication/  # Telecom domain pages
│   ├── Results/           # Results display components
│   ├── Visualization/     # Chart dashboard
│   ├── ChatBot/           # Interactive chatbot
│   └── common/            # Reusable UI components
├── utils/
│   ├── api.js            # Centralized API calls
│   ├── chartUtils.js     # Chart configuration utilities
│   └── constants.js      # Application constants
└── App.jsx               # Main routing component


#### State Management
- *Local Component State*: React's useState for form inputs and UI state
- *Session Management*: URL parameters for session IDs
- *API State*: Custom hooks for loading states and error handling

#### API Integration
javascript
// File upload with FormData
export const uploadFile = async (file, domain) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('domain', domain);
  
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Results fetching
export const getResults = async (sessionId) => {
  const response = await api.get(`/results/${sessionId}`);
  return response.data;
};


### Backend Architecture

#### Flask Application Structure
python
# Main Flask app with CORS enabled
app = Flask(__name__)
CORS(app)

# File upload configuration
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['OUTPUT_FOLDER'] = 'outputs'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB limit


#### Core Processing Pipeline
python
def run_integrated_analysis(filepath, domain, session_id):
    # 1. Load and validate CSV data
    df = pd.read_csv(filepath)
    
    # 2. Load domain-specific model
    if domain == 'supermarket':
        model = load_model('backend/model/super_market/models/model.pkl')
    else:
        model = load_model('backend/model/Telecom/model/model.pkl')
    
    # 3. Feature engineering and preprocessing
    processed_data = preprocess_data(df, domain)
    
    # 4. Run anomaly detection
    anomalies = detect_anomalies(processed_data, model)
    
    # 5. Generate metrics and visualizations
    metrics = calculate_metrics(df, anomalies)
    viz_data = prepare_visualization_data(anomalies)
    
    # 6. Create reports
    summary = generate_llm_summary(anomalies, metrics)
    detailed_report = create_detailed_report(anomalies, metrics, session_id)
    
    # 7. Store results
    results = {
        'session_id': session_id,
        'domain': domain,
        'metrics': metrics,
        'summary': summary,
        'anomalies': anomalies,
        'viz_data': viz_data
    }
    
    save_results(session_id, results)
    return results


## API Reference

### Upload Endpoint

POST /api/upload
Content-Type: multipart/form-data

Parameters:
- file: CSV file (required)
- domain: "supermarket" | "telecom" (required)

Response:
{
  "session_id": "uuid-string",
  "message": "File uploaded successfully",
  "status": "processing"
}

Error Codes:
- 400: Missing file or domain
- 415: Invalid file format
- 413: File too large
- 500: Processing error


### Results Endpoint

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
    "confidence_avg": 0.87,
    "generated_at": "2025-09-02T10:30:00Z"
  },
  "anomalies": [
    {
      "id": "A-0001",
      "type": "Missing Charges",
      "severity": "high",
      "row_reference": 1247,
      "confidence": 0.92,
      "evidence": {
        "columns": ["price", "tax"],
        "expected_value": 123.45,
        "actual_value": 0,
        "description": "Tax calculation missing for high-value item"
      }
    }
  ],
  "visualization_data": {
    "anomaly_by_type": [
      {"label": "Missing Charges", "count": 120, "percentage": 23},
      {"label": "Usage Mismatch", "count": 89, "percentage": 17}
    ],
    "severity_distribution": [
      {"severity": "high", "count": 45},
      {"severity": "medium", "count": 234},
      {"severity": "low", "count": 244}
    ],
    "trend_data": [
      {"date": "2025-08-01", "anomaly_count": 12},
      {"date": "2025-08-02", "anomaly_count": 8}
    ]
  },
  "download_links": {
    "detailed_report": "/api/download_detailed_report/{session_id}",
    "anomalies_csv": "/api/download_anomalies/{session_id}"
  }
}


### Download Endpoints

GET /api/download_detailed_report/{session_id}
Response: application/vnd.openxmlformats-officedocument.wordprocessingml.document

GET /api/download_anomalies/{session_id}
Response: text/csv


## Data Flow & Processing

### 1. File Upload Flow

User selects CSV → FileUpload.jsx validates → FormData created → 
Axios POST to /api/upload → Flask receives → File saved to /uploads/ → 
Session ID generated → Response sent to frontend


### 2. Analysis Pipeline

CSV loaded into Pandas DataFrame → Data preprocessing & feature engineering → 
Domain model loaded (XGBoost/Rules) → Anomaly detection executed → 
Metrics calculated → Visualization data prepared → Results cached


### 3. Report Generation Flow

Analysis results → LLM prompt creation → Google Generative AI call → 
Summary generated → python-docx document creation → Tables & charts added → 
File saved to /outputs/ → Download link provided


### 4. Visualization Rendering

Frontend requests results → JSON data received → Chart.js configuration → 
Interactive charts rendered → User interactions handled → 
Real-time updates on hover/click


## Machine Learning Pipeline

### Training Phase (Offline)
The ML models are pre-trained using historical datasets:

#### Supermarket Model
- *Algorithm*: XGBoost Classifier + Rule-based validation
- *Features*: Price, quantity, tax, discount, product category, timestamp
- *Anomaly Types*: Missing charges, incorrect rates, usage mismatches
- *Training Data*: Historical sales transactions with labeled anomalies

#### Telecom Model
- *Algorithm*: XGBoost Classifier + Statistical thresholds
- *Features*: Usage patterns, billing amounts, payment history, service types
- *Anomaly Types*: Payment status mismatches, billing inconsistencies
- *Training Data*: Customer billing records with known issues

### Inference Phase (Online)
Real-time prediction when users upload data:

python
def detect_anomalies(data, model, domain):
    # Preprocess user data (same pipeline as training)
    features = engineer_features(data, domain)
    
    # Get anomaly scores from model
    anomaly_scores = model.predict_proba(features)
    
    # Apply domain-specific thresholds
    anomalies = []
    for idx, score in enumerate(anomaly_scores):
        if score > ANOMALY_THRESHOLD:
            anomaly = {
                'id': f'A-{idx:04d}',
                'row_reference': idx,
                'confidence': score,
                'type': classify_anomaly_type(data.iloc[idx], domain),
                'severity': calculate_severity(score),
                'evidence': extract_evidence(data.iloc[idx], domain)
            }
            anomalies.append(anomaly)
    
    return anomalies


## File Structure


RepoMix/
├── frontend/                           # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── HomePage/
│   │   │   │   ├── HomePage.jsx        # Main landing page
│   │   │   │   ├── Developers.jsx      # Team information
│   │   │   │   └── ChatBot/
│   │   │   │       └── ChatBot.jsx     # Interactive chatbot
│   │   │   ├── Super_market/
│   │   │   │   └── Super_market.jsx    # Supermarket upload page
│   │   │   ├── Telecommunication/
│   │   │   │   └── Telecommunication.jsx # Telecom upload page
│   │   │   ├── Results/
│   │   │   │   └── ResultsPage.jsx     # Analysis results display
│   │   │   ├── Visualization/
│   │   │   │   └── VisualizationDashboard.jsx # Interactive charts
│   │   │   └── common/
│   │   │       ├── FileUpload.jsx      # Reusable file upload
│   │   │       └── LoadingSpinner.jsx  # Loading states
│   │   ├── utils/
│   │   │   ├── api.js                  # Centralized API calls
│   │   │   ├── chartUtils.js           # Chart configuration
│   │   │   └── constants.js            # App constants
│   │   └── App.jsx                     # Main routing component
│   ├── package.json                    # Dependencies
│   └── vite.config.js                  # Build configuration
├── backend/                            # Flask application
│   ├── app.py                          # Main Flask server
│   ├── model/
│   │   ├── super_market/
│   │   │   └── models/
│   │   │       └── modelwith_input.ipynb # Supermarket ML model
│   │   └── Telecom/
│   │       └── model/
│   │           └── model_with_input2.ipynb # Telecom ML model
│   ├── report_generation/
│   │   ├── integrated_analysis.py      # Core analysis engine
│   │   └── Report Generation using_LLM.py # LLM report generation
│   ├── uploads/                        # User uploaded files
│   └── outputs/                        # Generated reports & cache
└── README.md                          # This file


## User Journey - Step by Step

### Step 1: Homepage Landing
*What User Sees*: Clean interface with domain selection cards and integrated chatbot
*Behind the Scenes*: 
- React application loads and renders HomePage.jsx
- React Router manages URL state at /
- Component state initializes with default values

### Step 2: Domain Selection & Upload
*What User Sees*: File upload interface with drag-and-drop area
*Behind the Scenes*:
javascript
// User clicks "Supermarket" → React Router navigates to /supermarket
// SuperMarket.jsx component renders with FileUpload child component

const handleFileUpload = async (file) => {
  setIsLoading(true);
  try {
    const result = await uploadFile(file, 'supermarket');
    navigate(`/results/${result.session_id}`);
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};


### Step 3: Backend Processing
*What User Sees*: Loading spinner with progress indicators
*Behind the Scenes*:
python
@app.route('/api/upload', methods=['POST'])
def upload_file():
    # Extract file and domain
    file = request.files['file']
    domain = request.form['domain']
    
    # Generate unique session
    session_id = str(uuid.uuid4())
    
    # Save uploaded file
    filepath = os.path.join(UPLOAD_FOLDER, f"{session_id}.csv")
    file.save(filepath)
    
    # Trigger analysis pipeline
    try:
        results = run_integrated_analysis(filepath, domain, session_id)
        store_session_results(session_id, results)
        return jsonify({"session_id": session_id, "status": "completed"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


### Step 4: Results Display
*What User Sees*: Dashboard with summary statistics, anomaly counts, and action buttons
*Behind the Scenes*:
javascript
// ResultsPage.jsx
useEffect(() => {
  const fetchResults = async () => {
    try {
      const data = await getResults(sessionId);
      setResults(data);
      setAnomalies(data.anomalies);
      setMetrics(data.metrics);
    } catch (error) {
      setError('Failed to load results');
    }
  };
  
  fetchResults();
}, [sessionId]);


### Step 5: Visualization Dashboard
*What User Sees*: Interactive charts with filters and drill-down capabilities
*Behind the Scenes*:
javascript
// VisualizationDashboard.jsx
const chartData = {
  labels: results.viz_data.anomaly_by_type.map(item => item.label),
  datasets: [{
    data: results.viz_data.anomaly_by_type.map(item => item.count),
    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
  }]
};

return <Pie data={chartData} options={chartOptions} />;


### Step 6: Report Downloads
*What User Sees*: Download buttons that trigger immediate file downloads
*Behind the Scenes*:
python
@app.route('/api/download_detailed_report/<session_id>')
def download_detailed_report(session_id):
    report_path = os.path.join(OUTPUT_FOLDER, f"{session_id}_detailed.docx")
    
    if os.path.exists(report_path):
        return send_file(report_path, as_attachment=True, 
                        download_name=f"Analysis_Report_{session_id[:8]}.docx")
    else:
        return jsonify({"error": "Report not found"}), 404


## Machine Learning Implementation

### Model Architecture
Both domain models follow a hybrid approach:

#### Supermarket Anomaly Detection
python
class SupermarketAnomalyDetector:
    def __init__(self):
        self.model = XGBClassifier()
        self.feature_columns = ['price', 'quantity', 'tax_rate', 'discount', 'category_encoded']
        
    def detect_anomalies(self, data):
        # Feature engineering
        features = self.engineer_features(data)
        
        # XGBoost predictions
        anomaly_scores = self.model.predict_proba(features)[:, 1]
        
        # Rule-based validation
        rule_anomalies = self.apply_business_rules(data)
        
        # Combine results
        combined_anomalies = self.merge_detections(anomaly_scores, rule_anomalies)
        
        return combined_anomalies
    
    def apply_business_rules(self, data):
        anomalies = []
        
        # Rule: Items with price but no tax
        missing_tax = data[(data['price'] > 0) & (data['tax'] == 0)]
        
        # Rule: Discount greater than item price
        invalid_discount = data[data['discount'] > data['price']]
        
        return anomalies


### Feature Engineering Pipeline
python
def engineer_features(df, domain):
    if domain == 'supermarket':
        # Price-based features
        df['price_per_unit'] = df['total_price'] / df['quantity']
        df['tax_percentage'] = df['tax_amount'] / df['price']
        df['discount_percentage'] = df['discount'] / df['price']
        
        # Temporal features
        df['hour'] = pd.to_datetime(df['timestamp']).dt.hour
        df['day_of_week'] = pd.to_datetime(df['timestamp']).dt.dayofweek
        df['is_weekend'] = df['day_of_week'].isin([5, 6])
        
        # Category encoding
        df['category_encoded'] = LabelEncoder().fit_transform(df['category'])
        
    elif domain == 'telecom':
        # Usage patterns
        df['usage_per_day'] = df['total_usage'] / df['billing_days']
        df['cost_per_unit'] = df['bill_amount'] / df['total_usage']
        
        # Payment behavior
        df['days_since_payment'] = (pd.to_datetime('today') - pd.to_datetime(df['last_payment'])).dt.days
        df['payment_delay'] = df['days_since_payment'] > 30
        
    return df


## Report Generation System

### LLM Summary Generation
python
def generate_llm_summary(anomalies, metrics):
    prompt = f"""
    Analyze the following business data anomalies and provide an executive summary:
    
    Total Records: {metrics['total_rows']}
    Anomalies Detected: {len(anomalies)}
    Anomaly Rate: {metrics['anomaly_rate']:.2%}
    
    Key Anomaly Types:
    {format_anomaly_breakdown(anomalies)}
    
    Provide a 3-4 sentence executive summary highlighting the most critical findings
    and recommended actions.
    """
    
    response = genai.generate_text(prompt=prompt)
    return response.text


### Detailed Report Creation
python
def create_detailed_report(anomalies, metrics, session_id):
    doc = Document()
    
    # Title and header
    doc.add_heading('Data Analysis Report', 0)
    doc.add_paragraph(f'Generated on: {datetime.now().strftime("%Y-%m-%d %H:%M")}')
    
    # Executive summary
    doc.add_heading('Executive Summary', level=1)
    summary_para = doc.add_paragraph(metrics['llm_summary'])
    
    # Metrics table
    doc.add_heading('Key Metrics', level=1)
    table = doc.add_table(rows=1, cols=2)
    table.style = 'Table Grid'
    
    metrics_data = [
        ('Total Records Analyzed', metrics['total_rows']),
        ('Anomalies Detected', len(anomalies)),
        ('Overall Anomaly Rate', f"{metrics['anomaly_rate']:.2%}"),
        ('Average Confidence', f"{metrics['confidence_avg']:.2f}")
    ]
    
    for key, value in metrics_data:
        row = table.add_row().cells
        row[0].text = key
        row[1].text = str(value)
    
    # Detailed anomaly breakdown
    doc.add_heading('Anomaly Details', level=1)
    for anomaly in anomalies[:50]:  # Limit to top 50
        doc.add_heading(f"Anomaly {anomaly['id']}", level=2)
        doc.add_paragraph(f"Type: {anomaly['type']}")
        doc.add_paragraph(f"Severity: {anomaly['severity']}")
        doc.add_paragraph(f"Confidence: {anomaly['confidence']:.2f}")
        doc.add_paragraph(f"Evidence: {anomaly['evidence']['description']}")
    
    # Save document
    doc_path = os.path.join(OUTPUT_FOLDER, f"{session_id}_detailed.docx")
    doc.save(doc_path)
    
    return doc_path


## Error Handling & Validation

### Frontend Validation
javascript
const validateFile = (file) => {
  const errors = [];
  
  if (!file) {
    errors.push('Please select a file');
  }
  
  if (file && !file.name.toLowerCase().endsWith('.csv')) {
    errors.push('Only CSV files are supported');
  }
  
  if (file && file.size > 16 * 1024 * 1024) {
    errors.push('File size must be less than 16MB');
  }
  
  return errors;
};


### Backend Error Handling
python
def safe_analysis_wrapper(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except FileNotFoundError as e:
            return {"error": "File not found", "code": 404}
        except pd.errors.EmptyDataError:
            return {"error": "CSV file is empty", "code": 400}
        except Exception as e:
            logger.error(f"Analysis failed: {str(e)}")
            return {"error": "Analysis failed", "code": 500}
    return wrapper

@safe_analysis_wrapper
def run_integrated_analysis(filepath, domain, session_id):
    # Analysis implementation
    pass


## Session Management

### Session Lifecycle
python
# Session creation
session_id = str(uuid.uuid4())
session_data = {
    'created_at': datetime.now(),
    'domain': domain,
    'filepath': filepath,
    'status': 'processing'
}

# Session storage (in-memory for demo, Redis/DB for production)
sessions_store[session_id] = session_data

# Session cleanup (TTL implementation)
def cleanup_expired_sessions():
    cutoff_time = datetime.now() - timedelta(hours=24)
    expired_sessions = [
        sid for sid, data in sessions_store.items() 
        if data['created_at'] < cutoff_time
    ]
    
    for session_id in expired_sessions:
        cleanup_session_files(session_id)
        del sessions_store[session_id]


## Performance Considerations

### Frontend Optimizations
- *Lazy Loading*: Components loaded on-demand using React.lazy()
- *Memoization*: Expensive calculations cached with useMemo()
- *Virtualization*: Large result sets rendered with virtual scrolling
- *Image Optimization*: Charts cached and compressed

### Backend Optimizations
- *Async Processing*: File analysis runs in background threads
- *Caching*: Results cached in memory/Redis for quick retrieval
- *Model Loading*: Models loaded once at startup, not per request
- *Streaming*: Large files streamed for downloads

## Security Measures

### File Upload Security
python
ALLOWED_EXTENSIONS = {'csv'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB

def secure_filename_custom(filename):
    # Remove path traversal attempts
    filename = filename.replace('..', '')
    # Sanitize special characters
    filename = re.sub(r'[^a-zA-Z0-9._-]', '', filename)
    return filename


### Data Privacy
- Files automatically deleted after 24 hours
- Session IDs are UUIDs (cryptographically random)
- No personally identifiable information logged
- CORS configured for specific domains only

## Setup & Deployment

### Development Setup
bash
# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py

# Frontend setup
cd frontend
npm install
npm run dev


### Production Deployment
bash
# Build frontend
cd frontend
npm run build

# Deploy with gunicorn
cd backend
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Nginx configuration (example)
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}


### Environment Variables
bash
# Backend .env
FLASK_ENV=production
GOOGLE_AI_API_KEY=your_api_key
UPLOAD_FOLDER=/app/uploads
OUTPUT_FOLDER=/app/outputs
MAX_FILE_SIZE=16777216
SESSION_TTL=86400


## Monitoring & Analytics

### Health Checks
python
@app.route('/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "models_loaded": len(loaded_models),
        "active_sessions": len(sessions_store)
    })


### Usage Metrics
- Upload success/failure rates
- Analysis processing times
- Model accuracy scores
- User engagement patterns
- Error frequency and types

## Future Enhancements

### Planned Features
- *Real-time Processing*: WebSocket connections for live analysis updates
- *Multi-format Support*: Excel, JSON, Parquet file uploads
- *Advanced Visualizations*: 3D charts, geographic mapping
- *Collaborative Features*: Team workspaces, shared reports
- *API Integration*: Direct connections to business systems
- *Custom Models*: User-trained models for specific use cases

### Technical Improvements
- *Microservices*: Split analysis engine into separate service
- *Database Integration*: PostgreSQL for persistent storage
- *Caching Layer*: Redis for session and result caching
- *Container Deployment*: Docker + Kubernetes orchestration
- *CI/CD Pipeline*: Automated testing and deployment
- *Monitoring Stack*: Prometheus + Grafana dashboards

---

## Contact & Support

For technical questions or contributions, please refer to the development team contacts in the Developers.jsx component or submit issues through the project repository.

*Note*: This application is designed for business data analysis and should be used in compliance with your organization's data privacy and security policies.
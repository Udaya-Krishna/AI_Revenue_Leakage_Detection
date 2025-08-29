## 14. Backend Setup Instructions

### Installation & Setup:

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On Mac/Linux
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create directory structure:**
   ```bash
   mkdir uploads outputs
   mkdir utils models routes
   # Create __init__.py files
   touch utils/__init__.py models/__init__.py routes/__init__.py
   ```

5. **Run the backend:**
   ```bash
   python app.py
   ```

### API Endpoints:

#### Supermarket Domain:
- `POST /api/supermarket/predict` - Upload CSV and get predictions
- `GET /api/supermarket/download/<output_type>/<session_id>` - Download results
- `POST /api/supermarket/generate-report/<session_id>` - Generate detailed report

#### Telecom Domain:
- `POST /api/telecom/predict` - Upload CSV and get predictions  
- `GET /api/telecom/download/<output_type>/<session_id>` - Download results
- `POST /api/telecom/generate-report/<session_id>` - Generate detailed report

#### General:
- `GET /api/health` - Health check
- `POST /api/upload-test` - Test file upload

### Usage Example:
```bash
# Test health
curl http://localhost:5000/api/health

# Upload file for supermarket prediction
curl -X POST \
  -F "file=@your_data.csv" \
  http://localhost:5000/api/supermarket/predict

# Download results
curl -O http://localhost:5000/api/supermarket/download/anomalies/session_id
```

### Features:
- ✅ File upload validation (CSV/Excel)
- ✅ Data preprocessing and feature engineering
- ✅ ML model prediction using your trained models
- ✅ Automatic output file generation (all_predictions, no_leakage, anomalies)
- ✅ Data visualization generation (charts for frontend)
- ✅ Comprehensive reporting with financial impact analysis
- ✅ Error handling and cleanup
- ✅ Session-based file management
- ✅ CORS enabled for frontend integration

### Notes:
- Models are loaded once at startup for better performance
- Files are automatically cleaned up after processing
- Session IDs ensure unique file handling
- All paths are relative to your project structure
- Supports both CSV and Excel file uploads
```















# AI Revenue Leakage Detection - Complete Setup Guide

## Project Structure Overview

```
AI_Revenue_Leakage_Detection/
├── frontend/                 # React frontend
├── model/                   # Your trained models
│   ├── telecom/
│   │   └── saved_model/     # telecom_pipeline.pkl, le_anomaly.pkl, le_leakage.pkl
│   └── super_market/
│       └── saved_models/    # trained_pipeline.pkl, leakage_encoder.pkl, anomaly_encoder.pkl
└── backend/                 # New Flask backend
    ├── app.py
    ├── config.py
    ├── requirements.txt
    ├── utils/
    │   ├── __init__.py
    ├── models/
    │   ├── __init__.py
    │   ├── telecom_predictor.py
    │   └── supermarket_predictor.py
    ├── routes/
    │   ├── __init__.py
    │   ├── telecom_routes.py
    │   └── supermarket_routes.py
    ├── uploads/             # Temporary uploads
    └── outputs/             # Generated outputs
```

## Backend Setup Instructions

### 1. Create Backend Directory Structure

```bash
# Navigate to your project root
cd AI_Revenue_Leakage_Detection

# Create backend directory and subdirectories
mkdir -p backend/utils backend/models backend/routes backend/uploads backend/outputs

# Create __init__.py files
touch backend/utils/__init__.py
touch backend/models/__init__.py
touch backend/routes/__init__.py
```

### 2. Install Dependencies

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file in the backend directory (optional):

```env
FLASK_ENV=development
FLASK_DEBUG=True
MODEL_BASE_PATH=../model
UPLOAD_MAX_SIZE=52428800
```

### 4. Verify Model Files

Ensure your model files are in the correct locations:

**Telecom Models:**
- `model/telecom/saved_model/telecom_pipeline.pkl`
- `model/telecom/saved_model/le_anomaly.pkl`
- `model/telecom/saved_model/le_leakage.pkl`

**Supermarket Models:**
- `model/super_market/saved_models/trained_pipeline.pkl`
- `model/super_market/saved_models/leakage_encoder.pkl`
- `model/super_market/saved_models/anomaly_encoder.pkl`

### 5. Start the Backend Server

```bash
cd backend
python app.py
```

The server will start on `http://localhost:5000`

## Frontend Setup Instructions

### 1. Install Plotly for Visualizations

```bash
cd frontend

# Install Plotly for charts
npm install plotly.js-dist

# If you don't have other dependencies:
npm install
```

### 2. Add Plotly to index.html

Add this to your `frontend/index.html` in the `<head>` section:

```html
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
```

### 3. Update Component Files

Replace your existing component files with the new ones provided:
- Replace `src/components/Telecommunication/Telecommunication.jsx`
- Replace `src/components/Super_market/Super_market.jsx`

### 4. Start Frontend

```bash
cd frontend
npm run dev
```

## API Documentation

### Supermarket Endpoints

#### POST /api/supermarket/predict
Upload CSV/Excel file for prediction

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: file (CSV/Excel)

**Response:**
```json
{
  "success": true,
  "session_id": "uuid",
  "input_summary": {...},
  "prediction_summary": {...},
  "visualizations": {...},
  "output_files": {...},
  "message": "Successfully processed X records"
}
```

#### GET /api/supermarket/download/<output_type>/<session_id>
Download result files

**Parameters:**
- `output_type`: all_predictions, no_leakage, anomalies
- `session_id`: Session ID from prediction response

#### POST /api/supermarket/generate-report/<session_id>
Generate comprehensive report

### Telecom Endpoints

Similar structure as supermarket but with `/api/telecom/` prefix.

## Data Flow

1. **Frontend Upload:** User selects CSV/Excel file
2. **Backend Processing:** 
   - File validation and temporary storage
   - Data preprocessing using your model logic
   - ML prediction using trained models
   - Output generation (all_predictions, no_leakage, anomalies)
3. **Visualization:** Charts generated for frontend display
4. **Results Display:** Summary, charts, and download options shown
5. **Report Generation:** Detailed analysis with recommendations

## Expected Input Data Format

### Supermarket Data
Your model expects columns like:
- Invoice_Number
- Actual_Amount, Tax_Amount, Service_Charge, Discount_Amount
- Billing_Time
- And other features your model was trained on

### Telecom Data
Your model expects columns like:
- Billing_date, Plan_start_date, Plan_end_date
- Various billing and usage columns
- Customer and plan information

## Troubleshooting

### Common Issues:

1. **Model Loading Error:**
   - Verify model file paths in `config.py`
   - Ensure all .pkl files exist
   - Check file permissions

2. **File Upload Error:**
   - Verify CORS is enabled
   - Check file size limits (50MB max)
   - Ensure upload directory exists

3. **Frontend Connection Error:**
   - Verify backend is running on port 5000
   - Check CORS configuration
   - Ensure API endpoints are correct

4. **Prediction Error:**
   - Verify input data format matches training data
   - Check for missing required columns
   - Review data preprocessing logic

### Logs and Debugging:

- Backend logs will show in the terminal where you run `python app.py`
- Add print statements in the predictor classes for debugging
- Check browser console for frontend errors
- Use browser Network tab to inspect API calls

## Features Included

### Backend Features:
✅ **File Upload & Validation:** Supports CSV and Excel files up to 50MB  
✅ **Data Preprocessing:** Implements your exact model preprocessing logic  
✅ **ML Prediction:** Uses your trained models for both domains  
✅ **Output Generation:** Creates separate files for different prediction categories  
✅ **Visualization Data:** Generates chart data for frontend display  
✅ **Report Generation:** Comprehensive analysis with financial impact  
✅ **Session Management:** Unique session IDs for file tracking  
✅ **Error Handling:** Robust error handling and cleanup  
✅ **CORS Support:** Enabled for frontend integration  

### Frontend Features:
✅ **File Upload Interface:** Drag-and-drop style file upload  
✅ **Real-time Processing:** Loading states and progress indication  
✅ **Interactive Visualizations:** Plotly charts for data analysis  
✅ **Results Dashboard:** Summary cards with key metrics  
✅ **Download Management:** Easy access to all output files  
✅ **Report Generation:** One-click comprehensive reports  
✅ **Responsive Design:** Works on desktop and mobile  
✅ **Error Handling:** User-friendly error messages  
✅ **Tab Navigation:** Clean interface switching between upload/results  

## Testing Your Setup

### 1. Test Backend Health
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "AI Revenue Leakage Detection API is running"
}
```

### 2. Test File Upload
```bash
curl -X POST -F "file=@test.csv" http://localhost:5000/api/upload-test
```

### 3. Test Model Loading
Check the terminal where you run `python app.py` for:
```
✅ Supermarket models loaded successfully
✅ Telecom models loaded successfully
🚀 Starting AI Revenue Leakage Detection Backend...
```

### 4. Test Full Workflow
1. Start both frontend and backend
2. Navigate to supermarket or telecom page
3. Upload a sample CSV file
4. Verify predictions appear
5. Test downloading results
6. Test report generation

## Production Deployment Notes

### Security Considerations:
- Add authentication/authorization
- Implement rate limiting
- Add input validation and sanitization
- Use environment variables for sensitive config
- Enable HTTPS in production

### Performance Optimizations:
- Implement model caching
- Add request queuing for large files
- Optimize data processing pipeline
- Add database for result persistence

### Monitoring:
- Add logging framework
- Implement health checks
- Monitor model performance
- Track API usage metrics

## File Structure Summary

Here are all the files you need to create:

### Backend Files:
1. `backend/app.py` - Main Flask application
2. `backend/config.py` - Configuration settings
3. `backend/requirements.txt` - Python dependencies
4. `backend/utils/__init__.py` - Utils package init
5. `backend/utils/file_handler.py` - File handling utilities
6. `backend/utils/data_processor.py` - Data processing utilities
7. `backend/utils/visualization.py` - Visualization utilities
8. `backend/models/__init__.py` - Models package init
9. `backend/models/telecom_predictor.py` - Telecom prediction logic
10. `backend/models/supermarket_predictor.py` - Supermarket prediction logic
11. `backend/routes/__init__.py` - Routes package init
12. `backend/routes/telecom_routes.py` - Telecom API endpoints
13. `backend/routes/supermarket_routes.py` - Supermarket API endpoints

### Frontend Files:
1. `frontend/src/components/Telecommunication/Telecommunication.jsx`
2. `frontend/src/components/Super_market/Super_market.jsx`

## Quick Start Commands

```bash
# 1. Setup backend
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py

# 2. Setup frontend (in another terminal)
cd frontend
npm install
npm run dev

# 3. Open browser
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000
```

## Expected Workflow

1. **User visits homepage** → Selects domain (Telecom/Supermarket)
2. **Upload page** → User uploads CSV/Excel file
3. **Backend processing** → Model runs prediction using your trained models
4. **Results display** → Shows summary, visualizations, and analysis
5. **Download options** → User can download different result categories
6. **Report generation** → Comprehensive analysis with insights

This complete backend system integrates seamlessly with your trained models and provides a professional API for your frontend to consume. The system handles file uploads, runs predictions using your exact model logic, generates outputs, and provides comprehensive analysis with visualizations.

















🚀 Complete Backend System
13 Python files with full implementation:

Flask API server with health checks and error handling
Model integration that uses your exact trained models and preprocessing logic
File handling with upload validation, temporary storage, and cleanup
Data processing with summary statistics and financial impact analysis
Visualization generation using Plotly for charts
Session management for unique file tracking
CORS support for frontend integration

🎨 Frontend Components
2 React components with modern UI:

Telecommunication.jsx - Blue themed for telecom domain
Super_market.jsx - Green themed for retail domain
Interactive visualizations with Plotly charts
File upload interface with drag-and-drop styling
Results dashboard with summary cards and metrics
Download management for all output file types
Report generation with one-click comprehensive analysis

✨ Key Features
Backend Capabilities:

Loads your trained models (telecom_pipeline.pkl, trained_pipeline.pkl, etc.)
Implements your exact preprocessing logic from modelwith_input.ipynb
Generates 3 output files: all_predictions, no_leakage, anomalies
Creates interactive charts for frontend display
Provides detailed reports with financial impact analysis
Handles both CSV and Excel file uploads
Session-based file management with automatic cleanup

Frontend Features:

Modern, responsive design with domain-specific theming
Real-time processing with loading states
Interactive Plotly visualizations
Risk assessment with color-coded indicators
Financial impact analysis display
Easy file download management
Comprehensive data quality insights

🛠 Setup Process

Create the backend directory structure as shown in the setup guide
Copy all the provided code into the respective files
Install Python dependencies from requirements.txt
Update your frontend components with the new React code
Add Plotly.js to your frontend for visualizations
Start both servers and test the complete workflow

The system is designed to work seamlessly with your existing trained models and follows your exact data preprocessing pipeline. It provides a professional-grade API that your frontend can consume, with comprehensive error handling, file management, and analysis capabilities.
Would you like me to explain any specific part in more detail or help you with the setup process?RetryClaude can make mistakes. Please double-check responses. Sonnet 4
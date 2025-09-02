# AI REVENUE LEAKAGE DETECTION
```
AI_Revenue_Leakage_Detection
├── .env
├── .gitignore
├── inspect_models.py
├── README.md
├── backend
│   ├── .env
│   ├── .gitignore
│   ├── app.py
│   ├── requirements.txt
│   ├── model
│   │   ├── super_market
│   │   │   ├── cleaning/
│   │   │   ├── datasets/
│   │   │   ├── models/
│   │   │   ├── output_datasets/
│   │   │   └── saved_models
│   │   │       ├── anomaly_encoder.pkl
│   │   │       ├── leakage_encoder.pkl
│   │   │       └── trained_pipeline.pkl
│   │   └── Telecomsuper_market
│   │       ├── cleaning/
│   │       ├── dataset/
│   │       ├── model/
│   │       ├── output_dataset/
│   │       └── saved_model
│   │           ├── le_anomaly.pkl
│   │           ├── le_leakage.pkl
│   │           └── telecom_pipeline.pkl
│   └── report_generation
│       └── integrated_analysis.py
|
└── frontend
    ├── .env
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── vite.config.js
    ├── public
    │   └── vite.svg
    └── src/
        
```



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

*Revenue leak hunter AI* is a comprehensive web application designed to analyze business datasets for anomalies and revenue leakages. The platform serves two primary domains:
- *Supermarket*: Detects pricing anomalies, missing charges, and usage mismatches
- *Telecom*: Identifies billing inconsistencies and payment status mismatches

The application provides automated analysis through machine learning models, generates professional reports, and offers interactive visualizations to help businesses identify and address operational inefficiencies.

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

## Architecture



## Tech Stack

### Frontend
- *React.js*
- *Build Tool: Vite*
- *Styling: Tailwind CSS*
- *Data Visualization: Chart.js*
- *State Management: React Context API*

### Backend
- *Core: Python 3.8+*
- *Web Framework: Flask*
- *Data Processing: Pandas, NumPy*
- *Machine Learning: Scikit-learn, Joblib (Model Persistence)*
- *AI Integration: Google’s Gemini API*
- *Visualization: Matplotlib, Seaborn, Plotly*

### Storage & Processing
- *CSV Processing*: Pandas + NumPy
- *Session Management*: UUID-based sessions
- *File Storage*: Local filesystem (/uploads, /outputs)
- *Report Generation*: .docx format with embedded charts


## Setup & Deployment

### Development Setup
bash
# Backend setup
```cd backend```

```python -m venv venv```

```source venv/bin/activate  # On Windows: venv\Scripts\activate```

```pip install -r requirements.txt```

```python app.py```

# Frontend Setup
```cd frontend```

```npm install```

# Start frontend server
```npm run dev```


# Start backend server
```cd backend```

```python app.py```




### Environment Variables
bash
# Backend .env
```GEMINI_API_KEY=your_api_key```



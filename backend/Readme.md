# AI Revenue Leakage Detection System

A comprehensive AI-powered system for detecting revenue leakages in telecom and supermarket billing workflows using machine learning algorithms.

## 🌟 Features

- **Multi-Domain Support**: Telecom and Supermarket revenue analysis
- **Real-time Processing**: Upload and analyze datasets instantly
- **Advanced ML Models**: XGBoost-based prediction with high accuracy
- **Interactive Dashboard**: Modern React frontend with beautiful visualizations
- **Comprehensive Reporting**: Generate detailed business intelligence reports
- **File Export**: Download results in multiple formats (CSV, JSON)

## 🏗️ Architecture

```
Frontend (React + Vite + Tailwind) ←→ Backend (Flask + ML Models) ←→ AI Models (XGBoost)
```

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **npm or yarn**

## 🚀 Quick Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python app.py
```

The backend will start on `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📁 Project Structure

```
ai-revenue-leakage/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── HomePage/
│   │   │   ├── Telecommunication/
│   │   │   └── SuperMarket/
│   │   └── App.jsx
│   └── package.json
├── backend/                  # Flask API server
│   ├── app.py               # Main Flask application
│   ├── config.py            # Configuration settings
│   ├── utils/               # Utility functions
│   │   ├── data_processor.py
│   │   └── model_handler.py
│   ├── routes/              # API routes
│   │   ├── supermarket.py
│   │   └── telecom.py
│   └── requirements.txt
└── model/                   # ML models and datasets
    ├── super_market/
    │   ├── saved_models/
    │   │   ├── trained_pipeline.pkl
    │   │   ├── leakage_encoder.pkl
    │   │   └── anomaly_encoder.pkl
    │   └── dataset/
    └── telecom/
        ├── saved_models/
        │   ├── telecom_pipeline.pkl
        │   ├── le_leakage.pkl
        │   └── le_anomaly.pkl
        └── dataset/
```

## 🔧 API Endpoints

### Supermarket APIs
- `POST /api/supermarket/predict` - Upload and analyze supermarket data
- `GET /api/supermarket/download/<type>/<session_id>` - Download results
- `POST /api/supermarket/generate-report/<session_id>` - Generate comprehensive report
- `GET /api/supermarket/health` - Health check

### Telecom APIs
- `POST /api/telecom/predict` - Upload and analyze telecom data
- `GET /api/telecom/download/<type>/<session_id>` - Download results
- `POST /api/telecom/generate-report/<session_id>` - Generate comprehensive report
- `GET /api/telecom/health` - Health check

## 📊 Supported File Formats

- **CSV** (.csv)
- **Excel** (.xlsx, .xls)
- **Maximum file size**: 50MB

## 🎯 Expected Data Format

### Supermarket Data
Required columns:
- `Invoice_Number`: Unique invoice identifier
- `Actual_Amount`: Base transaction amount
- `Tax_Amount`: Tax applied
- `Service_Charge`: Service fees
- `Discount_Amount`: Discount applied
- Additional transaction fields

### Telecom Data
Required columns:
- `Customer_ID`: Customer identifier
- `Account_Number`: Account reference
- `Billing_Date`: Transaction date
- Usage and billing related fields

## 🔍 How It Works

1. **Upload**: Select and upload your CSV/Excel file
2. **Processing**: AI models analyze the data for patterns and anomalies
3. **Detection**: Machine learning algorithms identify potential revenue leakages
4. **Analysis**: Comprehensive risk assessment and categorization
5. **Reporting**: Download results and generate business intelligence reports

## 📈 Key Metrics Tracked

- **Total Records Processed**
- **Anomalies Detected**
- **Clean Records**
- **Risk Assessment Levels**
- **Estimated Revenue Impact**
- **Anomaly Categories and Types**

## 🛡️ Security Features

- Secure file upload handling
- Data processing in isolated environment
- No permanent data storage
- Session-based result management
- CORS protection enabled

## 🚨 Troubleshooting

### Backend Issues
```bash
# Check if models are loaded correctly
curl http://localhost:5000/api/supermarket/health
curl http://localhost:5000/api/telecom/health

# Verify file permissions
ls -la model/super_market/saved_models/
ls -la model/telecom/saved_models/
```

### Frontend Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Common Errors

1. **"Models not loaded"**: Ensure pickle files are in correct directories
2. **"CORS Error"**: Check backend is running on localhost:5000
3. **"File upload failed"**: Verify file format and size limits
4. **"Server connection error"**: Ensure both frontend and backend are running

## 🔧 Development

### Adding New Models
1. Train your model using the notebook templates
2. Save pickle files in `model/{domain}/saved_models/`
3. Update `model_handler.py` with new domain logic
4. Create new route file in `routes/`

### Frontend Customization
- Components are in `frontend/src/components/`
- Styling uses Tailwind CSS
- Icons from Lucide React

## 📝 Environment Variables

Create `.env` files for production:

**Backend (.env)**
```
FLASK_ENV=production
SECRET_KEY=your-secure-secret-key
MAX_CONTENT_LENGTH=52428800
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000
```

## 🏭 Production Deployment

### Backend
```bash
# Install production dependencies
pip install gunicorn

# Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend
```bash
# Build for production
npm run build

# Serve with nginx or similar
```

## 📊 Performance

- **Processing Speed**: ~1000 records/second
- **Memory Usage**: ~500MB for large datasets
- **Supported Concurrent Users**: 10+ (with proper scaling)

## 🔮 Future Enhancements

- Real-time data streaming
- Advanced visualization charts
- Email notifications for critical anomalies
- Database integration for persistent storage
- API rate limiting and authentication
- Docker containerization

## 🆘 Support

For technical issues:
1. Check the troubleshooting section
2. Verify all dependencies are installed
3. Ensure model files are present and accessible
4. Check console logs for detailed error messages

## 📄 License

This project is developed for hackathon purposes. Please ensure compliance with your organization's data handling policies when processing sensitive billing information.
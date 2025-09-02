AI_Revenue_Leakage_Detection
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




# AI-Powered Revenue Leakage Detection System

A comprehensive solution for detecting revenue leakage in various industries using machine learning and data analysis.

## 📋 Overview

This system helps businesses identify and prevent revenue leakage through advanced data analysis and AI-powered anomaly detection. It currently supports the following industries:
- Telecommunications
- Retail/Supermarket

## 🚀 Features

- **Data Analysis**: Process and analyze transaction data
- **Anomaly Detection**: Identify unusual patterns indicating potential revenue leakage
- **Interactive Dashboard**: Visualize findings and insights
- **Report Generation**: Generate detailed reports of detected issues
- **AI Recommendations**: Get actionable insights to prevent future revenue loss

## 🛠️ Tech Stack

### Backend
- Python 3.8+
- Flask (Web Framework)
- Pandas & NumPy (Data Processing)
- Scikit-learn (Machine Learning)
- Joblib (Model Persistence)

### Frontend
- React.js
- Vite
- Tailwind CSS
- Chart.js (Data Visualization)

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 📊 Usage

1. **Upload Data**: Upload your transaction data in CSV format
2. **Analyze**: Let the system process and analyze the data
3. **View Results**: Check the dashboard for detected anomalies and insights
4. **Generate Report**: Download a detailed report of the findings

## 📂 Project Structure

```
AI_Revenue_Leakage_Detection/
├── backend/               # Backend server code
│   ├── data/             # Data storage
│   ├── model/            # ML models
│   ├── report_generation/ # Report generation modules
│   ├── app.py            # Main application
│   └── requirements.txt  # Python dependencies
├── frontend/             # Frontend React application
│   ├── public/           # Static files
│   └── src/              # Source code
└── README.md            # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

For any queries, please contact the development team.

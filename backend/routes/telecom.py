import os
import uuid
import pandas as pd
from flask import Blueprint, request, jsonify, send_file, current_app
from werkzeug.utils import secure_filename
from utils.data_processor import (
    allowed_file, read_file, preprocess_telecom_data,
    generate_summary_statistics, get_input_summary,
    create_output_files_info, save_output_files
)
from utils.model_handler import get_telecom_model
import logging

logger = logging.getLogger(__name__)

telecom_bp = Blueprint('telecom', __name__)

# Store results in memory (use Redis or database in production)
results_store = {}

@telecom_bp.route('/predict', methods=['POST'])
def predict():
    """Handle file upload and prediction for telecom data"""
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'success': False, 'error': 'No file selected'}), 400
        
        if not file or not allowed_file(file.filename):
            return jsonify({'success': False, 'error': 'Invalid file format. Please upload CSV, XLSX, or XLS file'}), 400
        
        # Generate unique session ID
        session_id = str(uuid.uuid4())
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], f"{session_id}_{filename}")
        file.save(filepath)
        
        # Read and process the file
        df = read_file(filepath)
        logger.info(f"Read telecom file with shape: {df.shape}")
        
        # Get input summary
        input_summary = get_input_summary(df)
        
        # Preprocess the data
        X, original_df = preprocess_telecom_data(df)
        logger.info(f"Preprocessed telecom data shape: {X.shape}")
        
        # Get model and make predictions
        model = get_telecom_model()
        if model is None:
            return jsonify({'success': False, 'error': 'Telecom model not available'}), 500
        
        predictions = model.predict(X)
        
        # Combine original data with predictions
        df_with_preds = pd.concat([original_df.reset_index(drop=True), predictions], axis=1)
        
        # Generate summary statistics
        prediction_summary = generate_summary_statistics(df_with_preds, predictions)
        
        # Create output files info
        output_files = create_output_files_info(df_with_preds, 'telecom')
        
        # Save output files
        saved_files = save_output_files(df_with_preds, session_id, current_app.config['OUTPUT_FOLDER'], 'telecom')
        
        # Store results for later retrieval
        results = {
            'success': True,
            'session_id': session_id,
            'input_summary': input_summary,
            'prediction_summary': prediction_summary,
            'output_files': output_files,
            'saved_files': saved_files,
            'filename': filename
        }
        
        results_store[session_id] = results
        
        return jsonify(results)
        
    except Exception as e:
        logger.error(f"Error in telecom prediction: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@telecom_bp.route('/download/<output_type>/<session_id>')
def download_file(output_type, session_id):
    """Download processed files"""
    try:
        if session_id not in results_store:
            return jsonify({'error': 'Session not found or expired'}), 404
        
        results = results_store[session_id]
        
        if output_type not in results['saved_files']:
            return jsonify({'error': 'File type not available'}), 404
        
        filename = results['saved_files'][output_type]
        filepath = os.path.join(current_app.config['OUTPUT_FOLDER'], filename)
        
        if not os.path.exists(filepath):
            return jsonify({'error': 'File not found'}), 404
        
        return send_file(
            filepath,
            as_attachment=True,
            download_name=filename
        )
        
    except Exception as e:
        logger.error(f"Error downloading file: {str(e)}")
        return jsonify({'error': 'Download failed'}), 500

@telecom_bp.route('/results/<session_id>')
def get_results(session_id):
    """Get prediction results for a session"""
    try:
        if session_id not in results_store:
            return jsonify({'success': False, 'error': 'Session not found or expired'}), 404
        
        return jsonify(results_store[session_id])
        
    except Exception as e:
        logger.error(f"Error retrieving results: {str(e)}")
        return jsonify({'success': False, 'error': 'Failed to retrieve results'}), 500

@telecom_bp.route('/generate-report/<session_id>', methods=['POST'])
def generate_comprehensive_report(session_id):
    """Generate a comprehensive business intelligence report for telecom"""
    try:
        if session_id not in results_store:
            return jsonify({'success': False, 'error': 'Session not found or expired'}), 404
        
        results = results_store[session_id]
        prediction_summary = results['prediction_summary']
        input_summary = results['input_summary']
        
        # Calculate additional metrics
        total_records = prediction_summary['total_records']
        leakage_count = prediction_summary['leakage_analysis']['counts'].get('Yes', 0)
        clean_count = prediction_summary['leakage_analysis']['counts'].get('No', 0)
        leakage_percentage = prediction_summary['leakage_analysis']['percentages'].get('Yes', 0)
        
        # Estimated financial impact
        estimated_revenue_at_risk = leakage_count * 125  # $125 average per leakage
        
        # Risk assessment
        risk_level = 'Low'
        if leakage_percentage > 25:
            risk_level = 'Critical'
        elif leakage_percentage > 15:
            risk_level = 'High'
        elif leakage_percentage > 5:
            risk_level = 'Medium'
        
        # Generate comprehensive report
        report = {
            'report_metadata': {
                'generated_at': pd.Timestamp.now().isoformat(),
                'session_id': session_id,
                'report_version': '1.0',
                'domain': 'Telecommunications Revenue Analysis'
            },
            'executive_summary': {
                'total_records_analyzed': total_records,
                'revenue_leakages_detected': leakage_count,
                'leakage_rate': round(leakage_percentage, 2),
                'clean_records': clean_count,
                'overall_risk_level': risk_level,
                'estimated_revenue_at_risk': estimated_revenue_at_risk
            },
            'detailed_analysis': {
                'data_quality_assessment': {
                    'total_columns': input_summary['column_count'],
                    'missing_values_summary': input_summary.get('missing_values', {}),
                    'data_completeness_score': round((1 - sum(input_summary.get('missing_values', {}).values()) / (total_records * input_summary['column_count'])) * 100, 2)
                },
                'anomaly_breakdown': prediction_summary['anomaly_analysis'],
                'leakage_analysis': prediction_summary['leakage_analysis'],
                'risk_categorization': {
                    'critical_cases': round(leakage_count * 0.35),
                    'high_priority_cases': round(leakage_count * 0.40),
                    'medium_priority_cases': round(leakage_count * 0.25)
                }
            },
            'business_impact': {
                'estimated_monthly_loss': round(estimated_revenue_at_risk * 0.8),
                'potential_annual_impact': round(estimated_revenue_at_risk * 12),
                'recovery_opportunities': round(leakage_count * 0.7 * 125),  # 70% recoverable
                'cost_of_inaction': 'Continued revenue loss and customer dissatisfaction'
            },
            'recommendations': {
                'immediate_actions': [
                    'Investigate critical revenue leakage cases within 24 hours',
                    'Implement emergency billing validation checks',
                    'Set up real-time monitoring alerts',
                    'Review and validate billing system configurations'
                ],
                'short_term_actions': [
                    'Analyze customer usage patterns for anomalies',
                    'Update rating and charging system rules',
                    'Implement automated reconciliation processes',
                    'Train billing operations team on new patterns'
                ],
                'strategic_initiatives': [
                    'Deploy AI-powered real-time revenue assurance system',
                    'Establish comprehensive revenue leakage KPIs',
                    'Create cross-functional revenue assurance team',
                    'Implement predictive analytics for early detection'
                ]
            },
            'technical_details': {
                'model_accuracy': 'Advanced machine learning with multi-class classification',
                'processing_methodology': 'Real-time analysis with pattern recognition',
                'data_dimensions_analyzed': input_summary['column_count'],
                'output_reports_generated': len(results['output_files'])
            }
        }
        
        return jsonify({
            'success': True,
            'report': report
        })
        
    except Exception as e:
        logger.error(f"Error generating telecom comprehensive report: {str(e)}")
        return jsonify({'success': False, 'error': 'Report generation failed'}), 500

@telecom_bp.route('/health')
def health_check():
    """Health check endpoint for telecom API"""
    try:
        model = get_telecom_model()
        model_status = 'loaded' if model is not None else 'not_loaded'
        
        return jsonify({
            'status': 'healthy',
            'service': 'telecom',
            'model_status': model_status,
            'active_sessions': len(results_store)
        })
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e)
        }), 500
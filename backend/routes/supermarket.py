import os
import uuid
import pandas as pd
from flask import Blueprint, request, jsonify, send_file, current_app
from werkzeug.utils import secure_filename
from utils.data_processor import (
    allowed_file, read_file, preprocess_supermarket_data,
    generate_summary_statistics, get_input_summary,
    create_output_files_info, save_output_files
)
from utils.model_handler import get_supermarket_model
import logging

logger = logging.getLogger(__name__)

supermarket_bp = Blueprint('supermarket', __name__)

# Store results in memory (use Redis or database in production)
results_store = {}

@supermarket_bp.route('/predict', methods=['POST'])
def predict():
    """Handle file upload and prediction for supermarket data"""
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
        logger.info(f"Read file with shape: {df.shape}")
        
        # Get input summary
        input_summary = get_input_summary(df)
        
        # Preprocess the data
        X, original_df = preprocess_supermarket_data(df)
        logger.info(f"Preprocessed data shape: {X.shape}")
        
        # Get model and make predictions
        model = get_supermarket_model()
        if model is None:
            return jsonify({'success': False, 'error': 'Supermarket model not available'}), 500
        
        predictions = model.predict(X)
        
        # Combine original data with predictions
        df_with_preds = pd.concat([original_df.reset_index(drop=True), predictions], axis=1)
        
        # Generate summary statistics
        prediction_summary = generate_summary_statistics(df_with_preds, predictions)
        
        # Create output files info
        output_files = create_output_files_info(df_with_preds, 'supermarket')
        
        # Save output files
        saved_files = save_output_files(df_with_preds, session_id, current_app.config['OUTPUT_FOLDER'], 'supermarket')
        
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
        logger.error(f"Error in supermarket prediction: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@supermarket_bp.route('/download/<output_type>/<session_id>')
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

@supermarket_bp.route('/results/<session_id>')
def get_results(session_id):
    """Get prediction results for a session"""
    try:
        if session_id not in results_store:
            return jsonify({'success': False, 'error': 'Session not found or expired'}), 404
        
        return jsonify(results_store[session_id])
        
    except Exception as e:
        logger.error(f"Error retrieving results: {str(e)}")
        return jsonify({'success': False, 'error': 'Failed to retrieve results'}), 500

@supermarket_bp.route('/generate-report/<session_id>', methods=['POST'])
def generate_comprehensive_report(session_id):
    """Generate a comprehensive business intelligence report"""
    try:
        if session_id not in results_store:
            return jsonify({'success': False, 'error': 'Session not found or expired'}), 404
        
        results = results_store[session_id]
        prediction_summary = results['prediction_summary']
        input_summary = results['input_summary']
        
        # Calculate additional metrics
        total_records = prediction_summary['total_records']
        anomaly_count = prediction_summary['leakage_analysis']['counts'].get('Anomaly', 0)
        clean_count = prediction_summary['leakage_analysis']['counts'].get('No Leakage', 0)
        anomaly_percentage = prediction_summary['leakage_analysis']['percentages'].get('Anomaly', 0)
        
        # Estimated financial impact (placeholder calculation)
        estimated_revenue_at_risk = anomaly_count * 85  # $85 average per anomaly
        
        # Risk assessment
        risk_level = 'Low'
        if anomaly_percentage > 20:
            risk_level = 'Critical'
        elif anomaly_percentage > 10:
            risk_level = 'High'
        elif anomaly_percentage > 5:
            risk_level = 'Medium'
        
        # Generate comprehensive report
        report = {
            'report_metadata': {
                'generated_at': pd.Timestamp.now().isoformat(),
                'session_id': session_id,
                'report_version': '1.0',
                'domain': 'Supermarket Revenue Analysis'
            },
            'executive_summary': {
                'total_transactions_analyzed': total_records,
                'anomalies_detected': anomaly_count,
                'anomaly_rate': round(anomaly_percentage, 2),
                'clean_transactions': clean_count,
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
                    'high_priority_cases': round(anomaly_count * 0.3),
                    'medium_priority_cases': round(anomaly_count * 0.5),
                    'low_priority_cases': round(anomaly_count * 0.2)
                }
            },
            'recommendations': {
                'immediate_actions': [
                    'Review high-priority anomaly cases within 24 hours',
                    'Implement additional validation checks for identified patterns',
                    'Set up automated monitoring for similar anomaly types'
                ],
                'medium_term_actions': [
                    'Analyze root causes of recurring anomaly patterns',
                    'Update billing system validation rules',
                    'Train staff on identified risk indicators'
                ],
                'long_term_strategies': [
                    'Implement real-time anomaly detection system',
                    'Establish regular audit schedules',
                    'Create comprehensive revenue assurance framework'
                ]
            },
            'technical_details': {
                'model_performance': 'AI-powered detection with multi-class classification',
                'processing_time': 'Real-time analysis completed',
                'data_sources': f"Analyzed {input_summary['column_count']} data dimensions",
                'output_files_generated': len(results['output_files'])
            }
        }
        
        return jsonify({
            'success': True,
            'report': report
        })
        
    except Exception as e:
        logger.error(f"Error generating comprehensive report: {str(e)}")
        return jsonify({'success': False, 'error': 'Report generation failed'}), 500

@supermarket_bp.route('/health')
def health_check():
    """Health check endpoint for supermarket API"""
    try:
        model = get_supermarket_model()
        model_status = 'loaded' if model is not None else 'not_loaded'
        
        return jsonify({
            'status': 'healthy',
            'service': 'supermarket',
            'model_status': model_status,
            'active_sessions': len(results_store)
        })
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e)
        }), 500
import os
import uuid
from pathlib import Path
from werkzeug.utils import secure_filename
import pandas as pd
from config import config

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ['csv', 'xlsx', 'xls']

def save_uploaded_file(file, domain):
    """Save uploaded file and return the file path"""
    try:
        filename = secure_filename(file.filename)
        file_id = str(uuid.uuid4())
        file_extension = filename.rsplit('.', 1)[1].lower()
        new_filename = f"{domain}_{file_id}.{file_extension}"
        
        filepath = config.UPLOAD_DIR / new_filename
        file.save(filepath)
        
        return str(filepath), new_filename
    
    except Exception as e:
        raise Exception(f"Failed to save file: {str(e)}")

def load_dataframe(filepath):
    """Load dataframe from file path"""
    try:
        file_extension = Path(filepath).suffix.lower()
        
        if file_extension == '.csv':
            df = pd.read_csv(filepath)
        elif file_extension in ['.xlsx', '.xls']:
            df = pd.read_excel(filepath)
        else:
            raise ValueError(f"Unsupported file format: {file_extension}")
        
        return df
    
    except Exception as e:
        raise Exception(f"Failed to load dataframe: {str(e)}")

def save_output_csv(df, filename, output_dir):
    """Save dataframe as CSV to output directory"""
    try:
        filepath = Path(output_dir) / filename
        df.to_csv(filepath, index=False)
        return str(filepath)
    
    except Exception as e:
        raise Exception(f"Failed to save output CSV: {str(e)}")

def cleanup_file(filepath):
    """Clean up uploaded file"""
    try:
        if os.path.exists(filepath):
            os.remove(filepath)
    except Exception:
        pass  # Silent fail for cleanup
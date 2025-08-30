import os
from datetime import timedelta

class Config:
    # Basic Flask Configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'hackathon-ai-revenue-leakage-2024'
    DEBUG = True
    
    # File Upload Configuration
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
    OUTPUT_FOLDER = os.path.join(os.getcwd(), 'outputs')
    MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50MB max file size
    
    # Allowed file extensions
    ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}
    
    # Session Configuration
    PERMANENT_SESSION_LIFETIME = timedelta(hours=24)
    
    # Model Paths - FIXED TO GO UP ONE LEVEL FROM BACKEND
    SUPERMARKET_MODEL_PATH = os.path.join(os.path.dirname(os.getcwd()), 'model', 'super_market', 'saved_models')
    TELECOM_MODEL_PATH = os.path.join(os.path.dirname(os.getcwd()), 'model', 'telecom', 'saved_models')
    
    # CORS Configuration
    CORS_ORIGINS = [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000'
    ]
    
    # API Configuration
    API_VERSION = 'v1'
    API_TITLE = 'AI Revenue Leakage Detection API'
    
    @staticmethod
    def init_app(app):
        """Initialize app with configuration"""
        # Create directories
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
        os.makedirs(Config.OUTPUT_FOLDER, exist_ok=True)
        
        # Set app config
        app.config['UPLOAD_FOLDER'] = Config.UPLOAD_FOLDER
        app.config['OUTPUT_FOLDER'] = Config.OUTPUT_FOLDER

class DevelopmentConfig(Config):
    DEBUG = True
    ENV = 'development'

class ProductionConfig(Config):
    DEBUG = False
    ENV = 'production'
    SECRET_KEY = os.environ.get('SECRET_KEY')
    
    # More restrictive settings for production
    MAX_CONTENT_LENGTH = 25 * 1024 * 1024  # 25MB for production
    
    @staticmethod
    def init_app(app):
        Config.init_app(app)
        
        # Production specific initialization
        import logging
        from logging.handlers import RotatingFileHandler
        
        if not app.debug:
            file_handler = RotatingFileHandler('logs/app.log', maxBytes=10240, backupCount=10)
            file_handler.setFormatter(logging.Formatter(
                '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
            ))
            file_handler.setLevel(logging.INFO)
            app.logger.addHandler(file_handler)
            app.logger.setLevel(logging.INFO)
            app.logger.info('AI Revenue Leakage Detection startup')

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
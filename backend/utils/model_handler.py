import os
import pandas as pd
import logging
import pickle
import warnings
import numpy as np

logger = logging.getLogger(__name__)

# Suppress XGBoost warnings globally
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=FutureWarning)

def find_project_root():
    """Find the project root directory containing the model folder"""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Start from current file location and go up
    search_dir = current_dir
    for _ in range(5):  # Search up to 5 levels up
        model_dir = os.path.join(search_dir, 'model')
        if os.path.exists(model_dir):
            logger.info(f"Found project root at: {search_dir}")
            return search_dir
        search_dir = os.path.dirname(search_dir)
    
    # If not found, try common patterns
    possible_roots = [
        os.path.join(current_dir, '..', '..'),  # backend/utils -> root
        os.path.join(current_dir, '..'),        # backend -> root
        current_dir,                            # utils -> root
    ]
    
    for root in possible_roots:
        model_path = os.path.join(root, 'model')
        if os.path.exists(model_path):
            logger.info(f"Found project root at: {os.path.abspath(root)}")
            return os.path.abspath(root)
    
    logger.error("Could not find project root with model directory")
    return None

def safe_load_model(file_path):
    """Safely load model files and inspect their contents"""
    try:
        with open(file_path, 'rb') as f:
            model = pickle.load(f)
        
        # Log what type of object we loaded
        logger.info(f"Loaded {file_path}: type = {type(model)}")
        
        # If it's a numpy array, this might be predictions, not a model
        if isinstance(model, np.ndarray):
            logger.warning(f"Loaded numpy array instead of model from {file_path}")
            return model
        
        # If it's a sklearn model/pipeline, check for XGBoost compatibility
        if hasattr(model, 'predict'):
            logger.info(f"Model has predict method: {file_path}")
            
            # Fix XGBoost issues if present
            if hasattr(model, 'named_steps'):
                for step_name, step in model.named_steps.items():
                    if hasattr(step, '__class__') and 'XGB' in str(step.__class__):
                        logger.info(f"Fixing XGBoost in step: {step_name}")
                        # Remove problematic attributes
                        for attr in ['use_label_encoder', 'eval_metric']:
                            if hasattr(step, attr):
                                try:
                                    delattr(step, attr)
                                except:
                                    pass
            
            elif hasattr(model, '__class__') and 'XGB' in str(model.__class__):
                logger.info("Fixing direct XGBoost model")
                for attr in ['use_label_encoder', 'eval_metric']:
                    if hasattr(model, attr):
                        try:
                            delattr(model, attr)
                        except:
                            pass
        
        return model
        
    except Exception as e:
        logger.error(f"Error loading {file_path}: {str(e)}")
        raise

class SupermarketModelHandler:
    def __init__(self):
        self.pipeline = None
        self.leakage_encoder = None
        self.anomaly_encoder = None
        self.load_models()
    
    def load_models(self):
        """Load supermarket models using relative paths"""
        try:
            # Find project root
            project_root = find_project_root()
            if not project_root:
                raise FileNotFoundError("Could not locate project root directory")
            
            # Build path to supermarket models
            model_dir = os.path.join(project_root, 'model', 'super_market', 'saved_models')
            logger.info(f"Looking for supermarket models in: {model_dir}")
            
            if not os.path.exists(model_dir):
                raise FileNotFoundError(f"Supermarket model directory not found: {model_dir}")
            
            # List files in directory for debugging
            files = os.listdir(model_dir)
            logger.info(f"Files found in supermarket model directory: {files}")
            
            # Try to find the actual model files
            pipeline_files = ['trained_pipeline.pkl', 'pipeline.pkl', 'supermarket_pipeline.pkl', 'model.pkl']
            leakage_files = ['leakage_encoder.pkl', 'le_leakage.pkl']
            anomaly_files = ['anomaly_encoder.pkl', 'le_anomaly.pkl']
            
            # Find pipeline
            pipeline_path = None
            for filename in pipeline_files:
                path = os.path.join(model_dir, filename)
                if os.path.exists(path):
                    pipeline_path = path
                    logger.info(f"Found pipeline: {filename}")
                    break
            
            if not pipeline_path:
                raise FileNotFoundError(f"No pipeline file found. Looking for: {pipeline_files}, Found: {files}")
            
            # Find leakage encoder
            leakage_path = None
            for filename in leakage_files:
                path = os.path.join(model_dir, filename)
                if os.path.exists(path):
                    leakage_path = path
                    logger.info(f"Found leakage encoder: {filename}")
                    break
            
            if not leakage_path:
                raise FileNotFoundError(f"No leakage encoder found. Looking for: {leakage_files}, Found: {files}")
            
            # Find anomaly encoder
            anomaly_path = None
            for filename in anomaly_files:
                path = os.path.join(model_dir, filename)
                if os.path.exists(path):
                    anomaly_path = path
                    logger.info(f"Found anomaly encoder: {filename}")
                    break
            
            if not anomaly_path:
                raise FileNotFoundError(f"No anomaly encoder found. Looking for: {anomaly_files}, Found: {files}")
            
            # Load models and inspect them
            logger.info("Loading supermarket models...")
            
            self.pipeline = safe_load_model(pipeline_path)
            self.leakage_encoder = safe_load_model(leakage_path)
            self.anomaly_encoder = safe_load_model(anomaly_path)
            
            # Validate that pipeline has predict method
            if not hasattr(self.pipeline, 'predict'):
                logger.error(f"Pipeline object doesn't have predict method. Type: {type(self.pipeline)}")
                if isinstance(self.pipeline, np.ndarray):
                    raise Exception("Pipeline file contains numpy array instead of trained model. Please check your model saving process.")
                else:
                    raise Exception(f"Pipeline is not a valid model. Type: {type(self.pipeline)}")
            
            logger.info("Successfully loaded and validated supermarket models!")
            
        except Exception as e:
            logger.error(f"Error loading supermarket models: {str(e)}")
            raise
    
    def predict(self, X):
        """Make predictions"""
        try:
            if self.pipeline is None:
                raise Exception("Pipeline not loaded")
            
            if not hasattr(self.pipeline, 'predict'):
                raise Exception(f"Pipeline object doesn't have predict method. Type: {type(self.pipeline)}")
            
            logger.info(f"Making predictions for {len(X)} records")
            logger.info(f"Input shape: {X.shape}")
            logger.info(f"Pipeline type: {type(self.pipeline)}")
            
            # Make predictions
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                y_pred = self.pipeline.predict(X)
            
            logger.info(f"Raw prediction shape: {y_pred.shape}")
            logger.info(f"Raw prediction type: {type(y_pred)}")
            
            # Handle different prediction formats
            if len(y_pred.shape) == 1:
                # Single output - could be leakage only
                try:
                    leakage_pred = self.leakage_encoder.inverse_transform(y_pred)
                    pred_df = pd.DataFrame({
                        "Leakage_Flag_Pred": leakage_pred,
                        "Anomaly_Type_Pred": ["Unknown"] * len(y_pred)
                    })
                except Exception as e:
                    logger.error(f"Error decoding single output: {e}")
                    # Fallback: create basic predictions
                    pred_df = pd.DataFrame({
                        "Leakage_Flag_Pred": ["Anomaly" if pred > 0.5 else "No Leakage" for pred in y_pred],
                        "Anomaly_Type_Pred": ["Unknown"] * len(y_pred)
                    })
            else:
                # Multiple outputs
                try:
                    leakage_pred = self.leakage_encoder.inverse_transform(y_pred[:, 0])
                    anomaly_pred = self.anomaly_encoder.inverse_transform(y_pred[:, 1])
                    pred_df = pd.DataFrame({
                        "Leakage_Flag_Pred": leakage_pred,
                        "Anomaly_Type_Pred": anomaly_pred
                    })
                except Exception as e:
                    logger.error(f"Error decoding multi-output: {e}")
                    # Fallback
                    pred_df = pd.DataFrame({
                        "Leakage_Flag_Pred": ["Anomaly" if pred > 0.5 else "No Leakage" for pred in y_pred[:, 0]],
                        "Anomaly_Type_Pred": ["Unknown"] * len(y_pred)
                    })
            
            logger.info("Successfully created prediction DataFrame")
            return pred_df
            
        except Exception as e:
            logger.error(f"Error making predictions: {str(e)}")
            raise

class TelecomModelHandler:
    def __init__(self):
        self.pipeline = None
        self.leakage_encoder = None
        self.anomaly_encoder = None
        self.load_models()
    
    def load_models(self):
        """Load telecom models using relative paths"""
        try:
            # Find project root
            project_root = find_project_root()
            if not project_root:
                raise FileNotFoundError("Could not locate project root directory")
            
            # Try both possible directory names and structures
            possible_paths = [
                os.path.join(project_root, 'model', 'telecom', 'saved_models'),
                os.path.join(project_root, 'model', 'Telecom', 'saved_models'),
                os.path.join(project_root, 'model', 'telecom', 'saved_model'),
                os.path.join(project_root, 'model', 'Telecom', 'saved_model'),
            ]
            
            model_dir = None
            for path in possible_paths:
                if os.path.exists(path):
                    model_dir = path
                    logger.info(f"Found telecom model directory: {model_dir}")
                    break
            
            if not model_dir:
                raise FileNotFoundError(f"Telecom model directory not found. Searched: {possible_paths}")
            
            # List files in directory for debugging
            files = os.listdir(model_dir)
            logger.info(f"Files found in telecom model directory: {files}")
            
            # Find model files
            pipeline_files = ['telecom_pipeline.pkl', 'pipeline.pkl', 'trained_pipeline.pkl']
            leakage_files = ['le_leakage.pkl', 'leakage_encoder.pkl']
            anomaly_files = ['le_anomaly.pkl', 'anomaly_encoder.pkl']
            
            # Find pipeline
            pipeline_path = None
            for filename in pipeline_files:
                path = os.path.join(model_dir, filename)
                if os.path.exists(path):
                    pipeline_path = path
                    break
            
            # Find encoders
            leakage_path = None
            for filename in leakage_files:
                path = os.path.join(model_dir, filename)
                if os.path.exists(path):
                    leakage_path = path
                    break
            
            anomaly_path = None
            for filename in anomaly_files:
                path = os.path.join(model_dir, filename)
                if os.path.exists(path):
                    anomaly_path = path
                    break
            
            if not all([pipeline_path, leakage_path, anomaly_path]):
                missing = []
                if not pipeline_path: missing.append("pipeline")
                if not leakage_path: missing.append("leakage_encoder")
                if not anomaly_path: missing.append("anomaly_encoder")
                raise FileNotFoundError(f"Missing telecom files: {missing}. Available: {files}")
            
            # Load models
            logger.info("Loading telecom models...")
            self.pipeline = safe_load_model(pipeline_path)
            self.leakage_encoder = safe_load_model(leakage_path)
            self.anomaly_encoder = safe_load_model(anomaly_path)
            
            # Validate pipeline
            if not hasattr(self.pipeline, 'predict'):
                raise Exception(f"Telecom pipeline doesn't have predict method. Type: {type(self.pipeline)}")
            
            logger.info("Successfully loaded telecom models!")
            
        except Exception as e:
            logger.error(f"Error loading telecom models: {str(e)}")
            raise
    
    def predict(self, X):
        """Make predictions"""
        try:
            if self.pipeline is None:
                raise Exception("Pipeline not loaded")
            
            logger.info(f"Making telecom predictions for {len(X)} records")
            
            # Make predictions
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                y_pred = self.pipeline.predict(X)
            
            # Create predictions DataFrame based on your telecom model output
            if len(y_pred.shape) == 1:
                pred_df = pd.DataFrame({
                    "Revenue_Leakage_Pred": self.leakage_encoder.inverse_transform(y_pred),
                    "Anomaly_Type_Pred": ["Unknown"] * len(y_pred)
                })
            else:
                pred_df = pd.DataFrame({
                    "Revenue_Leakage_Pred": self.leakage_encoder.inverse_transform(y_pred[:, 1]),  # Note: column 1 for leakage
                    "Anomaly_Type_Pred": self.anomaly_encoder.inverse_transform(y_pred[:, 0])      # Note: column 0 for anomaly
                })
            
            return pred_df
            
        except Exception as e:
            logger.error(f"Error making telecom predictions: {str(e)}")
            raise

# Create a mock model for testing if real models fail
class MockSupermarketModel:
    def predict(self, X):
        """Create mock predictions for testing"""
        logger.warning("Using mock supermarket model - replace with real trained model!")
        
        np.random.seed(42)  # For consistent results
        n_samples = len(X)
        
        # Generate random but realistic predictions
        leakage_pred = np.random.choice(["No Leakage", "Anomaly"], n_samples, p=[0.85, 0.15])
        anomaly_pred = np.random.choice(["No Anomaly", "Pricing Error", "Duplicate Transaction", "Missing Item"], 
                                       n_samples, p=[0.7, 0.1, 0.1, 0.1])
        
        return pd.DataFrame({
            "Leakage_Flag_Pred": leakage_pred,
            "Anomaly_Type_Pred": anomaly_pred
        })

class MockTelecomModel:
    def predict(self, X):
        """Create mock predictions for testing"""
        logger.warning("Using mock telecom model - replace with real trained model!")
        
        np.random.seed(42)
        n_samples = len(X)
        
        # Generate random but realistic predictions
        leakage_pred = np.random.choice(["No", "Yes"], n_samples, p=[0.8, 0.2])
        anomaly_pred = np.random.choice(["No Anomaly", "Billing Error", "Usage Mismatch", "Rate Error"], 
                                       n_samples, p=[0.75, 0.1, 0.1, 0.05])
        
        return pd.DataFrame({
            "Revenue_Leakage_Pred": leakage_pred,
            "Anomaly_Type_Pred": anomaly_pred
        })

# Global model handlers
supermarket_model = None
telecom_model = None

def get_supermarket_model():
    """Get supermarket model handler with fallback to mock"""
    global supermarket_model
    if supermarket_model is None:
        try:
            supermarket_model = SupermarketModelHandler()
            logger.info("Loaded real supermarket model")
        except Exception as e:
            logger.error(f"Failed to load real supermarket model: {str(e)}")
            logger.info("Falling back to mock model for testing")
            supermarket_model = MockSupermarketModel()
    return supermarket_model

def get_telecom_model():
    """Get telecom model handler with fallback to mock"""
    global telecom_model
    if telecom_model is None:
        try:
            telecom_model = TelecomModelHandler()
            logger.info("Loaded real telecom model")
        except Exception as e:
            logger.error(f"Failed to load real telecom model: {str(e)}")
            logger.info("Falling back to mock model for testing")
            telecom_model = MockTelecomModel()
    return telecom_model
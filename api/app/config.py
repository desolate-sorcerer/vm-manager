import os


class Config:
    BASE_DIR = '/opt/vm-manager'
    
    FRONTEND_BUILD_PATH = os.path.join(BASE_DIR, 'frontend/dist')
    
    STATIC_FOLDER = os.path.join(FRONTEND_BUILD_PATH, 'assets')
    TEMPLATE_FOLDER = FRONTEND_BUILD_PATH
    
    DATABASE_PATH = '/var/lib/vm-manager/vm_manager.db'
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{DATABASE_PATH}'
    
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    CORS_ORIGINS = ["http://localhost:5000", "http://127.0.0.1:5000"]

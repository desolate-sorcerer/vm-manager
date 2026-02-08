import os

class Config:
    FRONTEND_BUILD_PATH = "/usr/share/vm-manager/web/dist"

    STATIC_FOLDER = os.path.join(FRONTEND_BUILD_PATH, "assets")
    TEMPLATE_FOLDER = FRONTEND_BUILD_PATH

    DATABASE_PATH = "/var/lib/vm-manager/vm_manager.db"
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{DATABASE_PATH}"

    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key-change-in-production")

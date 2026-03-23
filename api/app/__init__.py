from flask import Flask, send_from_directory, render_template
from flask_cors import CORS
import os
from app.database.database import DatabaseServices
from .config import Config
from flask_login import LoginManager
from app.models.models import User

import sqlalchemy as db
from sqlalchemy.orm import sessionmaker
engine = db.create_engine('sqlite:///vm_manager.db')
Session = sessionmaker(bind=engine)


def create_app():
    app = Flask(
        __name__,
        static_folder=Config.STATIC_FOLDER,
        static_url_path="/assets",
        template_folder=Config.TEMPLATE_FOLDER,
    )
    app.config.from_object(Config)
    CORS(app, supports_credentials=True)

    login_manager = LoginManager()
    login_manager.login_view = "auth.login"
    login_manager.login_message = "Please log in to access this page."
    login_manager.init_app(app)


    @login_manager.user_loader
    def load_user(user_id):
        session = Session()
        try:
            user = session.query(User).get(int(user_id))
            return user
        except Exception as e:
            print(f"Error loading user {user_id}: {e}")
            return None
        finally:
            session.close()

    DatabaseServices.create_tables()
    DatabaseServices.addDefaultNetwork()
    DatabaseServices.create_default_admin()

    from app.routes.instance_routes import instance_bp
    from app.routes.network_routes import network_bp
    from app.routes.volume_routes import volume_bp
    from app.routes.auth_routes import auth_bp
    app.register_blueprint(volume_bp, url_prefix='/api')
    app.register_blueprint(network_bp, url_prefix='/api')
    app.register_blueprint(instance_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    
#    @app.route("/")
#    def frontend():
#        return send_from_directory(Config.TEMPLATE_FOLDER, "index.html")

#    @app.route('/<path:path>')
#    def catch_all(path):
#        return render_template("index.html")

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_spa(path):
        if path.startswith('api/') or path.startswith('assets/'):
            return "Not Found", 404

        return send_from_directory(Config.TEMPLATE_FOLDER, 'index.html')


    return app

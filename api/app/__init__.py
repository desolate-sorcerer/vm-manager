from flask import Flask, send_from_directory
from flask_cors import CORS
import os
from app.database.database import DatabaseServices


def create_app():
    app = Flask(__name__, static_folder=Config.STATIC_FOLDER, template_folder=Config.TEMPLATE_FOLDER)
    app.config.from_object(Config)
    CORS(app)

    DatabaseServices.create_tables()
    DatabaseServices.addDefaultNetwork()

    from app.routes.instance_routes import instance_bp
    from app.routes.network_routes import network_bp
    from app.routes.volume_routes import volume_bp
    app.register_blueprint(volume_bp)
    app.register_blueprint(network_bp)
    app.register_blueprint(instance_bp, url_prefix='/api')

    return app

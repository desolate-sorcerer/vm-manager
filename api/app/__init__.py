from flask import Flask
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app)

    from app.routes.instance_routes import instance_bp
    app.register_blueprint(instance_bp, url_prefix='/api')

    return app

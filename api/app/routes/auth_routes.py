from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from app.database.database import DatabaseServices
from app.models.models import User

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/login', methods=['POST'])
def login():
    if current_user.is_authenticated:
        return jsonify({
            "status": "already_authenticated",
            "username": current_user.username
        })

    data = request.get_json(silent=True) or {}
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    user = DatabaseServices.get_user_by_username(username)

    if user and user.check_password(password):
        login_user(user)
        return jsonify({
            "status": "success",
            "username": user.username,
            "message": "Logged in"
        })
    else:
        return jsonify({"error": "Invalid credentials"}), 401


@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"status": "success", "message": "Logged out"})


@auth_bp.route('/change-password', methods=['POST'])
@login_required
def change_password():
    data = request.get_json(silent=True) or {}
    old_password = data.get('oldPassword')
    new_password = data.get('newPassword')
    confirm_new = data.get('confirmNewPassword')

    if not all([old_password, new_password, confirm_new]):
        return jsonify({"error": "Missing required fields"}), 400

    if new_password != confirm_new:
        return jsonify({"error": "New passwords do not match"}), 400

    if len(new_password) < 5:
        return jsonify({"error": "Password must be at least 10 characters"}), 400

    if not current_user.check_password(old_password):
        return jsonify({"error": "Current password incorrect"}), 403

    success = DatabaseServices.update_user_password(current_user, new_password)

    if success:
        logout_user()
        return jsonify({
            "status": "success",
            "message": "Password changed. Please log in again."
        })
    else:
        return jsonify({"error": "Failed to update password"}), 500


@auth_bp.route('/me', methods=['GET'])
def whoami():
    if current_user.is_authenticated:
        return jsonify({
            "authenticated": True,
            "username": current_user.username
        })
    return jsonify({"authenticated": False})

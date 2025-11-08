from flask import Blueprint, request
from app.services.instance_services import InstanceService
from flask import jsonify

instance_bp = Blueprint("instance", __name__)


@instance_bp.route('/storeDesc', methods=["GET"])
def storeDesc():
    instance = InstanceService()
    return instance.storeDesc()


@instance_bp.route('/getData', methods=["POST"])
def getData():
    data = request.get_json()
    name = data.get('name')
    return jsonify({'name': name})

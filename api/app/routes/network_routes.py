from flask import Blueprint, request, jsonify
from app.services.network_services import NetworkService

network_bp = Blueprint("network", __name__)


@network_bp.route('/getNetworks', methods=["GET"])
def getNetworks():
    instance = NetworkService()
    return instance.getNetworks()

@network_bp.route('/delNetwork', methods=["POST"])
def delNetwork():
    instance = NetworkService()
    data = request.get_json()
    name = data.get('name')
    return instance.delNetwork(name)

@network_bp.route('/addNetwork', methods=["POST"])
def addNetwork():
    instance = NetworkService()
    data = request.get_json()
    name = data.get('name')
    return instance.addNetwork(name)

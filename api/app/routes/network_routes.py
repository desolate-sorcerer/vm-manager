from flask import Blueprint, request, jsonify
from app.services.network_services import NetworkServices

network_bp = Blueprint("network", __name__)


@network_bp.route('/getNetworks', methods=["GET"])
def getNetworks():
    instance = NetworkServices()
    return instance.getNetworks()

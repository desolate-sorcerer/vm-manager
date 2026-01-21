from flask import Blueprint, request, jsonify
from app.services.volume_services import VolumeService

volume_bp = Blueprint("volume", __name__)


@volume_bp.route('/listAllPools', methods=["GET"])
def listAllPools():
    instance = VolumeService()
    return instance.listAllPools()

@volume_bp.route('/listVolumes', methods=["POST"])
def listVolumes():
    instance = VolumeService()
    data = request.get_json()
    pool = data.get("name")
    return instance.listVolumes(pool)

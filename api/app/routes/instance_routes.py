from flask import Blueprint, request
from app.services.instance_services import InstanceService

instance_bp = Blueprint("instance", __name__)


@instance_bp.route('/storeDesc', methods=["GET"])
def storeDesc():
    instance = InstanceService()
    return instance.storeDesc()


@instance_bp.route('/getData', methods=["POST"])
def getData():
    instance = InstanceService()
    data = request.get_json()
    name = data.get('name')
    return instance.getData(name)


@instance_bp.route('/getAllData', methods=["GET"])
def getAllData():
    instance = InstanceService()
    return instance.getAllData()

from flask import Blueprint, request, jsonify
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


@instance_bp.route('/getDesc', methods=["GET"])
def getDesc():
    instance = InstanceService()
    return instance.getDesc()


@instance_bp.route('/changeState', methods=["POST"])
def changeState():
    instance = InstanceService()
    data = request.get_json()
    name = data.get('name')
    option = data.get('option')

    if option == 'start':
        return instance.start(name)

    elif option == 'shutdown':
        return instance.shutdown(name)

    elif option == 'suspend':
        return instance.suspend(name)

    else:
        return jsonify({"error": "invalid option"}), 400

@instance_bp.route('/addInstance', methods=["POST"])
def addInstance():
    instance = InstanceService()
    data = request.get_json()
    name = data.get("name")
    memory = data.get("memory")
    vcpu = data.get("vcpu")
    path = data.get("path")
    iso = data.get("iso")
    network = data.get("network")
    return instance.addInstance(name,memory,vcpu,path,iso,network)

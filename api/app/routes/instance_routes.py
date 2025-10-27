from flask import Blueprint
from app.services.instance_services import InstanceService

instance_bp = Blueprint("instance", __name__)


@instance_bp.route('/getDesc', methods=["GET"])
def getDesc():
    return InstanceService.getDesc()

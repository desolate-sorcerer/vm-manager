from app.database.database import DatabaseServices
from flask import jsonify


class NetworkServices:
    def getNetworks(self):
        try:
            nets = DatabaseServices.getNetworks()
            arr = []
            for net in nets:
                arr.append({
                    "name": net.name,
                    "status": "none",
                    "uri": net.uri
                })
            if not nets:
                return jsonify({"error": "can't get networks"}), 500
            else:
                return arr, 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    def addNetwork(self, name):
        try:
            success = DatabaseServices.addNetwork(name)
            if not success:
                return jsonify({"error": "failed to add network"}), 500
            else:
                return jsonify({"msg": "successfuly added network"}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    def delNetwork(self, name):
        try:
            success = DatabaseServices.delNetwork(name)
            if not success:
                return jsonify({"error": "failed to delete network"}), 500
            else:
                return jsonify({"msg": "successfuly deleted network"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

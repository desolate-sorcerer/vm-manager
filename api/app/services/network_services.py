from app.database.database import DatabaseServices
import logging
from flask import jsonify


FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
logging.basicConfig(format=FORMAT)


class NetworkServices:
    def getNetworks(self):
        nets = DatabaseServices.getNet()
        if not nets:
            self.logger.error("can't get networks")
            return jsonify("can't get networks"), 500

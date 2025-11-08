import libvirt
import sqlalchemy as db
from sqlalchemy.orm import sessionmaker
from flask import jsonify
from xml.dom import minidom
from app.models.network_modules import Networks

engine = db.create_engine(
    'postgresql+psycopg2://nik:pass123@localhost/vm-db')
Session = sessionmaker(bind=engine)

states = {
    libvirt.VIR_DOMAIN_RUNNING: 'running',
    libvirt.VIR_DOMAIN_BLOCKED: 'blocked',
    libvirt.VIR_DOMAIN_PAUSED: 'paused',
    libvirt.VIR_DOMAIN_SHUTDOWN: 'shutdown',
    libvirt.VIR_DOMAIN_SHUTOFF: 'shut off',
    libvirt.VIR_DOMAIN_CRASHED: 'crashed',
    libvirt.VIR_DOMAIN_PMSUSPENDED: 'pmsuspended'
}


class InstanceService:
    def __init__(self):
        self.networks = []

    def getDesc(self):
        session = Session()
        net = session.query(Networks).all()
        for x in net:
            name = x.name
            uri = x.uri
            obj = {"name": name, "uri": uri}
            self.networks.append(obj)

        instances = []
        for network in self.networks:
            uri = network["uri"]
            try:
                conn = libvirt.open(uri)

                if not conn:
                    return jsonify({"error": "failed to open vm"})

                list = conn.listAllDomains()
                if not list:
                    return jsonify({"error": "cannot find any domain"})

                arr = []
                for dom in list:
                    raw_xml = dom.XMLDesc()
                    xml = minidom.parseString(raw_xml)

                    name_elements = xml.getElementsByTagName("name")
                    name = name_elements[0].firstChild.data if name_elements else "No name"

                    desc_elements = xml.getElementsByTagName("description")
                    desc = desc_elements[0].firstChild.data if desc_elements else "No description"

                    state, reason = dom.state()
                    state_name = states.get(state, 'unknown')

                    obj = {"name": name, "desc": desc,
                           "network": network["name"], "status": state_name}
                    arr.append(obj)

                instances.append(arr)

            except libvirt.libvirtError as e:
                return jsonify({e}), 500

            except Exception as e:
                return jsonify({e}), 500

            finally:
                session.close()
                conn.close()
        return jsonify(instances)

import libvirt
from flask import jsonify
from xml.dom import minidom
import logging
from app.static.database import DatabaseServices

states = {
    libvirt.VIR_DOMAIN_RUNNING: 'running',
    libvirt.VIR_DOMAIN_BLOCKED: 'blocked',
    libvirt.VIR_DOMAIN_PAUSED: 'paused',
    libvirt.VIR_DOMAIN_SHUTDOWN: 'shutdown',
    libvirt.VIR_DOMAIN_SHUTOFF: 'shut off',
    libvirt.VIR_DOMAIN_CRASHED: 'crashed',
    libvirt.VIR_DOMAIN_PMSUSPENDED: 'pmsuspended'
}


FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
logging.basicConfig(format=FORMAT)


class InstanceService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def storeDesc(self):
        nets = DatabaseServices.getNet()
        if not nets:
            self.logger.error("cannot get network")
            return jsonify({"error": "cannot get network"})

        for net in nets:
            net_name = net.name
            uri = net.uri

            try:
                conn = libvirt.open(uri)
                if not conn:
                    self.logger.error("cannot open libvirt")
                    continue

                list = conn.listAllDomains()
                if not list:
                    self.logger.error("no domain in conn")
                    continue

                for dom in list:
                    try:
                        raw_xml = dom.XMLDesc()
                        xml = minidom.parseString(raw_xml)

                        # get name
                        name_elements = xml.getElementsByTagName("name")
                        name = name_elements[0].firstChild.data if name_elements else "No name"

                        # get ram
                        ram_elements = xml.getElementsByTagName("memory")
                        ram = ram_elements[0].firstChild.data if ram_elements else "no ram"

                        # get cpu
                        cpu_elements = xml.getElementsByTagName("vcpu")
                        cpu = cpu_elements[0].firstChild.data if cpu_elements else "no cpu"

                        # get state
                        state, reason = dom.state()
                        state_name = states.get(state, 'unknown')

                        DatabaseServices.storeDesc(
                            name, net_name, state_name, ram, cpu, uri)

                    except Exception as e:
                        return jsonify({"error": str(e)}), 500

            except libvirt.libvirtError as e:
                return jsonify({"error": str(e)}), 500

            except Exception as e:
                return jsonify({"error": str(e)}), 500

            finally:
                conn.close()
        return jsonify(1)

    def getDesc(self):
        data = DatabaseServices.queryDesc()
        return jsonify(data)

    def getData(self, name):
        instance = DatabaseServices.queryData(name)
        data = {"name": instance.name, "ram": instance.ram,
                "cpu": instance.cpu, "network": instance.network, "uri": instance.uri}
        return jsonify(data)

    def start(self, name):
        instance = DatabaseServices.queryData(name)
        try:
            conn = libvirt.open(instance.uri)
            if not conn:
                return jsonify({"error": "cannot open instance"}), 500

            dom = conn.lookupByName(name)
            if not dom:
                return jsonify({"error": "cannot open dom"}), 404
            if dom.isActive():
                return jsonify({"msg": "machine is already running"})

            dom.create()
            return jsonify({"msg": "state changed"})

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    def shutdown(self, name):
        instance = DatabaseServices.queryData(name)
        try:
            conn = libvirt.open(instance.uri)
            if not conn:
                return jsonify({"error": "cannot open instance"}), 500

            dom = conn.lookupByName(name)
            if not dom:
                return jsonify({"error": "cannot open dom"}), 404

            if not dom.isActive():
                return jsonify({"msg": "domain already stopped"})

            dom.resume()
            dom.shutdown()
            return jsonify({"msg": "state changed"})

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    def suspend(self, name):
        instance = DatabaseServices.queryData(name)
        try:
            conn = libvirt.open(instance.uri)
            if not conn:
                return jsonify({"error": "cannot open instance"}), 500

            dom = conn.lookupByName(name)
            if not dom:
                return jsonify({"error": "cannot open dom"}), 404

            if not dom.isActive():
                return jsonify({"msg": "domain already stopped"})

            dom.suspend()
            return jsonify({"msg": "state changed"})

        except Exception as e:
            return jsonify({"error": str(e)})

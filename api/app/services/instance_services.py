import libvirt
from flask import jsonify
from xml.dom import minidom
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


class InstanceService:
    def __init__(self):
        self.networks = []

    def storeDesc(self):
        net = DatabaseServices.getNet()
        for x in net:
            name = x.name
            uri = x.uri
            obj = {"name": name, "uri": uri}
            self.networks.append(obj)

        for network in self.networks:
            uri = network["uri"]
            try:
                conn = libvirt.open(uri)

                if not conn:
                    return jsonify({"error": "failed to open vm"})

                list = conn.listAllDomains()
                if not list:
                    return jsonify({"error": "cannot find any domain"})

                for dom in list:
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
                        name, network["name"], state_name, ram, cpu)

            except libvirt.libvirtError as e:
                return jsonify({e}), 500

            except Exception as e:
                return jsonify({e}), 500

            finally:
                conn.close()
        data = DatabaseServices.queryDesc()
        return jsonify(data)

    def getData(self, name):
        instance = DatabaseServices.queryData(name)
        data = {"name": instance.name, "ram": instance.ram,
                "cpu": instance.cpu, "network": instance.network}
        return jsonify(data)

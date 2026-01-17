import libvirt
from flask import jsonify
from xml.dom import minidom
from app.database.database import DatabaseServices

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
        DatabaseServices.create_tables()
        DatabaseServices.addDefaultNetworks()

    def storeDesc(self):
        nets = DatabaseServices.getNetworks()
        if not nets:
            print("cannot get network")
            return jsonify({"error": "cannot get network"})

        for net in nets:
            net_name = net.name
            uri = net.uri

            try:
                conn = libvirt.open(uri)
                if not conn:
                    print(f"cannot open libvirt connection: {uri}")
                    continue

                domains = conn.listAllDomains()
                if not domains:
                    print(f"no domains found in {uri}")
                    conn.close()
                    continue

                for dom in domains:
                    try:
                        raw_xml = dom.XMLDesc()
                        xml = minidom.parseString(raw_xml)

                        # get name
                        name_elements = xml.getElementsByTagName("name")
                        name = name_elements[0].firstChild.data if name_elements else "No name"

                        # get ram
                        ram_elements = xml.getElementsByTagName("memory")
                        ram = ram_elements[0].firstChild.data if ram_elements else "0"

                        # get cpu
                        cpu_elements = xml.getElementsByTagName("vcpu")
                        cpu = cpu_elements[0].firstChild.data if cpu_elements else "0"

                        # get state
                        state, reason = dom.state()
                        state_name = states.get(state, 'unknown')

                        # Store in database
                        success = DatabaseServices.storeDesc(
                            name, net_name, state_name, ram, cpu, uri
                        )

                        if not success:
                            print(
                                f"Failed to store instance: {name}")

                    except Exception as e:
                        print(f"Error processing domain: {e}")
                        continue

                conn.close()

            except libvirt.libvirtError as e:
                print(f"Libvirt error {e}")
                continue
            except Exception as e:
                print(f"error: {e}")
                continue

        return jsonify({"message": "Instance data stored successfully"})

    def getDesc(self):
        data = DatabaseServices.queryDesc()
        return jsonify(data)

    def getData(self, name):
        instance = DatabaseServices.getInstance(name)
        if not instance:
            return jsonify({"error": "Instance not found"})

        data = {
            "name": instance.name,
            "ram": instance.ram,
            "cpu": instance.cpu,
            "network": instance.network,
            "status": instance.status,
            "uri": instance.uri,
        }
        return jsonify(data)

    def start(self, name):
        instance = DatabaseServices.getInstance(name)
        if not instance:
            return jsonify({"error": "instance not found"})

        try:
            conn = libvirt.open(instance.uri)
            if not conn:
                return jsonify({"error": "cannot open libvirt connection"})

            dom = conn.lookupByName(name)
            if not dom:
                conn.close()
                return jsonify({"error": "domain not found"})

            if dom.isActive():
                conn.close()
                return jsonify({"message": "machine is already running"})

            dom.create()
            conn.close()
            return jsonify({"message": "instance started successfully"})

        except libvirt.libvirtError as e:
            return jsonify({"error":  e})
        except Exception as e:
            return jsonify({"error": e})

    def shutdown(self, name):
        instance = DatabaseServices.getInstance(name)
        if not instance:
            return jsonify({"error": "Instance not found"})
        try:
            conn = libvirt.open(instance.uri)
            if not conn:
                return jsonify({"error": "cannot open libvirt connection"})
            dom = conn.lookupByName(name)
            if not dom:
                conn.close()
                return jsonify({"error": "domain not found"})

            if not dom.isActive():
                conn.close()
                return jsonify({"message": "domain already stopped"})

            dom.shutdown()
            conn.close()
            return jsonify({"message": "instance shutdown successfully"})

        except libvirt.libvirtError as e:
            return jsonify({"error": e})
        except Exception as e:
            return jsonify({"error": e})

    def suspend(self, name):
        instance = DatabaseServices.getInstance(name)
        if not instance:
            return jsonify({"error": "Instance not found"})

        try:
            conn = libvirt.open(instance.uri)
            if not conn:
                return jsonify({"error": "cannot open libvirt connection"})

            dom = conn.lookupByName(name)
            if not dom:
                conn.close()
                return jsonify({"error": "domain not found"})

            if not dom.isActive():
                conn.close()
                return jsonify({"message": "domain already stopped"})

            dom.suspend()
            conn.close()
            return jsonify({"message": "instance suspended successfully"})

        except libvirt.libvirtError as e:
            return jsonify({"error": e})
        except Exception as e:
            return jsonify({"error": e})

    def resume(self, name):
        instance = DatabaseServices.getInstance(name)
        if not instance:
            return jsonify({"error": "Instance not found"})

        try:
            conn = libvirt.open(instance.uri)
            if not conn:
                return jsonify({"error": "cannot open libvirt connection"})

            dom = conn.lookupByName(name)
            if not dom:
                conn.close()
                return jsonify({"error": "domain not found"})

            dom.resume()
            conn.close()
            return jsonify({"message": "instance resumed successfully"})

        except libvirt.libvirtError as e:
            return jsonify({"error": e})
        except Exception as e:
            return jsonify({"error": e})


import libvirt
from flask import jsonify
from xml.dom import minidom
from app.database.database import DatabaseServices
import uuid
import os

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
        pass

    def storeDesc(self):
        conn = None
        nets = DatabaseServices.getNetworks()
        if not nets:
            return jsonify({"error": "cannot get network"}), 500

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

        return jsonify({"message": "Instance data stored successfully"}), 200

    def getDesc(self):
        conn = None
        try:
            data = DatabaseServices.queryDesc()
            return jsonify(data), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    def getData(self, name):
        instance = DatabaseServices.getInstance(name)
        if not instance:
            return jsonify({"error": "Instance not found"}), 404

        data = {
            "name": instance.name,
            "ram": instance.ram,
            "cpu": instance.cpu,
            "network": instance.network,
            "status": instance.status,
            "uri": instance.uri,
        }
        return jsonify(data), 200

    def rmInstance(self, name):
        conn = None
        instance = DatabaseServices.getInstance(name)
        if not instance:
            return jsonify({"error": "instance not found"}), 404

        try:
            conn = libvirt.open(instance.uri)
            if not conn:
                return jsonify({"error": "cannot open libvirt connection"}), 500

            dom = conn.lookupByName(name)

            xml = dom.XMLDesc()
            parsed = minidom.parseString(xml)

            disk_path = None
            for disk in parsed.getElementsByTagName("disk"):
                if disk.getAttribute("device") == "disk":
                    source = disk.getElementsByTagName("source")
                    if source:
                        disk_path = source[0].getAttribute("file")

            if dom.isActive():
                dom.destroy()

            
            if disk_path and os.path.exists(disk_path):
                os.remove(disk_path)

            DatabaseServices.rmInstance(name)

            return jsonify({"message": "VM removed successfully"}), 200

        except libvirt.libvirtError as e:
            return jsonify({"error": str(e)}), 500
        except Exception as e:
            return jsonify({"error": str(e)}), 500

        finally:
            if dom:
                dom.undefine()
            if conn:
                conn.close()



    def start(self, name):
        conn = None
        instance = DatabaseServices.getInstance(name)
        if not instance:
            return jsonify({"error": "instance not found"}), 404

        try:
            conn = libvirt.open(instance.uri)
            if not conn:
                return jsonify({"error": "cannot open libvirt connection"}), 500

            dom = conn.lookupByName(name)
            if not dom:
                return jsonify({"error": "domain not found"}), 404

            if dom.isActive():
                return jsonify({"message": "machine is already running"}), 400

            dom.create()

            return jsonify({"message": "instance started successfully"}), 200

        except libvirt.libvirtError as e:
            return jsonify({"error":  e})
        except Exception as e:
            return jsonify({"error": e})

        finally:
            if conn:
                conn.close()

    def shutdown(self, name):
        conn = None
        instance = DatabaseServices.getInstance(name)
        if not instance:
            return jsonify({"error": "Instance not found"}), 404
        try:
            conn = libvirt.open(instance.uri)
            if not conn:
                return jsonify({"error": "cannot open libvirt connection"}), 500
            dom = conn.lookupByName(name)
            if not dom:
                return jsonify({"error": "domain not found"}), 404

            if not dom.isActive():
                return jsonify({"message": "domain already stopped"}), 400

            dom.shutdown()
            return jsonify({"message": "instance shutdown successfully"}), 200

        except libvirt.libvirtError as e:
            return jsonify({"error": str(e)})
        except Exception as e:
            return jsonify({"error": str(e)})

        finally:
            if conn:
                conn.close()

    def suspend(self, name):
        conn = None
        instance = DatabaseServices.getInstance(name)
        if not instance:
            return jsonify({"error": "Instance not found"}), 404

        try:
            conn = libvirt.open(instance.uri)
            if not conn:
                return jsonify({"error": "cannot open libvirt connection"}), 500

            dom = conn.lookupByName(name)
            if not dom:
                return jsonify({"error": "domain not found"}), 404

            if not dom.isActive():
                return jsonify({"message": "domain already stopped"}), 400

            dom.suspend()
            return jsonify({"message": "instance suspended successfully"}), 200

        except libvirt.libvirtError as e:
            return jsonify({"error": str(e)})
        except Exception as e:
            return jsonify({"error": str(e)})

        finally:
            if conn:
                conn.close()

    def resume(self, name):
        conn = None
        instance = DatabaseServices.getInstance(name)
        if not instance:
            return jsonify({"error": "Instance not found"}), 404

        try:
            conn = libvirt.open(instance.uri)
            if not conn:
                return jsonify({"error": "cannot open libvirt connection"}), 500

            dom = conn.lookupByName(name)
            if not dom:
                return jsonify({"error": "domain not found"}), 404

            dom.resume()
            return jsonify({"message": "instance resumed successfully"}), 200

        except libvirt.libvirtError as e:
            return jsonify({"error": str(e)}), 500
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
        finally:
            if conn:
                conn.close()



    def addInstance(self,name,memory,vcpu,path,iso,network):
        conn = None
        vm_uuid = str(uuid.uuid4())

        os_section = f"""
        <os>
          <type arch='x86_64'>hvm</type>
          <boot dev='cdrom'/>
          <boot dev='hd'/>
        </os>
        """

        devices_section = f"""
        <!-- Disk -->
        <disk type='file' device='disk'>
          <driver name='qemu' type='qcow2'/>
          <source file='{path}'/>
          <target dev='vda' bus='virtio'/>
        </disk>

        <!-- CD-ROM ISO -->
        <disk type='file' device='cdrom'>
          <driver name='qemu' type='raw'/>
          <source file='{iso}'/>
          <target dev='hdc' bus='ide'/>
          <readonly/>
        </disk>

        <!-- Network -->
        <interface type='network'>
          <source network='{network}'/>
          <model type='virtio'/>
        </interface>

        <!-- Graphics (VNC) -->
        <graphics type='vnc' port='-1'/>
        """

        xml = f"""
        <domain type='kvm'>
          <name>{name}</name>
          <uuid>{vm_uuid}</uuid>
          <memory unit='MiB'>{memory}</memory>
          <vcpu>{vcpu}</vcpu>
          {os_section}
          <devices>
            {devices_section}
          </devices>
        </domain>
        """

        try:
            conn = libvirt.open("qemu:///system")
            dom = conn.defineXML(xml)
            dom.create()

            return jsonify({"message": "VM successfully created"}), 200

        except libvirt.libvirtError as e:
            return jsonify({"error": str(e)}), 500

        finally:
            if conn:
                conn.close()

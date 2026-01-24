import libvirt
import xml.etree.ElementTree as ET
from flask import jsonify

class VolumeService:
    @staticmethod
    def convert(num):
        return round((float(num) * (1.25 * pow(10, -10))),2)

    def listAllPools(self):
        try:
            conn = libvirt.open("qemu:///system")
            if not conn:
                return jsonify({"error": "can't establish connection"})

            pools = conn.listAllStoragePools()
            if not pools:
                return jsonify({"error": "can't list volumes"})

            arr = []
            for pool in pools:
                if pool.isActive():
                    info = pool.info()
                    arr.append({"name": pool.name(),
                                "autostart": str(pool.autostart()),
                                "volumes": str(pool.numOfVolumes()),
                                "capacity": str(self.convert(info[1])),
                                "allocation": str(self.convert(info[2])),
                                "available": str(self.convert(info[3]))
                                })

            return arr

        except Exception as e:
            return jsonify({"error": str(e)})

        finally:
            conn.close()



    def listVolumes(self, pool):
        try:
            conn = libvirt.open("qemu:///system")
            if not conn:
                return jsonify({"error": "can't establish connection"})
            
            sp = conn.storagePoolLookupByName(pool)
            if not sp:
                return jsonify({"error": "can't open storage pool"})

            volumes = sp.listAllVolumes()
            arr = []
            for vol in volumes:
                arr.append({"name": str(vol.name())})

            return arr

        except Exception as e:
            return jsonify({"error": str(e)})

        finally:
            conn.close()

    def createVolume(self, pool_name, label, capacity):
        conn = None
        try:
            conn = libvirt.open("qemu:///system")

            volume = ET.Element("volume")
            ET.SubElement(volume, "name").text = label

            cap = ET.SubElement(volume, "capacity")
            cap.set("unit", "G")
            cap.text = str(int(capacity))

            stgvol_xml = ET.tostring(volume, encoding="unicode")

            pool = conn.storagePoolLookupByName(pool_name)
            stgvol = pool.createXML(stgvol_xml, 0)
            
            pool.refresh(0)

            return jsonify({"message": "successfully created the volume"})

        except libvirt.libvirtError as e:
            return jsonify({
                "error": "libvirt error",
            }), 400

        except Exception as e:
            return jsonify({"error": str(e)}), 500

        finally:
            if conn:
                conn.close()

import libvirt
from flask import jsonify

class VolumeService:
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
                                "num volumes": str(pool.numOfVolumes()),
                                "capacity": str((info[1] * (1.25 *  pow(10, -10)))),
                                "allocation": str((info[2] * (1.25 * pow(10, -10)))),
                                "available": str((info[3] * (1.25 * pow(10,-10)))),
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

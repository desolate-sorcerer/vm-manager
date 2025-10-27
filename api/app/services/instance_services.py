import libvirt
from flask import jsonify
from xml.dom import minidom


class InstanceService:
    @staticmethod
    def getDesc():
        try:
            conn = libvirt.open("qemu:///system")

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

                obj = {"name": name, "desc": desc}
                arr.append(obj)

            return jsonify(arr)

        except libvirt.libvirtError as e:
            return jsonify({e}), 500

        except Exception as e:
            return jsonify({e}), 500

        finally:
            conn.close()

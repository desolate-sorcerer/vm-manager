from flask import Flask, jsonify
import libvirt
from xml.dom import minidom

app = Flask(__name__)


@app.route("/sendXML", methods=['GET'])
def getData():

    conn = libvirt.open("qemu:///system")

    if not conn:
        return jsonify({"error": "failed to open vm"})

    dom = conn.lookupByID(5)
    if not dom:
        return jsonify({"error": "cannot find dom by id 5"})

    raw_xml = dom.XMLDesc()
    xml = minidom.parseString(raw_xml)

    name = xml.getElementsByTagName("name")[0].firstChild.data
    desc = xml.getElementsByTagName("description")[0].firstChild.data

    return jsonify({"name": name, "desc": desc})

    conn.close()


if __name__ == '__main__':
    app.run(debug=True, port=5000)

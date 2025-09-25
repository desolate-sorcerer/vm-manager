from flask import Flask, jsonify
import libvirt
from xml.dom import minidom
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/sendXML", methods=['GET'])
def getData():

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
        name = xml.getElementsByTagName("name")[0].firstChild.data
        desc = xml.getElementsByTagName("description")[0].firstChild.data
        obj = {"name": name, "desc": desc}
        arr.append(obj)

    return jsonify(arr)

    conn.close()


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0",  port=5000)

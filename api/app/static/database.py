import sqlalchemy as db
from sqlalchemy.orm import sessionmaker
from app.models.network_modules import Networks
from app.models.instance_modules import Instances
from flask import jsonify


engine = db.create_engine(
    'postgresql+psycopg2://nik:pass123@localhost/vm-db')
Session = sessionmaker(bind=engine)


class DatabaseServices:
    def getNet():
        try:
            session = Session()
            net = session.query(Networks).all()
            return net

        except Exception as e:
            return jsonify({e})

        finally:
            session.close()

    def queryDesc():
        try:
            session = Session()
            desc = session.query(Instances).all()
            arr = []
            for data in desc:
                arr.append(
                    {"name": data.name, "network": data.network, "status": data.status, "cpu": data.cpu, "ram": data.ram})
            return arr

        except Exception as e:
            return

        finally:
            session.close()

    def storeDesc(name, network, status, ram, cpu, uri):
        try:
            session = Session()

            res = session.query(Instances).filter(
                Instances.name == name).update({
                    'network': network,
                    'status': status,
                    'ram': ram,
                    'cpu': cpu,
                    'uri': uri
                })
            if res == 0:
                session.add(Instances(
                    name=name, network=network, status=status, ram=ram, cpu=cpu, uri=uri))
            session.commit()

        except Exception as e:
            print("error storing data")

        finally:
            session.close()

    def queryData(name):
        try:
            session = Session()
            data = session.query(Instances).all()
            for instance in data:
                if (instance.name == name):
                    return instance
        except Exception as e:
            return
        finally:
            session.close()

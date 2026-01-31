import sqlalchemy as db
from sqlalchemy.orm import sessionmaker
from app.models.models import Base, Networks, Instances
from flask import jsonify

engine = db.create_engine('sqlite:///vm_manager.db')
Session = sessionmaker(bind=engine)


class DatabaseServices:

    @staticmethod
    def create_tables():
        Base.metadata.create_all(engine)

    @staticmethod
    def queryDesc():
        session = Session()
        try:
            desc = session.query(Instances).all()
            arr = []
            for data in desc:
                arr.append({
                    "name": data.name,
                    "network": data.network,
                    "status": data.status,
                    "cpu": data.cpu,
                    "ram": data.ram,
                })
            return arr
        except Exception as e:
            return jsonify({"error": str(e)})
        finally:
            session.close()

    @staticmethod
    def storeDesc(name, network, status, ram, cpu, uri):
        session = Session()
        try:
            existing_instance = session.query(Instances).filter(
                Instances.name == name
            ).first()

            if existing_instance:
                existing_instance.network = network
                existing_instance.status = status
                existing_instance.ram = ram
                existing_instance.cpu = cpu
                existing_instance.uri = uri
            else:
                new_instance = Instances(
                    name=name,
                    network=network,
                    status=status,
                    ram=ram,
                    cpu=cpu,
                    uri=uri,
                )
                session.add(new_instance)

            session.commit()
            return True

        except Exception as e:
            print(f"Error storing data: {e}")
            session.rollback()
            return False
        finally:
            session.close()

    @staticmethod
    def getInstance(name):
        session = Session()
        try:
            instance = session.query(Instances).filter(
                Instances.name == name
            ).first()
            return instance
        except Exception as e:
            print({"Error": str(e)})
            return None
        finally:
            session.close()

    @staticmethod
    def rmInstance(name):
        session = Session()
        try:
            rows = session.query(Instances).filter(
                Instances.name == name
            ).delete()
            session.commit()
            if rows == 0:
                return False
            return True
        except Exception as e:
            session.rollback()
            return jsonify({"error": str(e)})
        finally:
            session.close()

    @staticmethod
    def getNetworks():
        session = Session()
        try:
            nets = session.query(Networks).all()
            return nets
        except Exception as e:
            return jsonify({"error": str(e)})
        finally:
            session.close()

    @staticmethod
    def addNetwork(name):
        session = Session()
        try:
            new_uri = f"qemu+ssh://{name}/system"
            new_network = Networks(name=name, uri=new_uri)
            session.add(new_network)
            session.commit()
            return True
        except Exception as e:
            print(f"error: {e}")
            session.rollback()
            return False
        finally:
            session.close()

    @staticmethod
    def delNetwork(name):
        session = Session()
        try:
            session.query(Networks).filter(
                Networks.name == name
            ).delete()
            session.commit()
            return True
        except Exception as e:
            print(f"error: {e}")
            session.rollback()
            return False
        finally:
            session.close()

    @staticmethod
    def addDefaultNetwork():
        session = Session()
        try:
            exists = session.query(Networks).filter(
                Networks.name == "localhost"
            ).first()

            if exists:
                return

            new_network = Networks(
                name="localhost",
                uri="qemu:///system"
            )
            session.add(new_network)
            session.commit()

        except Exception as e:
            print(f"Error: {e}")
            session.rollback()
        finally:
            session.close()

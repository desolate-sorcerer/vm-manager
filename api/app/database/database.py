import sqlalchemy as db
from sqlalchemy.orm import sessionmaker
from app.models.models import Base, Networks, Instances
from flask import jsonify

engine = db.create_engine('sqlite:///vm_manager.db')
Session = sessionmaker(bind=engine)


class DatabaseServices:
    def create_tables():
        Base.metadata.create_all(engine)

    def getNet():
        try:
            session = Session()
            net = session.query(Networks).all()
            return net
        except Exception as e:
            return jsonify({"error": str(e)})
        finally:
            session.close()

    def queryDesc():
        try:
            session = Session()
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

    def storeDesc(name, network, status, ram, cpu, uri):
        try:
            session = Session()

            existing_instance = session.query(Instances).filter(
                Instances.name == name).first()

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

    def getInstance(name):
        try:
            session = Session()
            instance = session.query(Instances).filter(
                Instances.name == name).first()
            return instance
        except Exception as e:
            print(f"Error: {e}")
            return None
        finally:
            session.close()

    def addDefaultNetworks():
        session = Session()

        try:
            default_networks = [
                {"name": "localhost", "uri": "qemu:///system"},
                {"name": "dmz", "uri": "qemu+ssh://dmz/system"},
            ]

            added_count = 0
            for network in default_networks:
                existing = session.query(Networks).filter(
                    Networks.name == network["name"]).first()
                if not existing:
                    new_network = Networks(
                        name=network["name"], uri=network["uri"])
                    session.add(new_network)
                    print(f" Added network: {
                          network['name']} -> {network['uri']}")
                    added_count += 1
                else:
                    print(f" Network already exists: {network['name']}")

            session.commit()
            print(f"\n Successfully added {added_count} networks")

            networks = session.query(Networks).all()
            print(f"\n Total networks in database: {len(networks)}")
            for net in networks:
                print(f"  - {net.name}: {net.uri}")

        except Exception as e:
            print(f" Error: {e}")
            session.rollback()
        finally:
            session.close()

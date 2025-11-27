import sqlalchemy as db
from sqlalchemy.orm import sessionmaker
from app.models.network_modules import Networks

engine = db.create_engine('sqlite:///vm_manager.db')
Session = sessionmaker(bind=engine)


def add_default_networks():
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


if __name__ == "__main__":
    add_default_networks()

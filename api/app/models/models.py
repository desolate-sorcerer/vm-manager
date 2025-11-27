from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Networks(Base):
    __tablename__ = 'networks'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    uri = Column(String)


class Instances(Base):
    __tablename__ = 'instances'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    network = Column(String)
    status = Column(String)
    ram = Column(String)
    cpu = Column(String)
    uri = Column(String)

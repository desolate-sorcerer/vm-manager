from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

base = declarative_base()


class Instances(base):
    __tablename__ = 'instances'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    network = Column(String)
    status = Column(String)

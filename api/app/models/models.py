from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

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

class User(UserMixin, Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

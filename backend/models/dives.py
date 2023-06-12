from sqlalchemy import Column, Integer, String, Date
from .database import db_session, Base

class Dive(Base):
    __tablename__ = "dives"

    id = Column(Integer, primary_key=True)
    date = Column(Date)
    dive_number = Column(String)
    boat = Column(String)
    dive_guide = Column(String)
    dive_site = Column(String)

    @staticmethod
    def save(self):
        db_session.add(self)
        db_session.commit()

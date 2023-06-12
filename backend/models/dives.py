from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import relationship
from .database import db_session, Base

class Dive(Base):
    __tablename__ = "dives"

    id = Column(Integer, primary_key=True)
    date = Column(Date, nullable=False)
    dive_number = Column(String, nullable=False)
    boat = Column(String, nullable=False)
    dive_guide = Column(String, nullable=False)
    dive_site = Column(String, nullable=False)
    
    sightings = relationship('Sightings', back_populates='dive')

    # @staticmethod
    def save(self):
        db_session.add(self)
        db_session.commit()

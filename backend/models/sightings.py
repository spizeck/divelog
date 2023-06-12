from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import db_session, Base

class Sightings(Base):
    __tablename__ = "sightings"

    id = Column(Integer, primary_key=True)
    species = Column(String(50), nullable=False)
    count = Column(Integer, nullable=False)
    dive_id = Column(Integer, ForeignKey('dives.id'), nullable=False)
    
    dive = relationship('Dive', back_populates='sightings')

    @staticmethod
    def save(self):
        db_session.add(self)
        db_session.commit()
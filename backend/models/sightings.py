from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, Session
from .database import Base, db_session


class Sightings(Base):
    __tablename__ = "sightings"

    id = Column(Integer, primary_key=True)
    species = Column(String, nullable=False)
    count = Column(Integer, nullable=False)
    dive_id = Column(Integer, ForeignKey('dives.id'), nullable=False)

    dive = relationship('Dive', back_populates='sightings')

    def save(self, session: Session = db_session):
        session.add(self)
        session.commit()

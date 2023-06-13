from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import relationship, Session
from .database import Base, db_session

class Dive(Base):
    __tablename__ = "dives"

    id = Column(Integer, primary_key=True)
    date = Column(Date, nullable=False)
    dive_number = Column(String, nullable=False)
    boat = Column(String, nullable=False)
    dive_guide = Column(String, nullable=False)
    dive_site = Column(String, nullable=False)
    
    sightings = relationship('Sightings', back_populates='dive')

    def save(self, session: Session = db_session):
        session.add(self)
        session.commit()

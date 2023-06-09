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

    def __init__(self, date, dive_number, boat, dive_guide, dive_site):
        self.date = date
        self.dive_number = dive_number
        self.boat = boat
        self.dive_guide = dive_guide
        self.dive_site = dive_site

    def save(self):
        db_session.add(self)
        db_session.commit()

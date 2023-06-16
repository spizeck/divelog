from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import relationship, Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy.event import listens_for
from extensions import Base, db_session

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
        
    # Prevent duplicate entries
    def validate_unique(self):
        # Perform a query to check if the dive already exists
        duplicate_dive = (
            db_session.query(Dive)
            .filter(
                Dive.date == self.date,
                Dive.dive_number == self.dive_number,
                Dive.boat == self.boat,
                Dive.dive_guide == self.dive_guide,
            )
            .first()
        )
        if duplicate_dive:
            raise IntegrityError("Dive already exists")
        
    @staticmethod
    @listens_for(Session, 'before_commit')
    def before_commit(session: Session, flush_context, instances):
        # Run the validation before committing the changes to the database
        for instance in session.new:
            if isinstance(instance, Dive):
                instance.validate_unique()
                
        for instance in session.dirty:
            if isinstance(instance, Dive):
                instance.validate_unique()
        
    @staticmethod
    @listens_for(Session, 'before_flush')
    def before_flush(session: Session, flush_context, instances):
        # Run the validation before flushing the changes to the database
        for instance in session.new:
            if isinstance(instance, Dive):
                instance.validate_unique()

        for instance in session.dirty:
            if isinstance(instance, Dive):
                instance.validate_unique()

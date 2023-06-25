from extensions import db
from errors import DiveIntegrityError


class Dive(db.Model):
    __tablename__ = "dives"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.Date, nullable=False)
    dive_number = db.Column(db.String, nullable=False)
    boat = db.Column(db.String, nullable=False)
    dive_guide = db.Column(db.String, nullable=False)
    dive_site = db.Column(db.String, nullable=False)

    sightings = db.relationship('Sightings', back_populates='dive')

    def save(self):
        self.validate_unique()
        db.session.add(self)
        db.session.commit()

    def validate_unique(self):
        if existing_dive := Dive.query.filter_by(
            date=self.date,
            dive_number=self.dive_number,
            boat=self.boat,
            dive_guide=self.dive_guide,
        ).first():
            # Rollback the session to prevent the duplicate dive from being saved
            db.session.rollback()
            raise DiveIntegrityError()

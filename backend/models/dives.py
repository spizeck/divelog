from extensions import db
from errors import DiveIntegrityError, DiveInfoMissingError


class Dive(db.Model):
    __tablename__ = "dives"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.Date, nullable=False)
    dive_number = db.Column(db.Integer, nullable=False)
    boat = db.Column(db.String, nullable=False)
    dive_guide = db.Column(db.String, nullable=False)
    dive_site = db.Column(db.String, nullable=False)
    max_depth = db.Column(db.Integer, nullable=False)
    water_temperature = db.Column(db.Integer, nullable=False)

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

    # check that all fields are present
    def validate(self):
        if not self.date or not self.dive_number or not self.boat or not self.dive_guide or not self.dive_site or not self.max_depth or not self.water_temperature:
            raise DiveInfoMissingError()
        
    def serialize(self):
        return {
            "id": self.id,
            "date": self.date.strftime("%Y-%m-%d"),
            "diveNumber": self.dive_number,
            "boat": self.boat,
            "diveGuide": self.dive_guide,
            "diveSite": self.dive_site,
            "maxDepth": self.max_depth,
            "waterTemperature": self.water_temperature,
        }
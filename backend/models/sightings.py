from extensions import db

class Sightings(db.Model):
    __tablename__ = "sightings"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    species = db.Column(db.String, nullable=False)
    count = db.Column(db.Integer, nullable=False)
    dive_id = db.Column(db.Integer, db.ForeignKey('dives.id'), nullable=False)

    dive = db.relationship('Dive', back_populates='sightings')

    def save(self):
        db.session.add(self)
        db.session.commit()
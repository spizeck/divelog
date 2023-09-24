from app import db


class UserPreferences(db.Model):
    __tablename__ = "user_preferences"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    preferred_units = db.Column(
        db.String(255), nullable=False, default="imperial")
    first_name = db.Column(db.String(255), nullable=True)

    user = db.relationship(
        'User', back_populates='user_preferences', uselist=False)

    def __init__(self, user_id, first_name=None, preferred_units='imperial'):
        self.user_id = user_id
        self.first_name = first_name
        self.preferred_units = preferred_units

    def update(self, preferred_units=None, first_name=None):
        if preferred_units:
            self.preferred_units = preferred_units
        if first_name:
            self.first_name = first_name
        db.session.commit()

    def get_user_preferences(self):
        return {
            'firstName': self.first_name,
            'preferredUnits': self.preferred_units,
        }

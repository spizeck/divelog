from app import db

class UserPreferences(db.Model):
    __tablename__ = "user_preferences"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    preferred_units = db.Column(db.String(255), nullable=False, default="imperial")
    
    user = db.relationship('User', back_populates='user_preferences', uselist=False)
    
    def __init__(self, user_id, preferred_units='imperial'):
        self.user_id = user_id
        self.preferred_units = preferred_units
        
    def update(self, preferred_units=None):
        if preferred_units:
            self.preferred_units = preferred_units
        db.session.commit()
        
    def get_user_preferences(self):
        return "imperial" if self.preferred_units == "imperial" else "metric"
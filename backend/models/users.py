from app import db
from datetime import datetime
from utils.validators import validate_email_format, validate_password_strength, validate_username

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    is_approved = db.Column(db.Boolean, default=False)
    admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __init__(self, username, email, password, is_approved=False, admin=False):
        self.username = username
        self.email = email
        self.password = password
        self.is_approved = is_approved
        self.admin = admin

    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def validate_email_format(email):
        return validate_email_format(email)
    
    @staticmethod
    def validate_password_strength(password):
        return validate_password_strength(password)
    
    @staticmethod
    def validate_username(username):
        return validate_username(username)
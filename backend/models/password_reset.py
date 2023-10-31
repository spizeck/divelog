from datetime import datetime, timedelta, timezone
from extensions import db

class PasswordResetTokens(db.Model):
    __tablename__ = "password_reset_tokens"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(120), nullable=False)
    reset_token = db.Column(db.String(32), unique=True, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc) + timedelta(hours=1))
    
    def __init__(self, email, reset_token):
        self.email = email
        self.reset_token = reset_token
        self.expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
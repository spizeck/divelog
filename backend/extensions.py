from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required

db = SQLAlchemy()
jwt = JWTManager()
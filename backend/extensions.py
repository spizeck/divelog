from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from postmarker.core import PostmarkClient

db = SQLAlchemy()
jwt = JWTManager()
postmark_client = PostmarkClient()

def init_postmark(app, server_token):
    postmark_client.server_token = server_token
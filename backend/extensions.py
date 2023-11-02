from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from postmarker.core import PostmarkClient

db = SQLAlchemy()
jwt = JWTManager()
postmark_client = None

def init_postmark(server_token):
    global postmark_client
    postmark_client = PostmarkClient(server_token)
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from flask import current_app

db = SQLAlchemy()
Base = declarative_base()
db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False))

def init_db(app):
    db.init_app(app)
    Base.query = db_session.query_property()
    app.before_request(before_request)
    app.teardown_request(teardown_request)

def before_request():
    db_session.configure(bind=db.engine)

def teardown_request(exception=None):
    db_session.remove()

def create_all():
    from .sightings import Sightings
    with current_app.app_context():
        Base.metadata.create_all(bind=db.engine)
        Sightings.__table__.create(bind=db.engine)

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

db = SQLAlchemy()
Base = declarative_base()
db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False))


def init_db(app):
    db.init_app(app)
    app.before_request(before_request)
    app.teardown_request(teardown_request)


def before_request():
    db.session()


def teardown_request(exception=None):
    db.session.remove()


def create_all(app):
    with app.app_context():
        Base.metadata.create_all(bind=db.engine)

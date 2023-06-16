from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def init_db(app):
    db.init_app(app)
    app.before_request(before_request)
    app.teardown_request(teardown_request)


def before_request():
    db.session()


def teardown_request(exception=None):
    db.session.remove()
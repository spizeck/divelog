from flask import Flask
from config import Config
from errors import register_error_handlers
from extensions import db

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Flask extensions
    db.init_app(app)

    # Register error handlers
    register_error_handlers(app)

    # Register blueprints
    from routes.auth_routes import auth_bp
    from routes.db_routes import db_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(db_bp)

    return app

app = create_app()

if __name__ == '__main__':
    app.run()

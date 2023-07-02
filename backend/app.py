from flask import Flask, jsonify
from flask_cors import CORS
from config import app_config
from errors import register_error_handlers
from extensions import db, jwt


def create_app(config_class=app_config):
    app = Flask(__name__)
    CORS(app)

    # Configure Flask app
    app.config.from_object(config_class)

    # Initialize Flask extensions
    db.init_app(app)
    jwt.init_app(app)

    # Register error handlers
    register_error_handlers(app)

    # Register blueprints
    from routes.auth_routes import auth_bp
    from routes.db_routes import db_bp
    from routes.admin_routes import admin_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(db_bp)
    app.register_blueprint(admin_bp)
    
    # Create database tables
    with app.app_context():
        db.drop_all() # comment out for production
        db.create_all()

    @app.route('/')
    def index():
        return jsonify(message='Welcome to the Dive Log API'), 200

    return app


app = create_app()

if __name__ == '__main__':
    app.run()

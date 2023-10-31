from flask import Flask, jsonify
from flask_cors import CORS
init_postmark
from config import app_config
from errors import register_error_handlers
from extensions import db, jwt, init_postmark


def create_app(config_class=app_config):
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*",
         "allow_headers": ["Content-Type", "Authorization"]}})

    # Configure Flask app
    app.config.from_object(config_class)

    # Initialize Flask extensions
    db.init_app(app)
    jwt.init_app(app)
    init_postmark(app, config_class.POSTMARK_SERVER_TOKEN)

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
        # db.drop_all() # comment out for production
        db.create_all()

    @app.route('/send_test_email', methods=['GET'])
    def send_test_email():
        result = app.postmark.emails.send(
            From='divelog@seasaba.com',
            To='chad@seasaba.com',
            Subject='Test email from Postmark',
            TextBody='This is a test email sent via Postmark.'
        )
        if result:
            return jsonify(message='Test email sent successfully!'), 200
        else:
            return jsonify(message='Failed to send test email.'), 500

    @app.route('/')
    def index():
        return jsonify(message='Welcome to the Dive Log API'), 200

    return app


app = create_app()

if __name__ == '__main__':
    app.run()

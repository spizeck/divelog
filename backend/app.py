from config import app_config
from extensions import create_all, init_db
from flask import Flask
from flask_cors import CORS
from routes.auth import register_routes as register_auth_routes
from routes.db_routes import register_routes as register_db_routes


def create_app():
    app = Flask(__name__)
    CORS(app)

    return app


app = create_app()

# Set the app configuration
app.config.from_object(app_config)

# Initialize the database
init_db(app)

# Call create_all function to create database tables
create_all(app)

# Register the blueprints
register_auth_routes(app)
register_db_routes(app)

if __name__ == '__main__':
    app.run()

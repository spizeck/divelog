from flask import Flask
from flask_cors import CORS
from extensions import db, init_db, create_all
from routes.db_routes import register_routes
from config import app_config

app = Flask(__name__)
CORS(app)

# Set the app configuration
app.config.from_object(app_config)

# Initialize the database
init_db(app)

# Call create_all function to create database tables
create_all(app)

# Register the blueprints
register_routes(app)

if __name__ == '__main__':
    app.run()

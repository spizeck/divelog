from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv
from extensions import db, init_db, create_all
from routes.db_routes import register_routes

# load environment variables from the .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Check if the database URL is set
if not app.config['SQLALCHEMY_DATABASE_URI']:
    raise ValueError("SQLALCHEMY_DATABASE_URI is not set.")

init_db(app)

# Call create_all function to create database tables
create_all(app)

# Register the blueprints
register_routes(app)

if __name__ == '__main__':
    app.run()

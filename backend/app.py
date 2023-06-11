from flask import Flask
from models.database import init_db
from models.dives import Dive
import models.tester
import os
from dotenv import load_dotenv
# from models.sightings import Sighting
# load environment variables from the .env file
load_dotenv()

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Check if the database URL is set
if not app.config['SQLALCHEMY_DATABASE_URI']:
    raise ValueError("SQLALCHEMY_DATABASE_URI is not set.")

init_db(app)

@app.route('/')
def index():
    return('At least that worked...')

@app.route('/test')
def test_connection():
    try:
        # Perform a simple query to test the database connection
        dives = Dive.query.all()
        return 'Database connection successful'
    except Exception as e:
        return f'Error connecting to database: {str(e)}'
    
@app.route('/table_tester')
def check_tables(): 
    models.tester.create_table_if_not_exists()
    models.tester.read_entries()
    return 'actions completed'
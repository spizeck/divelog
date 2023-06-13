from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from models.database import db, init_db, create_all
from models.dives import Dive
from models.sightings import Sightings

# load environment variables from the .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')

# Check if the database URL is set
if not app.config['SQLALCHEMY_DATABASE_URI']:
    raise ValueError("SQLALCHEMY_DATABASE_URI is not set.")

init_db(app)

# Call create_all function to create database tables
create_all(app)


@app.route('/')
def index():
    return ('At least that worked...')


@app.route('/test')
def test_connection():
    try:
        # Perform a simple query to test the database connection
        dives = Dive.query.all()
        return 'Database connection successful'
    except Exception as e:
        return f'Error connecting to database: {str(e)}'


@app.route('/dives', methods=['POST'])
def create_dive():
    # Extract form data from the request
    data = request.json

    # Create a new Dive instance and populate it with form data
    dive = Dive(
        date=data['date'],
        dive_number=data['diveNumber'],
        boat=data['boat'],
        dive_guide=data['diveGuide'],
        dive_site=data['diveSite']
    )

    # Save the dive to the dive table in the database
    db.session.add(dive)
    db.session.commit()

    # Fetch the generated dive ID
    dive_id = dive.id

    return jsonify({'message': 'Dive created successfully', 'diveId': dive_id}), 201


@app.route("/sightings", methods=["POST"])
def create_sighting():
    # Extract form data from the request
    data = request.get_json()
    print("Received data:", data)  # Add this line to print the received data

    dive_id = data.get('dive_id')
    sightings = data.get('sightings')

    if dive_id is None or not isinstance(sightings, list):
        return jsonify({"error": "Invalid request data"}), 400

    # Create new Sighting instances and populate them with form data
    for sighting in sightings:
        species = sighting.get("species")
        count = sighting.get("count")

        if species is not None and count is not None:
            sighting_instance = Sightings(
                species=species, count=count, dive_id=dive_id)
            sighting_instance.save()  # Use the instance method to save

    return jsonify({"message": "Sightings created successfully"}), 201


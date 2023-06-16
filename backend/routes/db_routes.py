from flask import Blueprint, jsonify, request
from models.dives import Dive
from models.sightings import Sightings
from extensions import db

db_routes = Blueprint('db_routes', __name__)

@db_routes.route('/')
def index():
    return jsonify(message='Welcome to the API')


@db_routes.route('/test')
def test_database_connection():
    try:
        # Perform a simple query to test the database connection
        dives = db.session.query(Dive).all()
        sightings = db.session.query(Sightings).all()

        # If the queries executed successfully, the database connection is working
        return jsonify(message='Database connection successful'), 200
    except Exception as e:
        # If there's an exception, there is an issue with the database connection
        return jsonify(message= f'Error connecting to database: {str(e)}'), 500


@db_routes.route('/dives', methods=['POST'])
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


import traceback

@db_routes.route("/sightings", methods=["POST"])
def create_sighting():
    # Extract form data from the request
    data = request.json.get('sightings', [])
    print("Received data:", data)  # Add this line to print the received data

    try:
        for sighting_data in data:
            # Extract the necessary fields from each sighting data
            species = sighting_data.get('species')
            count = sighting_data.get('count')
            dive_id = sighting_data.get('dive_id')

            if species is not None and count is not None:
                sighting_instance = Sightings(
                    species=species, count=count, dive_id=dive_id)
                db.session.add(sighting_instance)  # Add the instance to the session
            else:
                raise ValueError("Missing required fields in sighting data")
        
        db.session.commit()  # Commit the session to save the sightings
        return {'message': 'Sightings created successfully'}, 201
    except Exception as e:
        traceback.print_exc()  # Print the error traceback
        return {'message': 'Failed to create sightings', 'error': str(e)}, 400


def register_routes(app):
    app.register_blueprint(db_routes)
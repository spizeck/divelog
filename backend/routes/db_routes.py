from app import db
from flask import Blueprint, jsonify, request
from models.dives import Dive
from models.sightings import Sightings
from sqlalchemy import text
from errors import DiveIntegrityError, DiveInfoMissingError
import logging

db_bp = Blueprint('db_bp', __name__, url_prefix='/db')


@db_bp.route('/test', methods=['GET'])
def test_database_connection():
    try:
        # Perform a simple query to test the database connection
        db.session.execute(text('SELECT 1'))

        # If the queries executed successfully, the database connection is working
        return jsonify(message='Database connection successful'), 200
    except Exception as e:
        # If there's an exception, there is an issue with the database connection
        logging.error(e)
        return jsonify(message='Error connecting to database'), 500


@db_bp.route('/dives/entries', methods=['POST'])
def create_dive():
    # Extract form data from the request
    data = request.json

    try:

        # Create a new Dive instance and populate it with form data
        dive = Dive(
            date=data['date'],
            dive_number=data['diveNumber'],
            boat=data['boat'],
            dive_guide=data['diveGuide'],
            dive_site=data['diveSite'],
            max_depth=data['maxDepth'],
            water_temperature=data['waterTemperature'],
        )

        # Validate that the dive
        dive.validate()
        dive.validate_unique()

        # Save the dive to the dive table in the database
        db.session.add(dive)
        db.session.commit()

        # Fetch the generated dive ID
        dive_id = dive.id

        return jsonify(message='Dive created successfully', diveId=dive_id, status=201), 201

    except DiveIntegrityError as e:
        logging.error(e)
        db.session.rollback()
        return jsonify({'status': 409, 'message': 'Dive already exists'}), 409
    
    except DiveInfoMissingError as e:
        logging.error(e)
        db.session.rollback()
        return jsonify({'status': 400, 'message': 'Dive information is incomplete'}), 400

    except Exception as e:
        logging.error(e)
        db.session.rollback()
        return jsonify({'status': 500, 'message': 'Failed to create dive - Database Connection Error'}), 500


@db_bp.route("/sightings/entries", methods=["POST"])
def create_sighting():
    # Extract form data from the request
    data = request.json.get('sightings', [])

    try:
        sightings_to_save = []
        for sighting_data in data:
            # Extract the necessary fields from each sighting data
            species = sighting_data.get('species')
            count = sighting_data.get('count')
            dive_id = sighting_data.get('dive_id')

            if species is not None and count is not None and count != 0:
                sighting_instance = Sightings(
                    species=species, count=count, dive_id=dive_id)
                sightings_to_save.append(sighting_instance)

        if sightings_to_save:
            db.session.add_all(sightings_to_save)
            db.session.commit()  # Commit the session to save the sightings

        return jsonify(message='Sightings created successfully', status=201), 201
    except Exception as e:
        logging.error(e)
        db.session.rollback()
        return jsonify(message='Failed to create sightings', status=400), 400


def register_routes(app):
    app.register_blueprint(db_bp)

from app import db
from flask import Blueprint, jsonify, request
from models.dives import Dive
from models.sightings import Sightings
from sqlalchemy import text
from errors import DiveIntegrityError, DiveInfoMissingError
from dateutil.parser import parse
import logging

db_bp = Blueprint('db_bp', __name__, url_prefix='/db')


@db_bp.route('/test', methods=['GET'])
def test_database_connection():
    try:
        # Perform a simple query to test the database connection
        db.session.execute(text('SELECT 1'))

        # If the queries executed successfully, the database connection is working
        return jsonify({'message':'Database connection successful'}), 200
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
            boat=data['boatName'],
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

        return jsonify({'message':'Dive created successfully', 'diveId':dive_id, 'status':201}), 201

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

        return jsonify({'message':'Sightings created successfully', 'status':201}), 201
    except Exception as e:
        logging.error(e)
        db.session.rollback()
        return jsonify(message='Failed to create sightings', status=400), 400
    
# Get dives filtered by date    
@db_bp.route('/dives/bydate', methods=['GET'])
def get_dives_by_date():
    data = request.json
    
    try:
        if 'startDate' not in data or 'endDate' not in data:
            return jsonify({'status': 400, 'message': 'Missing start or end date'}), 400
        
        try:
            start_date = parse(data['startDate']).date()
            end_date = parse(data['endDate']).date()
        except ValueError:
            return jsonify({'status': 400, 'message': 'Invalid date format'}), 400
        
        dives = Dive.query.filter(Dive.date.between(start_date, end_date)).all()
        
        result = [dive.serialize() for dive in dives]
        
        return jsonify({'dives': result, 'status': 200}), 200
    
    except Exception as e:
        logging.error(e)
        return jsonify({'status': 500, 'message': 'Failed to get dives'}), 500

@db_bp.route('/dives/byguide', methods=['GET'])
def get_dives_by_guide():
    data = request.args
    
    try:
        if 'diveGuide' not in data:
            return jsonify({'status': 400, 'message': 'Missing guide'}), 400
        
        page = int(data.get('page', 1))
        if page < 1:
            return jsonify({'status': 400, 'message': 'Invalid page number'}), 400
        offset = (page - 1) * 10
        
        dives = Dive.query.filter(Dive.dive_guide == data['diveGuide']).offset(offset).limit(10).all()
        
        result = [dive.serialize() for dive in dives]
        
        return jsonify({'dives': result, 'status': 200}), 200
    
    except Exception as e:
        logging.error(e)
        return jsonify({'status': 500, 'message': 'Failed to get dives'}), 500
    
@db_bp.route('/dives/editDive', methods=['PUT'])
def edit_dive():
    data = request.json
    
    try:
        if 'diveId' not in data:
            return jsonify({'status': 400, 'message': 'Missing dive ID'}), 400
        
        dive_id = data['diveId'],
        
        # Fetch the existing dive
        dive = Dive.query.filter(Dive.id == dive_id).first()
        
        if dive is None:
            return jsonify({'status': 404, 'message': 'Dive not found'}), 404
        
        # Update the dive with the new data
        required_fields = ['date', 'diveNumber', 'boatName', 'diveGuide', 'diveSite', 'maxDepth', 'waterTemperature']
        for field in required_fields:
            if field not in data:
                return jsonify({'status': 400, 'message': 'Missing field: {}'.format(field)}), 400
            setattr(dive, field, data[field])
        
        # Validate that the dive
        dive.validate()
        
        # Save the dive to the dive table in the database
        db.session.commit()
        return jsonify({'message':'Dive edited successfully', 'status':200}), 200
        
    except Exception as e:
        logging.error(e)
        db.session.rollback()
        return jsonify({'status': 500, 'message': 'Failed to edit dive'}), 500
    
@db_bp.route('/dives/pages', methods=['GET'])
def get_pages():
    sort_method = request.args.get('sortMethod')
    key = request.args.get('key')
    
    if sort_method is None or key is None:
        return jsonify({'status': 400, 'message': 'Missing sort method or key'}), 400
    
    if sort_method == 'diveGuide':
        try:
        # Return the number of entries for the given dive guide
            count = Dive.query.filter(Dive.dive_guide == key).count()
            return jsonify({'count': count, 'status': 200}), 200
        except Exception as e:
            logging.error(e)
            db.session.rollback()
            return jsonify({'status': 500, 'message': 'Failed to get dive count'}), 500
    
    if sort_method == 'dateRange':
        start_date = request.args.get('startDate')
        end_date = request.args.get('endDate')
        count = Dive.query.filter(Dive.date.between(start_date, end_date)).count()
        return jsonify({'count': count, 'status': 200}), 200
    
    return jsonify({'status': 400, 'message': 'Invalid sort method'}), 400
        
@db_bp.route('/dives/deleteDive', methods=['DELETE'])
def delete_dive():
    data = request.args
    
    if 'diveId' not in data:
        return jsonify({'status': 400, 'message': 'Missing dive ID'}), 400
    
    try:
        dive_id = data['diveId']
        dive = Dive.query.filter(Dive.id == dive_id).first()
        
        if dive is None:
            db.session.rollback()
            return jsonify({'status': 404, 'message': 'Dive not found'}), 404
        
        db.session.delete(dive)
        db.session.commit()
        return jsonify({'message':'Dive deleted successfully', 'status':200}), 200
    
    except Exception as e:
        logging.error(e)
        db.session.rollback()
        return jsonify({'status': 500, 'message': 'Failed to delete dive'}), 500

def register_routes(app):
    app.register_blueprint(db_bp)

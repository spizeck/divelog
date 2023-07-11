import logging

from dateutil.parser import parse
from errors import (DiveInfoMissingError, DiveIntegrityError,
                    InvalidDateFormatError, MissingDateError,
                    MissingDiveGuideError, DiveNotFound, InvalidPageNumber)
from extensions import db
from models.dives import Dive
from models.sightings import Sightings
from sqlalchemy import text

def _log_and_rollback(e):
    logging.error(e)
    db.session.rollback()


def _create_dive_instance(data):
    dive = Dive(
        date=data['date'],
        dive_number=data['diveNumber'],
        boat=data['boatName'],
        dive_guide=data['diveGuide'],
        dive_site=data['diveSite'],
        max_depth=data['maxDepth'],
        water_temperature=data['waterTemperature'],
    )

    dive.validate()
    dive.validate_unique()

    return dive


def test_database_connection():
    try:
        # Perform a simple query to test the database connection
        db.session.execute(text('SELECT 1'))

        # If the queries executed successfully, the database connection is working
        return {'message': 'Database connection successful'}, 200
    except Exception as e:
        # If there's an exception, there is an issue with the database connection
        logging.error(e)
        return {'message': 'Error connecting to database'}, 500

def create_dive(data):
    try:
        dive = _create_dive_instance(data)

        db.session.add(dive)
        db.session.commit()

        dive_id = dive.id

        return {'message': 'Dive created successfully', 'diveId': dive_id, 'status': 201}, 201

    except DiveIntegrityError as e:
        _log_and_rollback(e)
        return {'status': 409, 'message': str(e)}, 409

    except DiveInfoMissingError as e:
        _log_and_rollback(e)
        return {'status': 400, 'message': str(e)}, 400

    except Exception as e:
        _log_and_rollback(e)
        return {'status': 500, 'message': 'Failed to create dive - Database connection error'}, 500


def create_sighting(data):
    # Sightings data comes in as a list of dictionaries
    # Each dictionary represents a single sighting
    try:
        sightings_to_save = []
        for sighting_data in data:
            species = sighting_data.get('species')
            count = sighting_data.get('count')
            dive_id = sighting_data.get('dive_id')

            # Check that a dive with the given ID exists
            dive = Dive.query.filter(Dive.id == dive_id).first()

            if not dive:
                raise DiveNotFound()

            # Create a sightings instance for every species with a count
            if species is not None and count is not None and count != 0:
                sighting_instance = Sightings(
                    species=species, count=count, dive_id=dive_id)
                sightings_to_save.append(sighting_instance)

        if sightings_to_save:
            db.session.add_all(sightings_to_save)
            db.session.commit()

        return {'message': 'Sightings created successfully', 'status': 201}, 201

    except DiveNotFound as e:
        return {'message': str(e), 'status': 404}, 404

    except Exception as e:
        _log_and_rollback(e)
        return {'message': 'Failed to create sightings', 'status': 400}, 400


def get_dives_by_date_range(data):
    try:
        if 'startDate' not in data or 'endDate' not in data:
            raise MissingDateError()

        try:
            start_date = parse(data['startDate']).date()
            end_date = parse(data['endDate']).date()
        except ValueError as e:
            raise InvalidDateFormatError() from e

        if dives := Dive.query.filter(Dive.date.between(start_date, end_date)).all():
            results = [dive.serialize() for dive in dives]
            return {'dives': results, 'status': 200}, 200

        else:
            logging.error(data)
            return {'message': 'No dives found', 'status': 404}, 404

    except MissingDateError as e:
        return {'message': str(e), 'status': 400}, 400

    except InvalidDateFormatError as e:
        return {'message': str(e), 'status': 400}, 400

    except Exception as e:
        logging.error(e)
        return {'message': 'Failed to get dives', 'status': 500}, 500


def get_dives_by_guide(data):  # sourcery skip: extract-method
    
    entries_per_page = 10
    
    try:
        if 'diveGuide' not in data:
            raise MissingDiveGuideError()
        
        page = int(data.get('page', 1))
        
        if page < 1:
            raise InvalidPageNumber()
        
        offset = (page - 1) * entries_per_page
        dives = Dive.query.filter(Dive.dive_guide == data['diveGuide']).order_by(Dive.date.desc()).limit(entries_per_page).offset(offset).all()

        return {'dives': [dive.serialize() for dive in dives], 'status': 200}, 200

    except MissingDiveGuideError as e:
        return {'message': str(e), 'status': 400}, 400
    
    except InvalidPageNumber as e:
        return {'message': str(e), 'status': 400}, 400

    except Exception as e:
        logging.error(e)
        return {'message': 'Failed to get dives', 'status': 500}, 500
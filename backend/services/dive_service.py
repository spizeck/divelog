import logging
import math

from dateutil.parser import parse
from errors import (DiveInfoMissingError, DiveIntegrityError, DiveNotFound,
                    InvalidDateFormatError, InvalidPageNumber,
                    InvalidSortMethodError, MissingDateError,
                    MissingDiveGuideError, MissingDiveId,
                    MissingSortMethodOrKeyError)
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


def verify_database_connection():
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

    try:
        if 'diveGuide' not in data:
            raise MissingDiveGuideError()

        page = int(data.get('page', 1))
        entries_per_page = int(data.get('entriesPerPage', 10))

        if page < 1:
            raise InvalidPageNumber()

        offset = (page - 1) * entries_per_page
        dives = Dive.query.filter(Dive.dive_guide == data['diveGuide']).order_by(
            Dive.date.desc()).limit(entries_per_page).offset(offset).all()
        
        total_count = Dive.query.filter(Dive.dive_guide == data['diveGuide']).count()
        
        response = {
            'dives': [dive.serialize() for dive in dives],
            'totalPages': math.ceil(total_count / entries_per_page),
            'perPage': entries_per_page,
            'currentPage': page,
            'status': 200
        }

        return response, 200

    except MissingDiveGuideError as e:
        return {'message': str(e), 'status': 400}, 400

    except InvalidPageNumber as e:
        return {'message': str(e), 'status': 400}, 400

    except Exception as e:
        logging.error(e)
        return {'message': 'Failed to get dives', 'status': 500}, 500


def edit_dive(data):  # sourcery skip: extract-method

    try:
        if 'id' not in data:
            raise MissingDiveId()

        dive_id = data['id']
        dive = Dive.query.filter(Dive.id == dive_id).first()

        if dive is None:
            raise DiveNotFound()

        attribute_mapping = {
            'date': 'date',
            'diveNumber': 'dive_number',
            'boat': 'boat',
            'diveGuide': 'dive_guide',
            'diveSite': 'dive_site',
            'maxDepth': 'max_depth',
            'waterTemperature': 'water_temperature'
        }

        attributes_to_update = {
            attr_name: data[json_key]
            for json_key, attr_name in attribute_mapping.items()
            if json_key in data
        }
        dive.update(**attributes_to_update)

        return {'message': 'Dive updated successfully', 'status': 200}, 200

    except MissingDiveId as e:
        return {'message': str(e), 'status': 400}, 400

    except DiveNotFound as e:
        _log_and_rollback(e)
        return {'message': str(e), 'status': 404}, 404

    except DiveIntegrityError as e:
        _log_and_rollback(e)
        return {'message': str(e), 'status': 409}, 409

    except DiveInfoMissingError as e:
        _log_and_rollback(e)
        return {'message': str(e), 'status': 400}, 400

    except Exception as e:
        _log_and_rollback(e)
        return {'message': 'Failed to update dive', 'status': 500}, 500


def get_count_for_pages(data):
    try:
        sort_method = data.get('sortMethod')
        key = data.get('key')

        if sort_method is None or key is None:
            raise MissingSortMethodOrKeyError()

        if sort_method == 'diveGuide':
            try:
                count = Dive.query.filter(Dive.dive_guide == key).count()
                return {'count': count, 'status': 200}, 200
            except Exception as e:
                _log_and_rollback(e)
                return {'message': 'Failed to get count', 'status': 500}, 500

        elif sort_method == 'dateRange':
            try:
                start_date = parse(key['startDate']).date()
                end_date = parse(key['endDate']).date()
                count = Dive.query.filter(
                    Dive.date.between(start_date, end_date)).count()
                return {'count': count, 'status': 200}, 200
            except ValueError as e:
                raise InvalidDateFormatError() from e
            except Exception as e:
                _log_and_rollback(e)
                return {'message': 'Failed to get count', 'status': 500}, 500

        else:
            raise InvalidSortMethodError()

    except MissingSortMethodOrKeyError as e:
        return {'message': str(e), 'status': 400}, 400

    except InvalidDateFormatError as e:
        return {'message': str(e), 'status': 400}, 400

    except Exception as e:
        logging.error(e)
        return {'message': 'Failed to get count', 'status': 500}, 500

def delete_dive_logic(data):  # sourcery skip: extract-method
    try:
        if 'diveId' not in data:
            raise MissingDiveId()

        dive_id = data['diveId']
        dive = Dive.query.filter(Dive.id == dive_id).first()

        if dive is None:
            raise DiveNotFound()

        dive.delete()
        return {'message': 'Dive deleted successfully', 'status': 200}, 200

    except MissingDiveId as e:
        return {'message': str(e), 'status': 400}, 400

    except DiveNotFound as e:
        _log_and_rollback(e)
        return {'message': str(e), 'status': 404}, 404

    except Exception as e:
        _log_and_rollback(e)
        return {'message': 'Failed to delete dive', 'status': 500}, 500
    
def get_sightings_for_dive(data):
    try:
        if 'diveId' not in data:
            raise MissingDiveId()
        
        dive_id = data['diveId']
        sightings = Sightings.query.filter(Sightings.dive_id == dive_id).all()
        sightings_list = [sighting.to_dict() for sighting in sightings]
        return {"sightings": sightings_list, 'status': 200}, 200
        
    except MissingDiveId as e:
        return {'message': str(e),'status': 400}, 400
    
def get_unique_dive_guides():
    try: 
        unique_dive_guides = Dive.query.with_entities(Dive.dive_guide).distinct().all()
        unique_dive_guides_list = [unique_dive_guide[0] for unique_dive_guide in unique_dive_guides]
        return {"diveGuides": unique_dive_guides_list,'status': 200}, 200
        
    except Exception as e:
        logging.error(e)
        return {'message': 'Failed to get dive guides','status': 500}, 500

from models.dives import Dive
from models.sightings import Sightings
from extensions import db
import logging
from errors import DiveIntegrityError, DiveInfoMissingError

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

def create_dive(data):
    try:
        dive=_create_dive_instance(data)
        
        db.session.add(dive)
        db.session.commit()

        dive_id = dive.id
        
        return {'message':'Dive created successfully', 'diveId':dive_id, 'status':201}, 201
        
    except DiveIntegrityError as e:
        _log_and_rollback(e)
        return {'status': 409, 'message': 'Dive already exists'}, 409
    
    except DiveInfoMissingError as e:
        _log_and_rollback(e)
        return {'status': 400, 'message': 'Dive information is incomplete'}, 400

    except Exception as e:
        _log_and_rollback
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
                return {'message':'Dive not found', 'status':404}, 404
            
            # Create a sightings instance for every species with a count
            if species is not None and count is not None and count !=0:
                sighting_instance = Sightings(
                    species=species, count=count, dive_id=dive_id)
                sightings_to_save.append(sighting_instance)
            
        if sightings_to_save:
            db.session.add_all(sightings_to_save)
            db.session.commit()
            
        return {'message':'Sightings created successfully', 'status':201}, 201
    
    except Exception as e:
        _log_and_rollback
        return {'message':'Failed to create sightings', 'status':400}, 400
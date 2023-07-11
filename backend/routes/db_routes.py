import logging

from app import db
from errors import DiveIntegrityError
from flask import Blueprint, jsonify, request
from models.dives import Dive
from services.dive_service import (create_dive, create_sighting,
                                   get_dives_by_date_range, get_dives_by_guide,
                                   test_database_connection)

db_bp = Blueprint('db_bp', __name__, url_prefix='/db')


@db_bp.route('/test', methods=['GET'])
def test_database_connection():
    result, status = test_database_connection()
    return jsonify(result), status


@db_bp.route('/dives/entries', methods=['POST'])
def create_dive_route():
    data = request.json
    result, status = create_dive(data)
    return jsonify(result), status


@db_bp.route("/sightings/entries", methods=["POST"])
def create_sighting_route():
    data = request.json.get('sightings', [])
    result, status = create_sighting(data)
    return jsonify(result), status


@db_bp.route('/dives/bydate', methods=['GET'])
def get_dives_by_date_range_route():
    data = request.json
    return get_dives_by_date_range(data)


@db_bp.route('/dives/byguide', methods=['GET'])
def get_dives_by_guide_route():
    data = request.args
    response, status = get_dives_by_guide(data)
    return jsonify(response), status


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
        try:
            attribute_mapping = {
                'date': 'date',
                'diveNumber': 'dive_number',
                'boatName': 'boat',
                'diveGuide': 'dive_guide',
                'diveSite': 'dive_site',
                'maxDepth': 'max_depth',
                'waterTemperature': 'water_temperature'
            }

            for json_key, attr_name in attribute_mapping.items():
                if json_key in data:
                    setattr(dive, attr_name, data[json_key])

            dive.update()
        except DiveIntegrityError:
            return jsonify({'status': 409, 'message': 'Duplicate dive detected'}), 409

        return jsonify({'message': 'Dive edited successfully', 'status': 200}), 200

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
        count = Dive.query.filter(
            Dive.date.between(start_date, end_date)).count()
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

        dive.delete()
        return jsonify({'message': 'Dive deleted successfully', 'status': 200}), 200

    except Exception as e:
        logging.error(e)
        db.session.rollback()
        return jsonify({'status': 500, 'message': 'Failed to delete dive'}), 500


def register_routes(app):
    app.register_blueprint(db_bp)

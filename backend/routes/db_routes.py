import logging

from app import db
from flask import Blueprint, jsonify, request
from models.dives import Dive
from services.dive_service import (create_dive, create_sighting, edit_dive, get_count_for_pages,
                                   get_dives_by_date_range, get_dives_by_guide,
                                   verify_database_connection, delete_dive)

db_bp = Blueprint('db_bp', __name__, url_prefix='/db')


@db_bp.route('/test', methods=['GET'])
def database_connection_verification():
    result, status = verify_database_connection()
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


@db_bp.route('/dives/by_date', methods=['GET'])
def get_dives_by_date_range_route():
    data = request.json
    return get_dives_by_date_range(data)


@db_bp.route('/dives/by_guide', methods=['GET'])
def get_dives_by_guide_route():
    data = request.args
    response, status = get_dives_by_guide(data)
    return jsonify(response), status


@db_bp.route('/dives/edit_dive', methods=['PUT'])
def edit_dive_route():
    data = request.json
    response, status = edit_dive(data)
    return jsonify(response), status


@db_bp.route('/dives/pages', methods=['GET'])
def get_count_for_pages_route():
    data = request.args
    response, status = get_count_for_pages(data)
    return jsonify(response), status

@db_bp.route('/dives/delete_dive', methods=['DELETE'])
def delete_dive():
    data = request.args
    response, status = delete_dive(data)
    return jsonify(response), status

def register_routes(app):
    app.register_blueprint(db_bp)

import logging
import os

from app import db
from flask import Blueprint, after_this_request, jsonify, request, send_file
from models.dives import Dive
from services.dive_service import (create_dive, create_sighting,
                                   delete_dive_logic, edit_dive,
                                   get_count_for_pages,
                                   get_dives_by_date_range, get_dives_by_guide,
                                   get_sightings_for_dive,
                                   get_unique_dive_guides,
                                   verify_database_connection,
                                   get_filtered_dives, update_sightings_for_dive)
from services.divelog_service import (generate_divelog_pdf)

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
    start_date = request.args.get('startDate')
    end_date = request.args.get('endDate')
    data = {'startDate': start_date, 'endDate': end_date}        
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
    response, status = delete_dive_logic(data)
    return jsonify(response), status


@db_bp.route('/sightings/for_dive', methods=['GET'])
def get_sightings_for_dive_route():
    data = request.args
    response, status = get_sightings_for_dive(data)
    return jsonify(response), status


@db_bp.route('/dives/get_dive_guides', methods=['GET'])
def get_unique_dive_guides_route():
    response, status = get_unique_dive_guides()
    return jsonify(response), status


@db_bp.route('/dives/get_filtered_dives', methods=['GET'])
def get_filtered_dives_route():
    data = request.args
    response, status = get_filtered_dives(data)
    return jsonify(response), status


@db_bp.route('/sightings/update_sightings', methods=['PUT'])
def update_sightings_route():
    data = request.json
    response, status = update_sightings_for_dive(data)
    return jsonify(response), status

@db_bp.route('/generate_divelog_pdf', methods=['POST'])
def generate_divelog_pdf_route():
    data = request.json
    try:
        pdf_file_path, status_code = generate_divelog_pdf(data)

        @after_this_request
        def cleanup(response):
            try:
                os.remove(pdf_file_path)
            except Exception as error:
                # You might want to log this error
                logging.exception(error)
            return response
        
        # Set the attachment filename (you may want to generate a unique name based on input or timestamp)
        attachment_filename = 'divelog.pdf'

        return send_file(
            pdf_file_path, 
            as_attachment=True, 
            attachment_filename=attachment_filename
        ), status_code

    except Exception as e:
        return jsonify({'error': str(e)}), 500


def register_routes(app):
    app.register_blueprint(db_bp)

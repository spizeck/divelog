from weasyprint import HTML
from flask import render_template
import os
import tempfile
from extensions import db
from models.dives import Dive
from models.sightings import Sightings

def generate_divelog_pdf(data):
    dive_ids = data.get('dive_ids', [])
    if not dive_ids:
        return {'error': 'No dive_ids provided'}, 400

    # Get all the dives with the provided dive IDs
    dives = Dive.query.filter(Dive.id.in_(dive_ids)).all()
    if not dives:
        return {'error': 'No dives found'}, 400
    
    # Get all sightings for the dives
    sightings_data = Sightings.query.filter(Sightings.dive_id.in_(dive_ids)).all()
    sightings_by_dive_id = {s.dive_id: s.serialize() for s in sightings_data}

    # Prepare the dive data including the sightings for each dive
    dive_data = []
    for dive in dives:
        serialized_dive = dive.serialize()
        serialized_dive['sightings'] = sightings_by_dive_id.get(dive.id, [])
        dive_data.append(serialized_dive)
    
    # Render the HTML template with dive data and sightings
    html_content = render_template('divelog_template.html', dives=dive_data)
    
    # Convert the HTML content to a PDF
    pdf = HTML(string=html_content).write_pdf()
    
    # Save the PDF to a temporary file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    temp_file_path = temp_file.name
    temp_file.write(pdf)
    temp_file.close()

    # Return the path to the temporary PDF file
    return temp_file_path, 200

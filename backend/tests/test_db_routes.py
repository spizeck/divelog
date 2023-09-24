import json
import unittest
from app import create_app, db
from config import TestingConfig


class TestRoutes(unittest.TestCase):
    def setUp(self):
        self.app = create_app(config_class=TestingConfig)
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_create_dive_and_sighting(self):  # sourcery skip: class-extract-method
        # This is your JSON data you will send in your POST request.
        dive_data = {
            "date": "2023-07-10",
            "diveNumber": "123",
            "boatName": "BoatName",
            "diveGuide": "GuideName",
            "diveSite": "SiteName",
            "maxDepth": "30",
            "waterTemperature": "25"
        }

        # Make a POST request to the /db/dives/entries route
        dive_response = self.client.post(
            '/db/dives/entries', data=json.dumps(dive_data), content_type='application/json')

        # Check the response data (using JSON)
        data = json.loads(dive_response.get_data(as_text=True))

        # Check the status code and the response
        self.assertEqual(dive_response.status_code, 201)
        self.assertEqual(data['status'], 201)
        self.assertEqual(data['message'], 'Dive created successfully')
    
        dive_id = data['diveId']
        self.assertEqual(dive_id, 1)

        sighting_data = {
            'sightings': [
                {
                    "species": "Fish",
                    "count": "1",
                    "dive_id": dive_id
                },
                {
                    "species": "Turtles",
                    "count": "4",
                    "dive_id": dive_id
                }
            ]
        }

        # Make a POST request to the /db/sightings/entries route
        sighting_response = self.client.post(
            '/db/sightings/entries', data=json.dumps(sighting_data), content_type='application/json')

        # Check the response data (using JSON)
        data = json.loads(sighting_response.get_data(as_text=True))

        # Check the status code and the response
        self.assertEqual(sighting_response.status_code, 201)
        self.assertEqual(data['status'], 201)
        self.assertEqual(data['message'], 'Sightings created successfully')


if __name__ == '__main__':
    unittest.main()

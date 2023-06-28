import unittest
from datetime import date

from app import create_app, db
from config import TestingConfig
from models.dives import Dive, DiveIntegrityError


class DivesModelTestCase(unittest.TestCase):
    def setUp(self):
        # Set up any test-specific data or configurations
        self.app = create_app(config_class=TestingConfig)
        self.app_context = self.app.app_context()
        self.app_context.push()
        self.client = self.app.test_client()

        # Create all database tables if they do not already exist
        with self.app.app_context():
            db.create_all()

    def tearDown(self):
         # Clean up after each test
        with self.app.app_context():
            db.session.query(Dive).delete()
            db.session.commit()
            
        # Remove the session
        db.session.remove()

    def test_save_dive(self):
        # Create a new Dive instance
        dive = Dive(
            date=date.today(),
            dive_number=1,
            boat='Boat 1',
            dive_guide='John Doe',
            dive_site='Site 1',
            max_depth=30,
            water_temperature=25
        )

        # Save the dive to the database
        dive.save()

        # Query the dive from the database
        saved_dive = Dive.query.filter_by(dive_number=1).first()

        # Assert that the saved dive is not None
        self.assertIsNotNone(saved_dive)

        # Assert that the saved dive attributes match the original values
        self.assertEqual(saved_dive.date, date.today())
        self.assertEqual(saved_dive.dive_number, 1)
        self.assertEqual(saved_dive.boat, 'Boat 1')
        self.assertEqual(saved_dive.dive_guide, 'John Doe')
        self.assertEqual(saved_dive.dive_site, 'Site 1')
        self.assertEqual(saved_dive.max_depth, 30)
        self.assertEqual(saved_dive.water_temperature, 25)

    def test_duplicate_dive(self):
        # Create and save a dive with the same attributes
        dive1 = Dive(
            date=date.today(),
            dive_number=1,
            boat='Boat 1',
            dive_guide='John Doe',
            dive_site='Site 1',
            max_depth=30,
            water_temperature=25
        )
        dive1.save()

        # Create a new dive with the same attributes
        dive2 = Dive(
            date=date.today(),
            dive_number=1,
            boat='Boat 1',
            dive_guide='John Doe',
            dive_site='Site 1',
            max_depth=30,
            water_temperature=25
        )

        # Assert that saving the duplicate dive raises an IntegrityError
        with self.assertRaises(DiveIntegrityError):
            dive2.save()

    # Add more test cases as needed


if __name__ == '__main__':
    unittest.main()

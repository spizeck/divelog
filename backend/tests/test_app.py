import unittest
from datetime import date

from app import create_app
from config import app_config
from extensions import db
from models.dives import Dive
from sqlalchemy.exc import IntegrityError


class DivesModelTestCase(unittest.TestCase):
    def setUp(self):
        # Set up any test-specific data or configurations
        self.app = create_app()
        self.app.config.from_object(app_config)
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.init_app(self.app)
        db.create_all()

    def tearDown(self):
        # Clean up after each test
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_save_dive(self):
        # Create a new Dive instance
        dive = Dive(
            date=date.today(),
            dive_number='123',
            boat='Boat 1',
            dive_guide='John Doe',
            dive_site='Site 1'
        )

        # Save the dive to the database
        dive.save()

        # Query the dive from the database
        saved_dive = Dive.query.get(dive.id)

        # Assert that the saved dive is not None
        self.assertIsNotNone(saved_dive)

        # Assert that the saved dive attributes match the original values
        self.assertEqual(saved_dive.date, date.today())
        self.assertEqual(saved_dive.dive_number, '123')
        self.assertEqual(saved_dive.boat, 'Boat 1')
        self.assertEqual(saved_dive.dive_guide, 'John Doe')
        self.assertEqual(saved_dive.dive_site, 'Site 1')

    def test_duplicate_dive(self):
        # Create and save a dive with the same attributes
        dive1 = Dive(
            date=date.today(),
            dive_number='123',
            boat='Boat 1',
            dive_guide='John Doe',
            dive_site='Site 1'
        )
        dive1.save()

        # Create a new dive with the same attributes
        dive2 = Dive(
            date=date.today(),
            dive_number='123',
            boat='Boat 1',
            dive_guide='John Doe',
            dive_site='Site 1'
        )

        # Assert that saving the duplicate dive raises an IntegrityError
        with self.assertRaises(IntegrityError):
            dive2.save()

    # Add more test cases as needed


if __name__ == '__main__':
    unittest.main()

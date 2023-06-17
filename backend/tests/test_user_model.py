import unittest
from datetime import datetime

from app import create_app, db
from models.users import User

class UserModelTestCase(unittest.TestCase):
    def setUp(self):
        # Set up any test-specific data or configurations
        self.app = create_app()
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        # Clean up after each test
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_save_user(self):
        # Create a new User instance
        user = User(
            username='testuser',
            email='test@example.com',
            password='password',
            is_approved=True,
            admin=False
        )

        # Save the user to the database
        user.save()

        # Query the user from the database
        saved_user = User.query.filter_by(username='testuser').first()

        # Assert that the saved user is not None
        self.assertIsNotNone(saved_user)

        # Assert that the saved user attributes match the original values
        self.assertEqual(saved_user.username, 'testuser')
        self.assertEqual(saved_user.email, 'test@example.com')
        self.assertEqual(saved_user.password, 'password')
        self.assertTrue(saved_user.is_approved)
        self.assertFalse(saved_user.admin)

    # Add more test cases as needed

if __name__ == '__main__':
    unittest.main()
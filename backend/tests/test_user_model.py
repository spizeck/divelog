import unittest
from config import TestingConfig
from app import create_app, db
from models.users import User


class UserModelTestCase(unittest.TestCase):
    def setUp(self):
        # Set up any test-specific data or configurations
        self.app = create_app(config_class=TestingConfig)
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
        self.assertTrue(saved_user.verify_password('password'))
        self.assertTrue(saved_user.is_approved)
        self.assertFalse(saved_user.admin)

    def test_validate_email_format(self):
        # Test valid and invalid email formats
        email = 'test@example.com'
        self.assertTrue(User.validate_email_format(email))
        email = 'testexample.com'
        self.assertFalse(User.validate_email_format(email))

    def test_validate_password_strength(self):
        # Test valid and invalid password strengths
        password = 'Password1'
        self.assertTrue(User.validate_password_strength(password))
        password = 'password'
        self.assertFalse(User.validate_password_strength(password))

    def test_validate_username(self):
        # Test valid and invalid usernames
        username = 'testuser'
        self.assertTrue(User.validate_username(username))
        username = 'testuser!'
        self.assertFalse(User.validate_username(username))

    
if __name__ == '__main__':
    unittest.main()

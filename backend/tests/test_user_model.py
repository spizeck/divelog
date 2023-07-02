import unittest
from config import TestingConfig
from app import create_app, db
from models.users import User
from models.user_preferences import UserPreferences


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

    def test_validate_email_availability(self):
        # Test valididate email availability
        user = User(
            username='testuser',
            email='test@example.com',
            password='password',
            is_approved=True,
            admin=False
        )
        user.save()

        email = 'test@example.com'
        self.assertFalse(User.validate_email_availability(email))
        email = 'test1@example.com'
        self.assertTrue(User.validate_email_availability(email))

    def test_validate_username_availability(self):
        # Test valididate username availability
        user = User(
            username='testuser',
            email='test@example.com',
            password='password',
            is_approved=True,
            admin=False
        )
        user.save()
        uesrnmae = 'testuser'
        self.assertFalse(User.validate_username_availability(uesrnmae))
        username = 'testuser1'
        self.assertTrue(User.validate_username_availability(username))


    def test_update_user(self):
        # Create a new User instance
        user = User(
            username='testuser',
            email='test@example.com',
            password='password',
            is_approved=True,
            admin=False
        )
        user.save()

        # Update the user's attributes
        user.update(username='newusername', email='newemail@example.com')

        # Query the user from the database
        updated_user = User.query.filter_by(username='newusername').first()

        # Assert that the user's attributes have been updated
        self.assertEqual(updated_user.username, 'newusername')
        self.assertEqual(updated_user.email, 'newemail@example.com')


    def test_change_password(self):
        # Create a new User instance
        user = User(
            username='testuser',
            email='test@example.com',
            password='password',
            is_approved=True,
            admin=False
        )
        user.save()

        # Change the user's password
        user.update('password', 'newpassword')

        # Assert that the new password is verified correctly
        self.assertTrue(user.verify_password('newpassword'))
        self.assertFalse(user.verify_password('password'))


    def test_get_preferred_units(self):
        # Create a new User instance with preferred units set to 'metric'
        user = User(
            username='testuser',
            email='test@example.com',
            password='password',
            is_approved=True,
            admin=False,
        )
        user_preferences = UserPreferences(user_id=user.id, preferred_units='metric')
        user.user_preferences = user_preferences
        db.session.add(user)
        db.session.commit()

        # Get the user's preferred units
        preferred_units = user.get_preferred_units()

        # Assert that the preferred units are correct
        self.assertEqual(preferred_units, 'metric')


if __name__ == '__main__':
    unittest.main()

import unittest
from config import TestingConfig
from app import create_app, db
from models.users import User
from models.user_preferences import UserPreferences
from services.user_service import (create_user,
                                   get_user_by_id,
                                   get_user_by_username,
                                   get_user_by_email,
                                   change_password,
                                   delete_user,
                                   get_all_users,
                                   update_username,
                                   update_email,
                                   get_user_preferences
                                   )


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
        user = create_user(
            username='testuser',
            email='test@example.com',
            password='password',
            is_approved=True,
            admin=False,
            first_name='Test'
        )

        # Query the user from the database
        saved_user = get_user_by_username('testuser')

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
        user = create_user(
            username='testuser',
            email='test@example.com',
            password='password',
            is_approved=True,
            admin=False
        )

        email = 'test@example.com'
        self.assertFalse(User.validate_email_availability(email))
        email = 'test1@example.com'
        self.assertTrue(User.validate_email_availability(email))

    def test_validate_username_availability(self):
        # Test valididate username availability
        user = create_user(
            username='testuser',
            email='test@example.com',
            password='password',
            is_approved=True,
            admin=False
        )
        username = 'testuser'
        self.assertFalse(User.validate_username_availability(username))
        username = 'testuser1'
        self.assertTrue(User.validate_username_availability(username))

    def test_update_user(self):
        # Create a new User instance
        user = create_user(
            username='testuser',
            email='test@example.com',
            password='password',
            is_approved=True,
            admin=False
        )

        # Update the user's username
        update_username(user, 'newusername')

        # Update the user's email
        update_email(user, 'newemail@example.com')

        # Query the user from the database
        updated_user = get_user_by_id(user.id)

        # Assert that the user's attributes have been updated
        self.assertEqual(updated_user.username, 'newusername')
        self.assertEqual(updated_user.email, 'newemail@example.com')

    def test_change_password(self):
        # Create a new User instance
        user = create_user(
            username='testuser',
            email='test@example.com',
            password='password',
            is_approved=True,
            admin=False
        )

        # Change the user's password
        change_password(user, 'newPassword1!')

        # Assert that the new password is verified correctly
        self.assertTrue(user.verify_password('newPassword1!'))
        self.assertFalse(user.verify_password('password'))

    def get_user_preferences(self):
        # Create a new User instance
        user = create_user(
            username='testuser',
            email='test@example.com',
            password='password',
            is_approved=True,
            admin=False,
            first_name='Test',
            preferred_units='metric'
        )

        # Query the user's preferences from the database
        query = get_user_preferences(user.id)

        # Assert that the user's preferences have been retrieved
        self.assertEqual(query.first_name, 'Test')
        self.assertEqual(query.preferred_units, 'metric')

    def test_delete_user(self):
        # Create a new User instance
        user = create_user(username='testuser',
                           email='test@example.com',
                           password='password',
                           is_approved=True,
                           admin=False,
                           )

        # Retrieve the user from the database
        query = get_user_by_id(user.id)
        assert query is not None

        # Delete the user
        delete_user(query)

        # Retrieve the user from the database
        query2 = get_user_by_email('test@example.com')
        assert query2 is None

    def test_get_all_users(self):
        # Create a new User instance
        user1 = create_user(
            username='testuser1',
            email='test1@example.com',
            password='password',
            is_approved=True,
            admin=False
        )
        user2 = create_user(
            username='testuser2',
            email='test2@example.com',
            password='password',
            is_approved=True,
            admin=False
        )

        users = get_all_users()

        # Assert that the users have been retrieved
        assert user1 in users
        assert user2 in users
        assert len(users) == 2


if __name__ == '__main__':
    unittest.main()

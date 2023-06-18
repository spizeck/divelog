import unittest

from app import create_app, db
from config import TestingConfig
from services.user_service import create_user


class AdminRoutesTestCase(unittest.TestCase):
    def setUp(self):
        # Set up any test-specific data or configurations
        self.app = create_app(config_class=TestingConfig)
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        # Clean up after each test
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_get_users(self):
        # Create some test users
        user1 = create_user(
            username='testuser1',
            email='user1@example.com',
            password='Password1!'
        )
        user2 = create_user(
            username='testuser2',
            email='user2@example.com',
            password='Password1!'
        )

        # Make a request to the test client to retrieve the users
        response = self.client.get('admin/users')
        data = response.get_json()
        users = data['users']

        # Assert that the response is successful
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(users), 2)
        self.assertEqual(users[0]['username'], 'testuser1')
        self.assertEqual(users[1]['username'], 'testuser2')

    def test_approve_user(self):
        # Create a test user
        user = create_user(
            username='testuser',
            email='testuser@example.com',
            password='Password1!'
        )

        # Make a PUT request to the test client to approve the user
        response = self.client.put(f'admin/users/{user.id}/approve')

        # Assert that the response is successful
        self.assertEqual(response.status_code, 200)
        self.assertEqual(user.is_approved, True)

    def test_disapprove_user(self):
        # Create a test user
        user = create_user(
            username='testuser',
            email='testuser@example.com',
            password='Password1!'
        )

        # Make a PUT request to the test client to disapprove the user
        response = self.client.put(f'admin/users/{user.id}/disapprove')

        # Assert that the response is successful
        self.assertEqual(response.status_code, 200)
        self.assertEqual(user.is_approved, False)

    def test_promote_user(self):
        # Create a test user
        user = create_user(
            username='testuser',
            email='testuser@example.com',
            password='Password1!'
        )

        # Make a PUT request to the test client to promote the user
        response = self.client.put(f'admin/users/{user.id}/promote')

        # Assert that the response is successful
        self.assertEqual(response.status_code, 200)
        self.assertEqual(user.admin, True)

    def test_demote_user(self):
        # Create a test user
        user = create_user(
            username='testuser',
            email='testuser@example.com',
            password='Password1!'
        )

        # Make a PUT request to the test client to demote the user
        response = self.client.put(f'admin/users/{user.id}/demote')

        # Assert that the response is successful
        self.assertEqual(response.status_code, 200)
        self.assertEqual(user.admin, False)

    def test_delete_user(self):
        # Create a test user
        user = create_user(
            username='testuser',
            email='testuser@example.com',
            password='Password1!'
        )

        # Make a DELETE request to the test client to delete the user
        response = self.client.delete(f'admin/users/{user.id}/delete')

        # Assert that the response is successful
        self.assertEqual(response.status_code, 200)
        self.assertEqual(user in db.session, False)

    if __name__ == '__main__':
        unittest.main()

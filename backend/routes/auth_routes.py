import logging

from extensions import db
from flask import Blueprint, jsonify, request, session
from flask_jwt_extended import (create_access_token, get_jwt_identity,
                                jwt_required)
from models.user_preferences import UserPreferences
from models.users import User
from services.user_service import (create_user, get_user_by_email,
                                   get_user_by_id, get_user_by_username,
                                   update_username, update_email, change_password)


auth_bp = Blueprint('auth_bp', __name__, url_prefix='/auth')


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username'] if 'username' in data else None
    email = data['email'] if 'email' in data else None
    password = data['password']

    try:
        user = get_user_by_username(
            username) if username else get_user_by_email(email)
    except Exception as e:
        logging.error(
            f'Error retrieving user {username} from the database: {e}')
        return jsonify({'status': 500, 'message': 'Database connection error'}), 500

    if user is None or not user.verify_password(password):
        logging.info(f'User {username} failed to log in')
        return jsonify({'status': 401, 'message': 'Invalid credentials'}), 401

    # If the user exists, generate an access token for them
    token = create_access_token(identity=user.id)

    # Save the token to the session
    session['token'] = token

    return jsonify({'status': 200, 'message': 'Login successful', 'token': token, 'username': username}), 200


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    email = data['email']
    password = data['password']
    first_name = data['firstName'] if 'firstName' in data else None
    preferred_units = data['preferredUnits'] if 'preferredUnits' in data else None

    # Validate email format
    if not User.validate_email_format(email):
        return jsonify({'status': 400, 'message': 'Invalid email format'}), 400

    # Validate username
    if not User.validate_username(username):
        return jsonify({'status': 400, 'message': 'Invalid username'}), 400

    # Check if the username is already taken
    if not User.validate_username_availability(username):
        return jsonify({'status': 409, 'message': 'Username already exists'}), 409

    # Check if the email is already taken
    if not User.validate_email_availability(email):
        return jsonify({'status': 409, 'message': 'Email already exists'}), 409

    # Validate password strength
    if not User.validate_password_strength(password):
        return jsonify({'status': 400,
                        'message': 'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, and one digit'
                        }), 400

    # If the user doesn't exist, create a new user
    try:
        user = create_user(username=username, email=email, password=password,
                       first_name=first_name, preferred_units=preferred_units)

    except Exception as e:
        logging.error(f'Error saving user {username} to the database: {e}')
        return jsonify({'status': 500, 'message': 'Database Connection Error'}), 500

    return jsonify({'status': 201, 'message': 'User created successfully'}), 201


@auth_bp.route('/logout', methods=['POST'])
def logout():
    # Invalidate the token
    session.pop('token', None)
    # Clear the session
    session.clear()

    return jsonify({'status': 200, 'message': 'Logout successful'}), 200


@auth_bp.route('/forgot_password', methods=['POST'])
def forgot_password():
    data = request.json
    email = data['email']

    # check if the user exists
    user = get_user_by_email(email)
    if not user:
        return jsonify({'status': 404, 'message': 'Email not found'}), 404

    # Generate a new password for the user
    try:
        change_password(user, 'password123')
    except Exception as e:
        logging.error(f'Error saving new password to the database: {e}')
        return jsonify({'status': 500, 'message': 'Database connection error'}), 500

    # Send the new password to the user's email
    # TODO: Implement email sending
    # TODO: Replace with a link to reset password
    return jsonify({'status': 200, 'message': 'New password is password123 -- Please change ASAP'}), 200


@auth_bp.route('/current_user', methods=['GET'])
@jwt_required()
def get_current_user():
    # Get the user's id from the token
    current_identity = get_jwt_identity()

    if not (user := get_user_by_id(current_identity)):
        logging.info(f'User {current_identity} not found')
        return jsonify({'status': 404, 'message': 'User not found'}), 404

    # Return the user's information
    username = user.username if hasattr(user, 'username') else None
    email = user.email if hasattr(user, 'email') else None
    is_approved = user.is_approved if hasattr(user, 'is_approved') else None
    admin = user.admin if hasattr(user, 'admin') else None
    first_name = user.first_name if hasattr(user, 'first_name') else None
    preferred_units = user.preferred_units if hasattr(user, 'preferred_units') else None

    return jsonify({
        'status': 200,
        'message': 'User found',
        'approved': is_approved,
        'admin': admin,
        'username': username,
        'email': email,
        'firstName': first_name,
        'preferredUnits': preferred_units
    }), 200


@auth_bp.route('/update_user', methods=['PUT'])
@jwt_required()
def update_user():
    current_identity = get_jwt_identity()

    if not (user := get_user_by_id(current_identity)):
        return jsonify({'status': 404, 'message': 'User not found'}), 404

    data = request.json
    allowed_keys = ['newUsername', 'newEmail', 'newPassword']
    data_to_update = {k: v for k, v in data.items() if k in allowed_keys}

    if 'newUsername' in data_to_update:
        try:
            update_username(user, data_to_update['newUsername'])
            return jsonify({'status': 200, 'message': 'Username updated successfully'}), 200
        except Exception as e:
            logging.error(
                f'Error updating username for user {user.username}: {e}')
            return jsonify({'status': 409, 'message': 'Username already exists'}), 409

    if 'newEmail' in data_to_update:
        try:
            update_email(user, data_to_update['newEmail'])
            return jsonify({'status': 200, 'message': 'Email updated successfully'}), 200
        except Exception as e:
            logging.error(
                f'Error updating email for user {user.username}: {e}')
            return jsonify({'status': 409, 'message': 'Email already exists'}), 409

    if 'newPassword' in data_to_update:
        try:
            change_password(user, data_to_update['newPassword'])
            return jsonify({'status': 200, 'message': 'Password updated successfully'}), 200
        except Exception as e:
            logging.error(
                f'Error updating password for user {user.username}: {e}')
            return jsonify({'status': 400,
                            'message': 'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, and one digit'
                            }), 400

    if not data_to_update:
        return jsonify({'status': 400, 'message': 'No data to update'}), 400

    return jsonify({'status': 200, 'message': 'User updated successfully'}), 200


@auth_bp.route('/preferences', methods=['GET', 'PUT'])
@jwt_required()
def user_preferences():
    # Get the user's id from the token
    current_identity = get_jwt_identity()

    if not (user := get_user_by_id(current_identity)):
        return jsonify({'status': 404, 'message': 'User not found'}), 404

    if request.method == 'GET':
        # Get the user's current preferences
        preferred_units = user.user_preferences.get_user_preferences()
        return jsonify({'status': 200, 'preferredUnits': preferred_units}), 200

    if request.method == 'PUT':
        data = request.json
        new_preferred_units = data.get('newPreferredUnits')

        if not new_preferred_units:
            return jsonify({'status': 400, 'message': 'Preferred units not provided'}), 400

        # Update the user's preferences
        user.user_preferences.update(preferred_units=new_preferred_units)
        return jsonify({'status': 200, 'message': 'User preferences updated'}), 200


def register_routes(app):
    app.register_blueprint(auth_bp)
    app.add_url_rule('/auth/preferences',
                     view_func=user_preferences, methods=['GET', 'PUT'])

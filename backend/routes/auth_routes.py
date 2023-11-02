import logging

from extensions import db
from flask import Blueprint, jsonify, request, session
from flask_jwt_extended import (create_access_token, get_jwt_identity,
                                jwt_required)
from models.users import User
from services.user_service import (create_user, get_user_by_email,
                                   get_user_by_id, get_user_by_username,
                                   update_username, update_email, change_password, 
                                   change_user_preferences, send_reset_email, perform_reset_password)


auth_bp = Blueprint('auth_bp', __name__, url_prefix='/auth')


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username', None)
    email = data.get('email', None)
    password = data['password']

    user = None
    try:
        if username:
            user = get_user_by_username(username.lower().strip())
        elif email:
            user = get_user_by_email(email.strip())
    except Exception as e:
        logging.error(f'Error retrieving user: {e}')
        return jsonify({'status': 500, 'message': 'An error occurred while retrieving user information'}), 500

    if not user or not user.verify_password(password):
        logging.info('Failed login attempt')
        return jsonify({'status': 401, 'message': 'Invalid credentials'}), 401

    # If the user exists, generate an access token for them
    token = create_access_token(identity=user.id)

    return jsonify({'status': 200, 'message': 'Login successful', 'token': token}), 200


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
    email = data.get('email', None)

    if email is None:
        return jsonify({'status': 400, 'message': 'Email is required'}), 400

    # check if the user exists
    user = get_user_by_email(email)
    if not user:
        return jsonify({'status': 404, 'message': 'Email not found'}), 404

    try:
        email_sent = send_reset_email(email)
    except Exception as e:
        logging.error(f'Error sending email to {email}: {e}')
        return jsonify({'status': 500, 'message': 'Email sending error'}), 500

    if email_sent:
        return jsonify({'status': 200, 'message': 'Password reset email sent'}), 200
    else:
        return jsonify({'status': 500, 'message': 'Email sending error'}), 500

@auth_bp.route('/reset_password', methods=['POST'])
def reset_password():
    data = request.json
    token = data.get('token', None)
    new_password = data.get('newPassword', None)
    
    if token is None or new_password is None:
        return jsonify({'status': 400, 'message': 'Invalid request'}), 400
    success, message = perform_reset_password(token, new_password)

    if success:
        return jsonify({'status': 200,'message': message}), 200
    else:
        return jsonify({'status': 500,'message': message}), 500


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
    first_name = user.user_preferences.first_name if hasattr(
        user.user_preferences, 'first_name') else None
    preferred_units = user.user_preferences.preferred_units if hasattr(
        user.user_preferences, 'preferred_units') else None

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
    print("Data type:", type(data))
    print("Data content:", data)

    allowed_keys = ['newUsername', 'newEmail',
                    'newPassword', 'newFirstName', 'newPreferredUnits']
    data_to_update = {k: v for k, v in data.items() if k in allowed_keys}
    print('data_to_update: ', data_to_update)
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

    if 'newFirstName' in data_to_update or 'newPreferredUnits' in data_to_update:
        print('data_to_update: ', data_to_update)
        mapped_data_to_update = {}

        if 'newFirstName' in data_to_update and data_to_update['newFirstName']:
            mapped_data_to_update['first_name'] = data_to_update['newFirstName']

        if 'newPreferredUnits' in data_to_update and data_to_update['newPreferredUnits']:
            mapped_data_to_update['preferred_units'] = data_to_update['newPreferredUnits']

        if mapped_data_to_update:
            try:
                change_user_preferences(user, **mapped_data_to_update)
                return jsonify({'status': 200, 'message': 'User preferences updated successfully'}), 200
            except Exception as e:
                logging.error(
                    f'Error updating user preferences for user {user.username}: {e}'
                )
                return jsonify({'status': 400, 'message': 'Invalid input'}), 400
        else:
            return jsonify({'status': 400, 'message': 'No valid data to update'}), 400

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

    # Get the user's current preferences
    preferred_units = user.user_preferences.get_user_preferences()
    return jsonify({'status': 200, 'preferredUnits': preferred_units}), 200


def register_routes(app):
    app.register_blueprint(auth_bp)

from flask import Blueprint, jsonify, request, session
from services.user_service import create_user, get_user_by_username, get_user_by_email, get_user_by_id
from models.users import User
from extensions import db
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required


auth_bp = Blueprint('auth_bp', __name__, url_prefix='/auth')


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']
    # TODO: Add functionality to allow users to log in with their email address
    # Check if the user exists, wrapped in a try block in case of database error
    try:
        user = get_user_by_username(username)
    except Exception as e:
        return jsonify({'status': 500, 'message': str(e)}), 500

    if user is None or not user.verify_password(password):
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

    # Check if the user exists
    user = get_user_by_username(username)

    if user is not None:
        return jsonify({'status': 409, 'message': 'Username already exists'}), 409

    # If the user doesn't exist, create a new user
    user = create_user(username=username, email=email, password=password)

    # Save the user to the database
    try:
        db.session.add(user)
        db.session.commit()
    except Exception as e:
        return jsonify({'status': 500, 'message': str(e)}), 500

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
        return jsonify({'status': 404, 'message': 'User does not exist'}), 404

    # Generate a new password for the user
    new_password = 'Password123'

    user.password = new_password
    try:
        db.session.commit()
    except Exception as e:
        return jsonify({'status': 500, 'message': str(e)}), 500

    # Send the new password to the user's email
    # TODO: Implement email sending
    # TODO: Replace with a link to reset password
    return jsonify({'status': 200, 'message': 'New password has been sent'}), 200


@auth_bp.route('/current_user', methods=['GET'])
@jwt_required()
def get_current_user():
    # Get the user's id from the token
    current_identity = get_jwt_identity()

    if not (user := get_user_by_id(current_identity)):
        return jsonify({'status': 404, 'message': 'User not found'}), 404
    
    # Return the user's information
    username = user.username if hasattr(user, 'username') else None
    email = user.email if hasattr(user, 'email') else None
    is_approved = user.is_approved if hasattr(user, 'is_approved') else None
    admin = user.admin if hasattr(user, 'admin') else None
    preferred_units = user.user_preferences.preferred_units if hasattr(user, 'user_preferences') else None
    
    return jsonify({'status': 200, 'message': 'User found', 'is_approved': is_approved, 'admin': admin, 'username': username, 'email': email, 'preferred_units': preferred_units}), 200

@auth_bp.route('/update_user', methods=['PUT'])
@jwt_required
def update_user():
    current_identity = get_jwt_identity()
    
    if not (user := get_user_by_id(current_identity)):
        return jsonify({'status': 404, 'message': 'User not found'}), 404
    
    data = request.json
    username = data['username']
    email = data['email']
    new_password = data['new_password']
    old_password = data['old_password']
    
    if email and not User.validate_email_format(email):
        return jsonify({'status': 400, 'message': 'Invalid email format'}), 400
    
    if username and not User.validate_username(username):
        return jsonify({'status': 400, 'message': 'Invalid username'}), 400
    
    if new_password:
        if not User.validate_password_strength(new_password):
            return jsonify({'status': 400,
                            'message': 'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, and one digit'}), 400
        if not old_password or not user.check_password(old_password):
            return jsonify({'status': 400, 'message': 'Incorrect existing password'}), 400
    
    user.update(username=username, email=email, password=new_password)
    
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
        return jsonify({'status': 200, 'preferred_units': preferred_units}), 200

    if request.method == 'PUT':
        data = request.json
        preferred_units = data.get('preferred_units')

        if not preferred_units:
            return jsonify({'status': 400, 'message': 'Preferred units not provided'}), 400

        # Update the user's preferences
        user.user_preferences.update(preferred_units=preferred_units)
        return jsonify({'status': 200, 'message': 'User preferences updated'}), 200


def register_routes(app):
    app.register_blueprint(auth_bp)
    app.add_url_rule('/auth/preferences',
                     view_func=user_preferences, methods=['GET', 'PUT'])


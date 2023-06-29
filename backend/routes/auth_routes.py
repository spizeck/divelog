from flask import Blueprint, jsonify, request, session
from services.user_service import create_user, get_user_by_username, get_user_by_email
from models.users import User
from extensions import db

auth_bp = Blueprint('auth_bp', __name__, url_prefix='/auth')


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    # Check if the user exists
    user = get_user_by_username(username)

    if user is None or not user.check_password(password):
        return jsonify({'status':401, 'message': 'Invalid credentials'}), 401

    # If the user exists, generate an access token for them
    token = user.generate_access_token()
    return jsonify({'status':200, 'message':'Login successful', 'token':token}), 200


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    email = data['email']
    password = data['password']

    # Validate email format
    if not User.validate_email_format(email):
        return jsonify({'status':400, 'message':'Invalid email format'}), 400

    # Validate username
    if not User.validate_username(username):
        return jsonify({'status':400, 'message':'Invalid username'}), 400

    # Validate password strength
    if not User.validate_password_strength(password):
        return jsonify({'status':400, 'message':'Invalid password'}), 400

    # Check if the user exists
    user = get_user_by_username(username)

    if user is not None:
        return jsonify({'status':409, 'message':'Username already exists'}), 409

    # If the user doesn't exist, create a new user
    user = create_user(username=username, email=email, password=password)

    # Save the user to the database
    db.session.add(user)
    db.session.commit()

    return jsonify({'status':201, 'message':'User created successfully'}), 201


@auth_bp.route('/logout', methods=['POST'])
def logout():
    # Clear the session
    session.clear()

    return jsonify({'status':200, 'message':'Logout successful'}), 200


@auth_bp.route('/forgot_password', methods=['POST'])
def forgot_password():
    data = request.json
    email = data['email']

    # check if the user exists
    user = get_user_by_email(email)
    if not user:
        return jsonify({'status':404, 'message':'User does not exist'}), 404

    # Generate a new password for the user
    new_password = user.generate_password()

    user.password = new_password
    db.session.commit()

    # Send the new password to the user's email
    # TODO: Implement email sending
    return jsonify({'status':200, 'message':'New password sent to email'}), 200


def register_routes(app):
    app.register_blueprint(auth_bp)

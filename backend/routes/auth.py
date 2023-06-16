from flask import Blueprint, jsonify, request, session
from extensions import db
from models.users import User

auth_routes = Blueprint('auth_routes', __name__)

@auth_routes.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']
    
    # Check if the user exists
    user = User.query.filter_by(username=username).first()
    
    if user is None or not user.check_password(password):
        return jsonify(message='Invalid credentials'), 401
    
    # If the user exists, generate an access token for them
    token = user.generate_access_token()
    return jsonify(message='Login successful', token=token), 200

@auth_routes.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    password = data['password']
    
    # Check if the user exists
    user = User.query.filter_by(username=username).first()
    
    if user is not None:
        return jsonify(message='Username already exists'), 409
    
    # If the user doesn't exist, create a new user
    user = User(username=username)
    user.set_password(password)
    
    # Save the user to the database
    db.session.add(user)
    db.session.commit()
    
    return jsonify(message='User created successfully'), 201

@auth_routes.route('/logout', methods=['POST'])
def logout():
    # Clear the session
    session.clear()
    
    return jsonify(message='Logout successful'), 200

@auth_routes.route('/forgot_password', methods=['POST'])
def forgot_password():
    data = request.json
    email = data['email']
    
    # check if the user exists
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify(message='User does not exist'), 404
    
    # Generate a new password for the user
    new_password = user.generate_password()
    
    user.password = new_password
    db.session.commit()
    
    # Send the new password to the user's email
    # TODO: Implement email sending
    return jsonify(message='New password sent to email'), 200

def register_routes(app):
    app.register_blueprint(auth_routes)
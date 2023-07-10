from models.users import User
from models.user_preferences import UserPreferences
from extensions import db


def create_user(username, email, password, first_name=None, preferred_units='imperial', is_approved=False, admin=False): 
    # Create a new user
    user = User(
        username=username,
        email=email,
        password=password,
        is_approved=is_approved,
        admin=admin
    )
    
    db.session.add(user)
    
    # Create a new user preferences
    user_preferences = UserPreferences(
        user_id=user.id,
        first_name=first_name,
        preferred_units=preferred_units
    )
    
    db.session.add(user_preferences)
    
    db.session.commit()

    return user


def get_user_by_id(user_id):
    # Retrieve the user from the database
    return db.session.get(User, user_id)


def get_user_by_username(username):
    # Retrieve the user from the database
    return User.query.filter_by(username=username).first()


def get_user_by_email(email):
    # Retrieve the user from the database
    return User.query.filter_by(email=email).first()


def delete_user(user):
    # Delete the user from the database
    if user is None:
        return
    db.session.delete(user)
    db.session.commit()


def get_all_users():
    # Retrieve all users from the database
    return User.query.all()

def update_username(user, new_username):
    # Update the user's username
    if user is None:
        return
    if User.validate_username_availability(new_username):
        user.username = new_username
        db.session.commit()
    
def update_email(user, new_email):
    # Update the user's email
    if user is None:
        return
    if User.validate_email_availability(new_email) and User.validate_email_format(new_email):
        user.email = new_email
        db.session.commit()
    
def change_password(user, new_password):
    # Update the user's password
    if user is None:
        return
    if User.validate_password_strength(new_password):
        user.password = new_password
        db.session.commit()
    
def get_user_preferences(user):
    # Retrieve the user's preferences from the database
    if user is None:
        return
    return user.user_preferences.get_user_preferences()

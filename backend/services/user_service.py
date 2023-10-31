from models.users import User
from models.user_preferences import UserPreferences
from models.password_reset import PasswordResetTokens
from extensions import db, postmark_client
import secrets


def create_user(username, email, password, first_name=None, preferred_units='imperial', is_approved=False, admin=False): 
    # Create a new user
    user = User(
        username=username.lower(),
        email=email,
        password=password,
        is_approved=is_approved,
        admin=admin
    )
    
    # Create a new user preferences
    user_preferences = UserPreferences(
        user_id=user.id,
        first_name=first_name,
        preferred_units=preferred_units
    )

    user.user_preferences = user_preferences
    
    db.session.add(user)
    
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
    
def get_user_preferences(user_id):
    # Retrieve the user's preferences from the database
    user = get_user_by_id(user_id)
    return user.user_preferences if user and user.user_preferences else None

def change_user_preferences(user, **kwargs):
    # Update the user's preferences
    if user is None:
        return
    for key, value in kwargs.items():
        if hasattr(user.user_preferences, key):
            setattr(user.user_preferences, key, value)
    
    db.session.commit()

def generate_reset_token(email):
    token = secrets.token_hex(16)
    token_entry = PasswordResetTokens(email=email, reset_token=token)
    db.session.add(token_entry)
    db.session.commit()
    
def send_reset_email(email, reset_token):
    try:
        postmark_client.emails.send(
            From='divelog@seasaba.com',
            To=email,
            Subject='Reset your password',
            HtmlBody=f'<h1>Password Reset</h1><p>Please use the following token to reset your password: {reset_token}</p>'
        )
        return True
    except Exception as e:
        print(f'Error sending email: {e}')
        return False
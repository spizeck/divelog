from models.users import User
from models.user_preferences import UserPreferences
from models.password_reset import PasswordResetTokens
from extensions import db, postmark_client
from datetime import datetime, timezone
import secrets


def create_user(username, email, password, first_name=None, preferred_units='imperial', is_approved=False, admin=False):
    # Create a new user
    user = User(
        username=username.lower().strip(),
        email=email.strip(),
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
    return User.query.filter_by(username=username.strip()).first()


def get_user_by_email(email):
    # Retrieve the user from the database
    return User.query.filter_by(email=email.strip()).first()


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
    if User.validate_email_availability(new_email.strip()) and User.validate_email_format(new_email.strip()):
        user.email = new_email.strip()
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

def _delete_expired_reset_tokens():
    now = datetime.now(timezone.utc)
    expired_tokens = PasswordResetTokens.query.filter(PasswordResetTokens.expires_at < now).all()
    for token in expired_tokens:
        db.session.delete(token)
    db.session.commit()

def _generate_reset_token(email):
    _delete_expired_reset_tokens()
    token = secrets.token_hex(16)
    token_entry = PasswordResetTokens(email=email, reset_token=token)
    db.session.add(token_entry)
    db.session.commit()
    return token

def _check_reset_token(token):
    password_reset_entry = PasswordResetTokens.query.filter_by(reset_token=token).first()
    if password_reset_entry and password_reset_entry.expires_at > datetime.now(timezone.utc):
        return True, password_reset_entry.email
    else:
        return False, None
    
    
def send_reset_email(email):
    reset_token = _generate_reset_token(email)
    reset_password_link = f'https://seasaba-divelog-frontend.onrender.com/reset_password?token={reset_token}'
    email_body = f"""
    <h1>Password Reset</h1>
    <p>Please use the following link to reset your password:</p>
    <a href="{reset_password_link}">Reset Password</a>
    """
    try:
        postmark_client.emails.send(
            From='divelog@seasaba.com',
            To=email,
            Subject='Reset your password',
            HtmlBody=email_body
        )
        return True
    except Exception as e:
        print(f'Error sending email: {e}')
        return False

def perform_reset_password(token, new_password):
    is_valid, user_email = _check_reset_token(token)
    if not is_valid:
        return False, "Invalid or expired reset token."
    user = get_user_by_email(user_email)
    change_password(user, new_password)
    PasswordResetTokens.query.filter_by(email=user_email).delete()
    db.session.commit()
    return True, "Password reset successfully."
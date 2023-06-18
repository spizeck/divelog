from models.users import User
from extensions import db


def create_user(username, email, password, is_approved=False, admin=False):
    # Create a new user
    user = User(
        username=username,
        email=email,
        password=password,
        is_approved=is_approved,
        admin=admin
    )
    db.session.add(user)
    db.session.commit()

    return user


def get_user_by_id(user_id):
    # Retrieve the user from the database
    return User.query.get(user_id)


def get_user_by_username(username):
    # Retrieve the user from the database
    return User.query.filter_by(username=username).first()


def get_user_by_email(email):
    # Retrieve the user from the database
    return User.query.filter_by(email=email).first()


def update_user(user):
    # Update the user in the database
    db.session.commit()


def delete_user(user):
    # Delete the user from the database
    db.session.delete(user)
    db.session.commit()

def get_all_users():
    # Retrieve all users from the database
    return User.query.all()
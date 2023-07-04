import re

# Validate email format
def validate_email_format(email):
    regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    if re.match(regex, email):
        return True

# Validate password strength (at least 8 characters, 1 uppercase, 1 lowercase, 1 number, special characters allowed)
def validate_password_strength(password):
    regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\W]{8,}$"
    return bool(re.match(regex, password))
    
# Validate username
def validate_username(username):
    regex = r"^[a-zA-Z0-9_.-]+$"
    if re.match(regex, username):
        return True
    
# Validate username availability
def validate_username_availability(username, User):
    return User.query.filter_by(username=username).first() is None

# Validate email availability
def validate_email_availability(email, User):
    return User.query.filter_by(email=email).first() is None
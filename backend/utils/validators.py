import re

# Validate email format
def validate_email_format(email):
    regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    if re.match(regex, email):
        return True

# Validate password strength
def validate_password_strength(password):
    regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
    if re.match(regex, password):
        return True
    
# Validate username
def validate_username(username):
    regex = r"^[a-zA-Z0-9_.-]+$"
    if re.match(regex, username):
        return True
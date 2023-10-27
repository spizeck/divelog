import os

from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.office365.com')  # Default is set for Microsoft
    MAIL_PORT = os.environ.get('MAIL_PORT', 587)
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', True)
    MAIL_USE_SSL = os.environ.get('MAIL_USE_SSL', False)

class DevelopmentConfig(Config):
    debug = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')


class ProductionConfig(Config):
    debug = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('PRODUCTION_DATABASE_URL')


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL')


# Create an instance of the appropriate configuration class based on the environment
def get_app_config():
    app_env = os.environ.get('FLASK_ENV')
    if app_env == 'production':
        return ProductionConfig()
    elif app_env == 'testing':
        return TestingConfig()
    else:
        return DevelopmentConfig()


app_config = get_app_config()

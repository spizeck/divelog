import os

from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('PRODUCTION_DATABASE_URL')


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL')


# Create an instance of the appropriate configuration class based on the environment
# def get_app_config():
#     app_env = os.environ.get('FLASK_ENV')
#     if app_env == 'production':
#         return ProductionConfig()
#     elif app_env == 'testing':
#         return TestingConfig()
#     elif app_env == 'development':
#         return DevelopmentConfig()


app_config = ProductionConfig()
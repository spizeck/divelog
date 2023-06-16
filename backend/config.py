import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Config:
    DEBUG = False
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('PRODUCTION_DATABASE_URL')


class TestConfig(Config):
    TESTING = True


# Create an instance of the appropriate configuration class based on the environment
app_env = os.environ.get('APP_ENV', 'development')
if app_env == 'production':
    app_config = ProductionConfig()
else:
    app_config = DevelopmentConfig()

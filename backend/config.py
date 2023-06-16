import os

class Config:
    DEBUG = False
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')

class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')

# Create an instance of the appropriate configuration class based on the environment
app_env = os.environ.get('APP_ENV', 'development')
if app_env == 'production':
    app_config = ProductionConfig()
else:
    app_config = DevelopmentConfig()

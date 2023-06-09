from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
from sqlalchemy import text

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

@app.route('/')
def test_connection():
    try:
        # Perform a simple query to test the database connection
        stmt = text('SELECT 1')
        db.session.execute(stmt)
        return 'Database connection successful'
    except Exception as e:
        return f'Error connecting to database: {str(e)}'
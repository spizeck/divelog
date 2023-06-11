# This file is only used to create the tables and test them

from .database import db_session
# Import the model you want to test below
from .dives import Dive

# Function to read in a small number of entries from the Dive table
def read_entries():
    with db_session() as session:
        dives = session.query(Dive).limit(10).all()
        for dive in dives:
            # Process each dive entry as needed
            print(dive)
        

# Check if the Dive table exists, and create it if it doesn't
def create_table_if_not_exists():
    with db_session() as session:
        Dive.__table__.create(session.bind, checkfirst=True)
        print('Table created')

# Main entry point for executing the code
if __name__ == '__main__':
    create_table_if_not_exists()
    read_entries()
    print('action completed')

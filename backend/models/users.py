# from extensions import Base, db_session
# from sqlalchemy import Column, Integer, String, Boolean, DateTime

# class User(Base):
#     __tablename__ = "users"
    
#     id = Column(Integer, primary_key=True)
#     username = Column(String, unique=True, nullable=False)
#     email = Column(String, unique=True, nullable=False)
#     password = Column(String, nullable=False)
#     is_approved = Column(Boolean, default=False)
#     admin = Column(Boolean, default=False)
#     created_at = Column(DateTime, nullable=False)
    
#     def __init__(self, username, email, password, is_approved=False, admin=False):
#         self.username = username
#         self.email = email
#         self.password = password
#         self.is_approved = is_approved
#         self.admin = admin
        
#     def save(self, session=db_session):
#         session.add(self)
#         session.commit()
    
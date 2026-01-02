"""
Database initialization script.
Creates all tables if they don't exist.
"""
from app.database.connection import engine, Base
from app.database.models import User, CSVFile

def init_db():
    """Initialize database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()

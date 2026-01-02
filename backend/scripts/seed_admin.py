"""
Script to create an admin user.
Usage: python -m scripts.seed_admin
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
from app.database.models import User
from app.core.security import hash_password

def create_admin_user(username: str, password: str):
    """Create an admin user"""
    db: Session = SessionLocal()
    try:
        # Check if admin already exists
        existing_user = db.query(User).filter(User.username == username).first()
        if existing_user:
            print(f"User '{username}' already exists!")
            return

        # Create admin user
        hashed_password = hash_password(password)
        admin_user = User(
            username=username,
            password_hash=hashed_password,
            role="admin"
        )

        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

        print(f"Admin user '{username}' created successfully!")
        print(f"User ID: {admin_user.id}")
    except Exception as e:
        print(f"Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    import getpass

    print("=" * 50)
    print("Create Admin User")
    print("=" * 50)

    username = input("Enter admin username (default: admin): ").strip() or "admin"
    password = getpass.getpass("Enter admin password: ").strip()

    if not password:
        print("Error: Password cannot be empty!")
        sys.exit(1)

    # Check password length (bcrypt limit is 72 bytes)
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        print(f"Warning: Password is {len(password_bytes)} bytes. Bcrypt limit is 72 bytes.")
        print("Password will be truncated to 72 bytes.")
        response = input("Continue? (y/n): ").strip().lower()
        if response != 'y':
            print("Cancelled.")
            sys.exit(0)

    create_admin_user(username, password)

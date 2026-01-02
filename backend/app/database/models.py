from sqlalchemy import Column, Integer, String, BigInteger, ForeignKey, TIMESTAMP, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.connection import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="user")
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    # Relationships
    csv_files = relationship("CSVFile", back_populates="uploader", cascade="all, delete-orphan")

    __table_args__ = (
        CheckConstraint("role IN ('admin', 'user')", name="check_role"),
    )


class CSVFile(Base):
    __tablename__ = "csv_files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    path = Column(String(500), nullable=False)
    size = Column(BigInteger, nullable=False)
    uploaded_by = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    uploaded_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), index=True)

    # Relationships
    uploader = relationship("User", back_populates="csv_files")

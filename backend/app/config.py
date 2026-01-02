from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://user:password@localhost:5433/csv_browser_db"

    # JWT
    jwt_secret_key: str = "your-secret-key-here-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 30

    # File Storage
    upload_dir: str = "./uploads"

    # CORS (comma-separated string, will be split into list)
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

    @property
    def cors_origins_list(self) -> List[str]:
        """Convert comma-separated CORS origins string to list"""
        return [origin.strip() for origin in self.cors_origins.split(",")]


# Try to load settings, handle permission errors gracefully
try:
    settings = Settings()
except (PermissionError, FileNotFoundError) as e:
    # If .env file has permission issues or doesn't exist, use environment variables and defaults
    import warnings
    warnings.warn(
        f"Could not read .env file ({e}). Using environment variables and defaults. "
        "To fix: check .env file permissions or set environment variables directly."
    )
    # Create a new settings instance without .env file
    class SettingsFallback(BaseSettings):
        database_url: str = "postgresql://user:password@localhost:5433/csv_browser_db"
        jwt_secret_key: str = "your-secret-key-here-change-in-production"
        jwt_algorithm: str = "HS256"
        jwt_access_token_expire_minutes: int = 30
        upload_dir: str = "./uploads"
        cors_origins: str = "http://localhost:5173,http://localhost:3000"

        class Config:
            env_file_encoding = "utf-8"
            case_sensitive = False

        @property
        def cors_origins_list(self) -> List[str]:
            return [origin.strip() for origin in self.cors_origins.split(",")]

    settings = SettingsFallback()
except Exception as e:
    # For other unexpected errors, still try to proceed
    import warnings
    warnings.warn(f"Unexpected error loading .env file: {e}. Using defaults.")
    # Use the fallback class
    class SettingsFallback(BaseSettings):
        database_url: str = "postgresql://user:password@localhost:5433/csv_browser_db"
        jwt_secret_key: str = "your-secret-key-here-change-in-production"
        jwt_algorithm: str = "HS256"
        jwt_access_token_expire_minutes: int = 30
        upload_dir: str = "./uploads"
        cors_origins: str = "http://localhost:5173,http://localhost:3000"

        class Config:
            env_file_encoding = "utf-8"
            case_sensitive = False

        @property
        def cors_origins_list(self) -> List[str]:
            return [origin.strip() for origin in self.cors_origins.split(",")]

    settings = SettingsFallback()

# Ensure upload directory exists
os.makedirs(settings.upload_dir, exist_ok=True)

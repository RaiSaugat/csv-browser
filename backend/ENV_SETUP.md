# Environment Variables Setup Guide

## Quick Start

1. Copy the example file:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in your values (see details below)

## Required Variables

### DATABASE_URL

**Required**: PostgreSQL database connection string

**Format**: `postgresql://username:password@host:port/database_name`

**Examples**:

- Local PostgreSQL: `postgresql://postgres:password@localhost:5433/csv_browser_db`
- If no password: `postgresql://postgres@localhost:5433/csv_browser_db`
- Different port: `postgresql://postgres:password@localhost:5433/csv_browser_db`

**How to get it**:

1. Make sure PostgreSQL is installed and running
2. Create a database: `createdb csv_browser_db` (or use psql)
3. Use your PostgreSQL username and password

### JWT_SECRET_KEY

**Required**: Secret key for signing JWT tokens

**Important**: Use a strong, random secret key in production!

**Generate a secure key**:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Example**: `super-secret-key-change-this-in-production-12345`

### JWT_ALGORITHM

**Optional** (default: HS256)

Usually keep this as `HS256` unless you have specific requirements.

### JWT_ACCESS_TOKEN_EXPIRE_MINUTES

**Optional** (default: 30)

How long JWT tokens remain valid (in minutes).

**Examples**:

- 30 minutes: `30`
- 1 hour: `60`
- 1 day: `1440`

### UPLOAD_DIR

**Optional** (default: ./uploads)

Directory where CSV files will be stored.

**Examples**:

- Relative path: `./uploads`
- Absolute path: `/var/www/uploads` (Linux/Mac) or `C:\uploads` (Windows)

### CORS_ORIGINS

**Optional** (default: http://localhost:5173,http://localhost:3000)

Comma-separated list of frontend URLs allowed to access the API.

**Examples**:

- Single origin: `http://localhost:5173`
- Multiple origins: `http://localhost:5173,http://localhost:3000,https://myapp.com`
- All origins (development only): `*` (not recommended for production)

## Complete Example .env File

```env
# Database
DATABASE_URL=postgresql://postgres:mypassword@localhost:5433/csv_browser_db

# JWT
JWT_SECRET_KEY=my-super-secret-jwt-key-change-this-123456789
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# File Storage
UPLOAD_DIR=./uploads

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Troubleshooting

### Database Connection Issues

- Make sure PostgreSQL is running: `pg_isready` or `psql -U postgres`
- Check if database exists: `psql -U postgres -l`
- Verify username/password are correct
- Check if port 5432 is correct (default PostgreSQL port)

### CORS Errors

- Make sure your frontend URL is in `CORS_ORIGINS`
- Check for typos in the URL (http vs https, port numbers)
- Restart the backend server after changing `.env`

### JWT Issues

- Make sure `JWT_SECRET_KEY` is set and not empty
- Use a strong secret key (at least 32 characters recommended)

## Security Notes

⚠️ **Never commit `.env` to version control!**

- The `.env` file is already in `.gitignore`
- Use `.env.example` as a template (without real secrets)
- In production, use environment variables or a secrets manager
- Generate a strong `JWT_SECRET_KEY` for production

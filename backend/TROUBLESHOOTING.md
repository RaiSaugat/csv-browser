# Troubleshooting Guide

## Permission Error with .env File

If you're getting a `PermissionError` when trying to read the `.env` file, here are solutions:

### Solution 1: Fix File Permissions (Recommended)

On macOS/Linux, check and fix permissions:

```bash
cd backend
# Check current permissions
ls -la .env

# Fix permissions (make it readable)
chmod 644 .env

# Or remove extended attributes (macOS specific)
xattr -c .env
```

### Solution 2: Use Environment Variables Instead

Instead of using a `.env` file, you can set environment variables directly:

**On macOS/Linux:**

```bash
export DATABASE_URL="postgresql://postgres:password@localhost:5433/csv_browser_db"
export JWT_SECRET_KEY="your-secret-key-here"
export JWT_ALGORITHM="HS256"
export JWT_ACCESS_TOKEN_EXPIRE_MINUTES="30"
export UPLOAD_DIR="./uploads"
export CORS_ORIGINS="http://localhost:5173,http://localhost:3000"

# Then run your script
python -m scripts.init_db
```

**Or create a script to set them:**

```bash
# Create setup_env.sh
cat > setup_env.sh << 'EOF'
#!/bin/bash
export DATABASE_URL="postgresql://postgres:password@localhost:5433/csv_browser_db"
export JWT_SECRET_KEY="your-secret-key-here"
export JWT_ALGORITHM="HS256"
export JWT_ACCESS_TOKEN_EXPIRE_MINUTES="30"
export UPLOAD_DIR="./uploads"
export CORS_ORIGINS="http://localhost:5173,http://localhost:3000"
EOF

chmod +x setup_env.sh
source setup_env.sh
python -m scripts.init_db
```

### Solution 3: Recreate .env File

If the file has issues, delete and recreate it:

```bash
cd backend
# Backup current .env (if you want to keep it)
cp .env .env.backup

# Remove extended attributes (macOS)
xattr -c .env

# Or delete and recreate
rm .env
# Then create a new one with proper content
```

### Solution 4: Check macOS Security Settings

On macOS, the file might be blocked by security settings. Check:

```bash
# Check extended attributes
xattr -l .env

# Remove all extended attributes
xattr -c .env

# Check if file is in quarantine
xattr -d com.apple.quarantine .env 2>/dev/null || echo "No quarantine attribute"
```

## Database Connection Issues

If you get database connection errors:

1. **Check PostgreSQL is running:**

   ```bash
   # macOS
   brew services list | grep postgresql
   # Or
   pg_isready
   ```

2. **Verify database exists:**

   ```bash
   psql -U postgres -l
   # Or
   psql -U postgres -c "\l"
   ```

3. **Create database if it doesn't exist:**

   ```bash
   createdb -U postgres csv_browser_db
   # Or using psql
   psql -U postgres -c "CREATE DATABASE csv_browser_db;"
   ```

4. **Check connection string:**
   - Format: `postgresql://username:password@host:port/database_name`
   - Make sure username, password, and database name are correct

## Common Errors

### "ModuleNotFoundError: No module named 'app'"

Make sure you're running from the backend directory:

```bash
cd backend
python -m scripts.init_db
```

### "OperationalError: could not connect to server"

- PostgreSQL is not running
- Wrong connection string in DATABASE_URL
- Database doesn't exist

### "Permission denied" on .env

See Solution 1-4 above for .env permission issues.

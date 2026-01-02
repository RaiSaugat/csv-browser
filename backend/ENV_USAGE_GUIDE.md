# How to Use .env Variables in config.py

## How It Works

The `config.py` file uses **pydantic-settings** which automatically:

1. Reads from a `.env` file in the same directory
2. Reads from system environment variables
3. Falls back to default values if neither exists

## Step-by-Step Guide

### Step 1: Create .env File

Create a file named `.env` in the `backend/` directory:

```bash
cd backend
touch .env
```

### Step 2: Add Your Variables

Edit the `.env` file and add your values:

```env
DATABASE_URL=postgresql://postgres:mypassword@localhost:5433/csv_browser_db
JWT_SECRET_KEY=my-super-secret-key-123456789
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
UPLOAD_DIR=./uploads
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Step 3: How config.py Reads Them

The `Settings` class automatically maps environment variables:

```python
class Settings(BaseSettings):
    # This reads from DATABASE_URL in .env
    database_url: str = "default-value"

    # This reads from JWT_SECRET_KEY in .env
    jwt_secret_key: str = "default-value"
```

**Important**:

- Variable names in `.env` should match the field names (case-insensitive)
- `database_url` in Python = `DATABASE_URL` or `database_url` in .env
- `jwt_secret_key` in Python = `JWT_SECRET_KEY` or `jwt_secret_key` in .env

### Step 4: Access the Variables

In your code, use `settings` object:

```python
from app.config import settings

# Use the database URL
db_url = settings.database_url

# Use JWT secret
secret = settings.jwt_secret_key

# Use CORS origins (as a list)
origins = settings.cors_origins_list
```

## Complete Example

### .env file:

```env
DATABASE_URL=postgresql://postgres:password123@localhost:5433/csv_browser_db
JWT_SECRET_KEY=my-secret-key-change-this
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
UPLOAD_DIR=./uploads
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,https://myapp.com
```

### In your code:

```python
from app.config import settings

# These will use values from .env
print(settings.database_url)  # postgresql://postgres:password123@localhost:5433/csv_browser_db
print(settings.jwt_secret_key)  # my-secret-key-change-this
print(settings.jwt_access_token_expire_minutes)  # 60
print(settings.cors_origins_list)  # ['http://localhost:5173', 'http://localhost:3000', 'https://myapp.com']
```

## Variable Name Mapping

| Python Field Name                 | .env Variable Name                | Example Value                                 |
| --------------------------------- | --------------------------------- | --------------------------------------------- |
| `database_url`                    | `DATABASE_URL`                    | `postgresql://user:pass@localhost:5433/db`    |
| `jwt_secret_key`                  | `JWT_SECRET_KEY`                  | `my-secret-key-123`                           |
| `jwt_algorithm`                   | `JWT_ALGORITHM`                   | `HS256`                                       |
| `jwt_access_token_expire_minutes` | `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | `30`                                          |
| `upload_dir`                      | `UPLOAD_DIR`                      | `./uploads`                                   |
| `cors_origins`                    | `CORS_ORIGINS`                    | `http://localhost:5173,http://localhost:3000` |

## Priority Order

The config reads variables in this order (highest priority first):

1. **System environment variables** (set in your shell)
2. **`.env` file** (in the backend directory)
3. **Default values** (in the code)

Example:

- If you set `export DATABASE_URL=...` in your shell, it overrides `.env`
- If `.env` has `DATABASE_URL=...`, it overrides the default
- If neither exists, it uses the default value in code

## Testing Your .env File

You can test if your `.env` is being read:

```python
# In Python shell or a test script
from app.config import settings

print("Database URL:", settings.database_url)
print("JWT Secret:", settings.jwt_secret_key[:10] + "...")  # Show first 10 chars
print("CORS Origins:", settings.cors_origins_list)
```

## Common Issues

### Issue 1: Variables not being read

- Make sure `.env` is in the `backend/` directory (same level as `app/`)
- Check file permissions: `chmod 644 .env`
- Restart your application after changing `.env`

### Issue 2: Wrong values

- Check for typos in variable names
- Make sure there are no spaces around `=` sign
- Don't use quotes unless the value itself needs them

### Issue 3: Permission errors

- Run: `xattr -c .env` (macOS)
- Run: `chmod 644 .env` (Linux/macOS)

## Best Practices

1. **Never commit `.env` to git** (it's already in `.gitignore`)
2. **Use `.env.example`** as a template (without real secrets)
3. **Use strong secrets** for `JWT_SECRET_KEY` in production
4. **Keep defaults** for development/testing
5. **Document** what each variable does

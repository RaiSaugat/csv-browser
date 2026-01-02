# CSV Browser Backend

Real-Time CSV Browser with Role-Based Access Control - FastAPI Backend

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5433/csv_browser_db
JWT_SECRET_KEY=your-secret-key-here-change-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
UPLOAD_DIR=./uploads
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3. Initialize Database

```bash
# Create database tables
python -m scripts.init_db
```

### 4. Create Admin User

```bash
# Run the seed script to create an admin user
python -m scripts.seed_admin
```

### 5. Run the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:

- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication

- `POST /api/v1/auth/signup` - Register a new user
- `POST /api/v1/auth/login` - Login and get JWT token

### CSV Management

- `GET /api/v1/csv` - List all CSV files (user/admin)
- `GET /api/v1/csv/{file_id}` - Get CSV content (user/admin)
- `POST /api/v1/csv/upload` - Upload CSV file (admin only)
- `DELETE /api/v1/csv/{file_id}` - Delete CSV file (admin only)

### User Management

- `GET /api/v1/users` - List all users (admin only)
- `DELETE /api/v1/users/{user_id}` - Delete user (admin only)

### WebSocket

- `WS /api/v1/ws` - WebSocket connection for real-time updates

## Authentication

All endpoints except `/api/v1/auth/signup` and `/api/v1/auth/login` require authentication.

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Roles

- **admin**: Can upload/delete CSV files, view/delete users
- **user**: Can view CSV files and their contents

## WebSocket Events

The WebSocket broadcasts the following event:

- `csv_list_updated`: Sent when a CSV file is uploaded or deleted

Event format:

```json
{
  "event": "csv_list_updated",
  "message": "CSV file uploaded"
}
```

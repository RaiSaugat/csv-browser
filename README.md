# Real-Time CSV Browser with Role-Based Access Control

A full-stack web application where users can sign up, log in, and browse CSV files uploaded by an admin. The app supports real-time updates via WebSockets and JWT-based role-based access control (RBAC).

## 🚀 Features

### Authentication & Authorization

- User signup and login with JWT tokens
- Role-based access control (admin/user)
- Secure password hashing with bcrypt
- Protected routes and API endpoints

### CSV Management

- **Users**: View list of CSV files and their contents
- **Admins**: Upload, view, and delete CSV files
- Real-time updates when files are uploaded or deleted
- CSV content displayed in a table format

### Admin Panel

- View all users
- Delete users
- Manage CSV files

### Real-Time Updates

- WebSocket integration for live updates
- Automatic refresh when CSV files are added/removed
- No page refresh needed

## 🛠️ Tech Stack

### Backend

- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Relational database
- **SQLAlchemy** - ORM for database operations
- **JWT** - Authentication tokens
- **WebSockets** - Real-time communication
- **Pydantic** - Data validation
- **Bcrypt** - Password hashing

### Frontend

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **WebSocket API** - Real-time updates

## 📁 Project Structure

```
.
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Security, WebSocket manager
│   │   ├── database/       # Models and connection
│   │   ├── schemas/        # Pydantic models
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utilities
│   ├── scripts/           # Database initialization scripts
│   ├── uploads/           # CSV file storage
│   └── requirements.txt   # Python dependencies
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API and WebSocket services
│   │   ├── context/       # React context
│   │   ├── hooks/         # Custom hooks
│   │   └── types/         # TypeScript types
│   └── package.json       # Node dependencies
│
└── README.md              # This file
```

## 🚦 Getting Started

### Prerequisites

- **Python 3.10+**
- **Node.js 18+** and npm
- **PostgreSQL 12+**
- **Git**

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install Python dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**

   Create a `.env` file in the `backend/` directory:

   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/csv_browser_db
   JWT_SECRET_KEY=your-secret-key-here-change-in-production
   JWT_ALGORITHM=HS256
   JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
   UPLOAD_DIR=./uploads
   CORS_ORIGINS=http://localhost:5173,http://localhost:3000
   ```

   **Important**:

   - Replace `postgres:password` with your PostgreSQL credentials
   - Generate a secure `JWT_SECRET_KEY` (you can use: `python -c "import secrets; print(secrets.token_urlsafe(32))"`)

4. **Create PostgreSQL database**

   ```bash
   createdb csv_browser_db
   # Or using psql:
   psql -U postgres -c "CREATE DATABASE csv_browser_db;"
   ```

5. **Initialize database tables**

   ```bash
   python -m scripts.init_db
   ```

6. **Create admin user**

   ```bash
   python -m scripts.seed_admin
   ```

   When prompted, enter:

   - Username: `admin` (or your choice)
   - Password: Choose a password (must be under 72 characters)

7. **Start the backend server**

   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at:

   - API: http://localhost:8000
   - API Docs: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables (Optional)**

   Create a `.env` file in the `frontend/` directory if you need to customize URLs:

   ```env
   VITE_API_URL=http://localhost:8000
   VITE_WS_URL=ws://localhost:8000
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at http://localhost:5173

## 📖 Usage

### First Time Setup

1. Start the backend server (port 8000)
2. Start the frontend server (port 5173)
3. Open http://localhost:5173 in your browser
4. Sign up for a new account (creates a "user" role)
5. Or login with the admin account you created

### User Features

- **Sign Up**: Create a new account (default role: "user")
- **Login**: Authenticate and receive JWT token
- **View CSV Files**: Browse list of uploaded CSV files
- **View CSV Content**: Click on a file to see its contents in a table
- **Real-time Updates**: Automatically see new files without refreshing

### Admin Features

All user features, plus:

- **Upload CSV**: Upload new CSV files
- **Delete CSV**: Remove CSV files
- **View Users**: See all registered users
- **Delete Users**: Remove user accounts

## 🔌 API Endpoints

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

### Authentication

All endpoints except `/api/v1/auth/signup` and `/api/v1/auth/login` require authentication.

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🔐 Roles & Permissions

### Admin

- Upload CSV files
- Delete CSV files
- View all uploaded CSVs
- View all users
- Delete users

### User

- Sign up & log in
- View list of CSV files
- View CSV contents
- Receive real-time updates

## 🌐 WebSocket Events

The WebSocket broadcasts events when CSV files are uploaded or deleted:

```json
{
  "event": "csv_list_updated",
  "message": "CSV file uploaded"
}
```

All connected clients automatically receive these updates and refresh their CSV list.

## 🗄️ Database Schema

### Users Table

- `id` - Primary key
- `username` - Unique username
- `password_hash` - Bcrypt hashed password
- `role` - Either "admin" or "user"
- `created_at` - Timestamp

### CSV Files Table

- `id` - Primary key
- `filename` - Original filename
- `path` - File path on filesystem
- `size` - File size in bytes
- `uploaded_by` - Foreign key to users.id
- `uploaded_at` - Timestamp

## 🛠️ Development

### Backend Development

```bash
cd backend
# Install dependencies
pip install -r requirements.txt

# Run with auto-reload
uvicorn app.main:app --reload
```

### Frontend Development

```bash
cd frontend
# Install dependencies
npm install

# Run dev server
npm run dev
```

### Building for Production

**Backend:**

```bash
# No build step needed, just ensure dependencies are installed
pip install -r requirements.txt
```

**Frontend:**

```bash
cd frontend
npm run build
# Output will be in dist/ directory
```

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Error**

- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in `.env` file
- Ensure database exists: `psql -U postgres -l`

**Permission Error with .env**

- Fix permissions: `chmod 644 backend/.env`
- Remove extended attributes (macOS): `xattr -c backend/.env`

**Module Not Found**

- Ensure you're in the `backend/` directory
- Verify virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

### Frontend Issues

**API Connection Error**

- Verify backend is running on port 8000
- Check `VITE_API_URL` in frontend `.env`
- Check browser console for CORS errors

**WebSocket Connection Failed**

- Ensure backend WebSocket endpoint is accessible
- Check `VITE_WS_URL` in frontend `.env`
- Verify backend CORS settings include frontend URL

### Common Issues

**Password too long error**

- Bcrypt has a 72-byte limit
- Use passwords under 72 characters
- See `backend/ADMIN_PASSWORD_GUIDE.md` for details

**JWT Token Expired**

- Tokens expire after 30 minutes (configurable)
- Simply log in again to get a new token

For more detailed troubleshooting, see:

- `backend/TROUBLESHOOTING.md`
- `backend/ENV_USAGE_GUIDE.md`

## 📝 Environment Variables

### Backend (.env)

| Variable                          | Description                                | Default                                                    |
| --------------------------------- | ------------------------------------------ | ---------------------------------------------------------- |
| `DATABASE_URL`                    | PostgreSQL connection string               | `postgresql://user:password@localhost:5432/csv_browser_db` |
| `JWT_SECRET_KEY`                  | Secret key for JWT tokens                  | `your-secret-key-here-change-in-production`                |
| `JWT_ALGORITHM`                   | JWT algorithm                              | `HS256`                                                    |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time                      | `30`                                                       |
| `UPLOAD_DIR`                      | CSV file storage directory                 | `./uploads`                                                |
| `CORS_ORIGINS`                    | Allowed frontend origins (comma-separated) | `http://localhost:5173,http://localhost:3000`              |

### Frontend (.env) - Optional

| Variable       | Description     | Default                 |
| -------------- | --------------- | ----------------------- |
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |
| `VITE_WS_URL`  | WebSocket URL   | `ws://localhost:8000`   |

## 📚 Documentation

- **Backend API Docs**: http://localhost:8000/docs (Swagger UI)
- **Backend ReDoc**: http://localhost:8000/redoc
- **Backend README**: `backend/README.md`
- **Frontend README**: `frontend/README.md`
- **Environment Setup**: `backend/ENV_USAGE_GUIDE.md`
- **Troubleshooting**: `backend/TROUBLESHOOTING.md`

## 🧪 Testing

### Manual Testing

1. **Test Authentication**

   - Sign up a new user
   - Login and verify JWT token is received
   - Try accessing protected endpoints

2. **Test CSV Operations**

   - Upload a CSV file (admin)
   - View CSV list (user/admin)
   - View CSV content
   - Delete CSV file (admin)

3. **Test Real-time Updates**

   - Open app in two browser windows
   - Upload/delete CSV in one window
   - Verify other window updates automatically

4. **Test Role-based Access**
   - Try admin-only endpoints as regular user
   - Verify proper error messages

## 🚀 Deployment Notes

### Backend

- Set strong `JWT_SECRET_KEY` in production
- Use secure database credentials
- Configure proper CORS origins
- Set up proper file storage (consider cloud storage for production)
- Use environment variables, not `.env` file in production

### Frontend

- Build for production: `npm run build`
- Serve `dist/` directory with a web server (nginx, Apache, etc.)
- Update `VITE_API_URL` and `VITE_WS_URL` for production backend
- Configure HTTPS for WebSocket connections

## 📄 License

This project is for educational/assignment purposes.

## 👥 Contributing

This is an assignment project. For questions or issues, please refer to the project documentation.

---

**Built with ❤️ using FastAPI, React, and TypeScript**

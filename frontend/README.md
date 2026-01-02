# CSV Browser Frontend

React + TypeScript + Tailwind CSS frontend for the Real-Time CSV Browser application.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables (Optional)

Create a `.env` file in the `frontend/` directory if you need to customize the API URL:

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at http://localhost:5173

## Features

- **Authentication**: Sign up and login with JWT tokens
- **CSV Management**: View CSV files and their contents
- **Real-time Updates**: WebSocket integration for live updates
- **Admin Panel**: Upload/delete CSV files, manage users
- **Role-based Access**: Different views for admin and regular users

## Project Structure

```
src/
├── components/
│   ├── auth/          # Login and Signup components
│   ├── csv/           # CSV List, Viewer, Upload components
│   ├── admin/         # Admin-only components
│   └── common/        # Layout, ProtectedRoute
├── services/          # API and WebSocket services
├── context/           # AuthContext for state management
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
└── App.tsx            # Main app component with routing
```

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

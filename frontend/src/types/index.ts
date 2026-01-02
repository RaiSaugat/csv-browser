export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface CSVFile {
  id: number;
  filename: string;
  size: number;
  uploaded_at: string;
}

export interface CSVContent {
  filename: string;
  headers: string[];
  rows: Record<string, any>[];
  total_rows: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface WebSocketMessage {
  event: string;
  message: string;
}

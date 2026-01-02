import axios from 'axios';
import type { LoginCredentials, SignupData, AuthResponse, CSVFile, CSVContent, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  signup: async (data: SignupData) => {
    const response = await api.post<{ message: string; user_id: number; username: string }>('/api/v1/auth/signup', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials) => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await api.post<AuthResponse>('/api/v1/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// CSV endpoints
export const csvApi = {
  list: async () => {
    const response = await api.get<CSVFile[]>('/api/v1/csv');
    return response.data;
  },

  get: async (fileId: number) => {
    const response = await api.get<CSVContent>(`/api/v1/csv/${fileId}`);
    return response.data;
  },

  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<CSVFile>('/api/v1/csv/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (fileId: number) => {
    await api.delete(`/api/v1/csv/${fileId}`);
  },
};

// User endpoints (admin only)
export const userApi = {
  list: async () => {
    const response = await api.get<User[]>('/api/v1/users');
    return response.data;
  },

  delete: async (userId: number) => {
    await api.delete(`/api/v1/users/${userId}`);
  },
};

export default api;

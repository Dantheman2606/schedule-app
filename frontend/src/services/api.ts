import axios, { type AxiosInstance, type AxiosError } from 'axios';

// Check if running in Electron and use the backend URL from .env
const getApiBaseUrl = () => {
  // @ts-ignore - window.API_CONFIG is injected by Electron
  if (typeof window !== 'undefined' && window.API_CONFIG?.baseURL) {
    // @ts-ignore
    return window.API_CONFIG.baseURL;
  }
  // @ts-ignore - window.electron is exposed by preload.js
  if (typeof window !== 'undefined' && window.electron?.env?.BACKEND_URL) {
    // @ts-ignore
    return window.electron.env.BACKEND_URL;
  }
  return 'http://localhost:3000/api';
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to add token
    this.api.interceptors.request.use(
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

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(endpoint: string, params?: any): Promise<T> {
    const response = await this.api.get<T>(endpoint, { params });
    return response.data;
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await this.api.post<T>(endpoint, data);
    return response.data;
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await this.api.put<T>(endpoint, data);
    return response.data;
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    const response = await this.api.patch<T>(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.api.delete<T>(endpoint);
    return response.data;
  }
}

export default new ApiService();

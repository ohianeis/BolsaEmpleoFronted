//implementacion axios para configurar cabecera llamadas con token bearer
// src/app/services/apiClient.ts
import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from './apiEndpoints';

const apiService: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para añadir token automáticamente
apiService.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiService;

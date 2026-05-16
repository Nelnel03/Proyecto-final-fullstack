import axios from 'axios';
import { BASE_URL } from './config';

/**
 * Centralized Axios Instance.
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

/**
 * REQUEST INTERCEPTOR
 * Automatically adds authorization tokens to every request.
 */
apiClient.interceptors.request.use(
  (config) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = sessionStorage.getItem('token') || localStorage.getItem('token') || user?.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 * Centralized error handling and token management.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Global handling for unauthorized (401) errors
    if (response && response.status === 401) {
      console.warn('Session expired or unauthorized. Redirecting to login...');
      // Logic for logout/redirect can go here
      // sessionStorage.clear();
      // window.location.href = '/login';
    }
    
    // Centralized error message extraction
    const message = response?.data?.message || 'Hubo un error en la conexión con el servidor.';
    console.error(`[API Error] ${response?.status}: ${message}`);
    
    return Promise.reject({
      ...error,
      customMessage: message,
      status: response?.status
    });
  }
);

export default apiClient;

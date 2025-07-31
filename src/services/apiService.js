import axios from 'axios';
import { API_ENDPOINTS } from '../config';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const apiCache = new Map();

// Create axios instance with default config
const apiClient = axios.create({
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for caching
apiClient.interceptors.request.use(
  (config) => {
    // Add cache key for GET requests
    if (config.method === 'get') {
      const cacheKey = `${config.method}:${config.url}`;
      const cached = apiCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        // Return cached response
        return Promise.resolve({
          ...cached.response,
          config,
          request: {},
          cached: true,
        });
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for caching and error handling
apiClient.interceptors.response.use(
  (response) => {
    // Cache successful GET responses
    if (response.config.method === 'get' && !response.cached) {
      const cacheKey = `${response.config.method}:${response.config.url}`;
      apiCache.set(cacheKey, {
        response: {
          data: response.data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        },
        timestamp: Date.now(),
      });
    }
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('teacherRegistered');
      window.location.href = '/';
    }
    
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// Custom hook for API calls with caching
export const useApiCall = () => {
  const get = async (url, options = {}) => {
    try {
      const response = await apiClient.get(url, options);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  };

  const post = async (url, data, options = {}) => {
    try {
      const response = await apiClient.post(url, data, options);
      // Invalidate cache for related GET requests
      clearCache();
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  };

  const put = async (url, data, options = {}) => {
    try {
      const response = await apiClient.put(url, data, options);
      // Invalidate cache for related GET requests
      clearCache();
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  };

  const del = async (url, options = {}) => {
    try {
      const response = await apiClient.delete(url, options);
      // Invalidate cache for related GET requests
      clearCache();
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  };

  const clearCache = () => {
    apiCache.clear();
  };

  return { get, post, put, delete: del, clearCache };
};

// Predefined API methods
export const apiService = {
  // Teacher endpoints
  getTeacherByFirebaseId: (firebaseId) => 
    apiClient.get(`${API_ENDPOINTS.TEACHERS}/firebase/${firebaseId}`),
  
  // Class endpoints
  getTeacherClasses: (firebaseId) => 
    apiClient.get(`${API_ENDPOINTS.CLASSES}/teacher/${firebaseId}`),
  
  createClass: (classData) => 
    apiClient.post(API_ENDPOINTS.CLASSES, classData),
  
  updateClass: (classId, classData) => 
    apiClient.put(`${API_ENDPOINTS.CLASSES}/${classId}`, classData),
  
  deleteClass: (classId) => 
    apiClient.delete(`${API_ENDPOINTS.CLASSES}/${classId}`),
  
  // Student endpoints
  getClassStudents: (classId) => 
    apiClient.get(`${API_ENDPOINTS.STUDENTS}/class/${classId}`),
  
  addStudents: (classId, students) => 
    apiClient.post(`${API_ENDPOINTS.STUDENTS}/class/${classId}`, students),
  
  // Session endpoints
  createSession: (sessionData) => 
    apiClient.post(API_ENDPOINTS.SESSIONS, sessionData),
  
  getClassSessions: (classId) => 
    apiClient.get(`${API_ENDPOINTS.SESSIONS}/class/${classId}`),
  
  // Attendance endpoints
  markAttendance: (attendanceData) => 
    apiClient.post(API_ENDPOINTS.ATTENDANCE, attendanceData),
  
  getAttendanceRecords: (sessionId) => 
    apiClient.get(`${API_ENDPOINTS.ATTENDANCE_RECORDS}/session/${sessionId}`),
  
  // Utility
  clearCache: () => apiCache.clear(),
};

export default apiService; 
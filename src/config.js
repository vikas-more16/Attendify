// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://attendify-backend-zs9j.onrender.com';

// API Endpoints
export const API_ENDPOINTS = {
  TEACHERS: `${API_BASE_URL}/api/teachers`,
  CLASSES: `${API_BASE_URL}/api/classes`,
  STUDENTS: `${API_BASE_URL}/api/students`,
  SESSIONS: `${API_BASE_URL}/api/sessions`,
  RECORDS: `${API_BASE_URL}/api/records`,
  ATTENDANCE: `${API_BASE_URL}/api/attendance`,
  ATTENDANCE_RECORDS: `${API_BASE_URL}/api/attendance-records`,
}; 
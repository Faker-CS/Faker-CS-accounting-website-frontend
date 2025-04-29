import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

// Telling axios to send & receive cookies
export const axiosInstance = axios.create({
  baseURL: CONFIG.serverUrl,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

// Helper to hit Sanctum’s CSRF endpoint
export async function getCsrfToken() {
  return axiosInstance.get('/sanctum/csrf-cookie');
}
export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    login: '/api/login',
    register: '/api/register',
    logout: '/api/logout',
    me: '/api/user',
  },
  // company management endpoints
  company: {
    list: '/api/companies',
    create: '/api/companies',
    details: (id) => `/api/companies/${id}`, // Use with ID parameter
    update: (id) => `/api/companies/${id}`, // Use with ID parameter
    delete: (id) => `/api/companies/${id}`, // Use with ID parameter
    industries: {
      attach: (id) => `/api/companies/${id}/industries`, // POST with industry IDs
      detach: (id, industryId) => `/api/companies/${id}/industries/${industryId}`, // DELETE
    },
    activities: {
      attach: (id) => `/api/companies/${id}/activities`, // POST with activity IDs
      detach: (id, activityId) => `/api/companies/${id}/activities/${activityId}`, // DELETE
    },
    search: (query) => `/api/companies?search=${query}`, // Search by name/raison sociale
    filter: {
      status: (status) => `/api/companies?status=${status}`, // Filter by status
      industry: (id) => `/api/companies?industry=${id}`, // Filter by industry ID
    },
  },
};

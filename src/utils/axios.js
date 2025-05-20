import axios from 'axios';

import { CONFIG } from 'src/config-global';

const JWT_TOKEN = localStorage.getItem('jwt_access_token') || null;

// ----------------------------------------------------------------------

// Telling axios to send & receive cookies
export const axiosInstance = axios.create({
  baseURL: CONFIG.serverUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${JWT_TOKEN}`,
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

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

export const poster = async (url, data = {}, config = {}) => {
  try {
    const res = await axiosInstance.post(url, data, config);
    return res.data;
  } catch (error) {
    console.error('❌ Failed to post:', error);
    throw error;
  }
};
 
// PUT
export const putter = async (url, data = {}, config = {}) => {
  try {
    const res = await axiosInstance.put(url, data, config);
    return res.data;
  } catch (error) {
    console.error('❌ Failed to put:', error);
    throw error;
  }
};
 
// DELETE
export const deleter = async (url, config = {}) => {
  try {
    const res = await axiosInstance.delete(url, config);
    return res.data;
  } catch (error) {
    console.error('❌ Failed to delete:', error);
    throw error;
  }
};
 
// PATCH (optional)
export const patcher = async (url, data = {}, config = {}) => {
  try {
    const res = await axiosInstance.patch(url, data, config);
    return res.data;
  } catch (error) {
    console.error('❌ Failed to patch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  Tasks: '/api/tasks',
  calendar: '/api/calendar',
  auth: {
    login: '/api/login',
    register: '/api/register',
    logout: '/api/logout',
    me: '/api/user',
    profile: '/api/profile',
  },
  aideComptable: {
    list: '/api/aideComptables',
    create: '/api/aideComptable',
    details: (id) => `/api/aideComptable/${id}`, // Use with ID parameter
    update: (id) => `/api/aideComptable/${id}`, // Use with ID parameter
    delete: (id) => `/api/aideComptable/${id}`, // Use with ID parameter
    assignToDemande: (demandeId) => `/api/demandes/assign/${demandeId}`,
  },
  // company management endpoints
  company: {
    list: '/api/companies',
    create: '/api/companies',
    details: (id) => `/api/companies/${id}`, // Use with ID parameter
    update: (id) => `/api/companies/${id}`, // Use with ID parameter
    delete: (id) => `/api/companies/${id}`, // Use with ID parameter

    search: (query) => `/api/companies?search=${query}`, // Search by name/raison sociale
    filter: {
      status: (status) => `/api/companies?status=${status}`, // Filter by status
      industry: (id) => `/api/companies?industry=${id}`, // Filter by industry ID
    },
  },
  // chat endpoints
  chat: {
    conversations: '/api/conversations',
    conversation: (id) => `/api/conversations/${id}`,
    messages: (conversationId) => `/api/conversations/${conversationId}/messages`,
    contacts: (id) => `/api/contacts/${id}`,
    createConversation: '/api/new-conversation',
  },
  // documents endpoints
  documents: {
    getByService: (i)=> `api/services/${i}/documents`,
    upload: "/api/documents/upload"
  },
  // services endpoints
  services: {
    all: '/api/services',
  },
  // forms endpoints
  forms: {
    all: '/api/forms',
    deleteForm: (id)=> `/api/forms/${id}`,
    get: (id) => `/api/forms/${id}`
  },
  // notifications endpoints
  notification: {
    user: '/api/notifications',
  },
};

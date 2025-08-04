/* eslint-disable import/no-unresolved */
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
    show: (id) => `/api/companies/${id}`, // Use with ID parameter

    search: (query) => `/api/companies?search=${query}`, // Search by name/raison sociale
    filter: {
      status: (status) => `/api/companies?status=${status}`, // Filter by status
      industry: (id) => `/api/companies?industry=${id}`, // Filter by industry ID
    },
  },

  // employee management endpoints
  employee: {
    list: '/api/employees',
    byCompany: (companyId) => `/api/companies/${companyId}/employees`,
    create: '/api/employees',
    details: (id) => `/api/employees/${id}`, // Use with ID parameter
    update: (id) => `/api/employees/${id}`, // Use with ID parameter
    delete: (id) => `/api/employees/${id}`, // Use with ID parameter
    show: (id) => `/api/employees/${id}`, // Use with ID parameter
  },

  // chat endpoints
  chat: {
    conversations: '/api/conversations',
    conversation: (id) => `/api/conversations/${id}`,
    messages: (conversationId) => `/api/conversations/${conversationId}/messages`,
    contacts: (id) => `/api/chat/contacts/${id}`,
    createConversation: '/api/chat/create-conversation',
    sendMessage: '/api/chat/send-messages',
  },
  // documents endpoints
  documents: {
    getByService: (i)=> `api/services/${i}/documents`,
    upload: "/api/documents/upload",
    
  },
  // services endpoints
  services: {
    all: '/api/services',
    status: (id) => `/api/status/${id}`,
  },
  // forms endpoints
  forms: {
    all: '/api/forms',
    deleteForm: (id)=> `/api/forms/${id}`,
    get: (id) => `/api/forms/${id}`,
  },
  // notifications endpoints
  notification: {
    user: '/api/notifications',
  },

  // statistics endpoints
  statistics: {
    get: '/api/statistics'
  },

  // Add tasks endpoints
  tasks: {
    all: '/api/tasks',
    create: '/api/tasks',
    update: (id) => `/api/tasks/${id}`,
    delete: (id) => `/api/tasks/${id}`,
    subtasks: {
      create: (taskId) => `/api/tasks/${taskId}/subtasks`,
      update: (id) => `/api/subtasks/${id}`,
      delete: (id) => `/api/subtasks/${id}`,
    },
    comments: {
      list: (taskId) => `/api/tasks/${taskId}/comments`,
      create: (taskId) => `/api/tasks/${taskId}/comments`,
      delete: (id) => `/api/comments/${id}`,
    },
  },
};

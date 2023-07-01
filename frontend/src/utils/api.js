import axios from 'axios';

// Define the base URL for your API
// const apiUrl = process.env.REACT_APP_LOCAL_API; // For local environment
const apiUrl = process.env.REACT_APP_LIVE_API; // For live environment

// Use the apiUrl variable to make API calls

let userId = null; // Set userId to null to avoid error

// API endpoints
const API_ENDPOINTS = {
  homepage: '/',
  // Auth endpoints
  login: '/auth/login',
  register: '/auth/register',
  logout: '/auth/logout',
  forgotPassword: '/auth/forgot_password',
  getCurrentUser: '/auth/current_user',
  // Admin endpoints
  getUsers: 'admin/users',
  approveUser: `admin/users/:userId/approve`,
  dissaproveUser: `admin/users/:userId/dissaprove`,
  promoteUser: `admin/users/:userId/promote`,
  demoteUser: `admin/users/:userId/demote`,
  deleteUser: `admin/users/:userId/delete`,
  // db endpoints
  createDive: '/db/dives/entries',
  createSighting: '/db/sightings/entries',
};

// Set the userId dynamically in the endpoint paths
const setUserId = (id) => {
  userId = id;
};

// Replace the userId placeholder in the endpoint paths with the actual userId
const replaceUserId = (path) => {
  return path.replace(':userId', userId);
};

const api = {
  // Login endpoint
  login: async (username, password) => {
    try {
      const response = await axios.post(`${apiUrl}${API_ENDPOINTS.login}`, {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Register endpoint
  register: async (username, email, password) => {
    try {
      const response = await axios.post(`${apiUrl}${API_ENDPOINTS.register}`, {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response;
      } else {
        throw error;
      }
    }
  },

  // Logout endpoint
  logout: async () => {
    try {
      const response = await axios.post(`${apiUrl}${API_ENDPOINTS.logout}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Forgot password endpoint
  forgotPassword: async (email) => {
    try {
      const response = await axios.post(`${apiUrl}${API_ENDPOINTS.forgotPassword}`, {
        email,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Create dive endpoint
  createDive: async (diveData) => {
    try {
      const response = await axios.post(`${apiUrl}${API_ENDPOINTS.createDive}`, diveData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Create sighting endpoint
  createSighting: async (sightingData) => {
    try {
      const response = await axios.post(`${apiUrl}${API_ENDPOINTS.createSighting}`, sightingData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

// Get current user endpoint
  getCurrentUser: async () => {
    try {
      const response = await axios.get(`${apiUrl}/auth/current_user`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Set userId endpoint
  setUserId,

  // Replace userId placeholder in endpoint paths with the actual userId
  updateEndpointPaths: () => {
    for (const key in API_ENDPOINTS) {
      API_ENDPOINTS[key] = replaceUserId(API_ENDPOINTS[key]);
    }
  }
};

export default api;
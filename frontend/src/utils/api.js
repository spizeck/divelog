/**
 * This file exports an api object that contains methods for interacting
 * with the backend server. Each method corresponds to a specific API endpoint
 * and returns the data from the server response. If an error occurs, it throws
 * the error data.
 *
 * All methods use the axios library to send HTTP requests. For GET and DELETE
 * requests, you can pass parameters directly. For POST and PUT requests, you should
 * pass an object containing the request body data.
 *
 * Usage:
 * 1. Import the api object into your file:
 *    import api from './api'
 * 2. Use the methods in the api object to make requests to the server:
 *    const response = await api.loginWithUsername(username, password)
 *    const user = await api.getCurrentUser(token)
 *
 * Here are some examples of how to use the api object methods:
 *
 * - To log in with a username and password:
 *   const response = await api.loginWithUsername('username', 'password')
 *   If successful, this returns the server's response data, which includes the user's token.
 *
 * - To get the current user's information:
 *   const user = await api.getCurrentUser('your-token-here')
 *   This returns the user's information.
 *
 * Remember to use try/catch to handle errors when you use these methods, as they throw errors.
 */

import axios from 'axios'

// Define the base URL for your API
const apiUrl = process.env.REACT_APP_LIVE_API

// Use the apiUrl variable to make API calls

let userId = null // Set userId to null to avoid error

// Create an axios instance with the base URL and headers
const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})

// Function to update the token in the Axios instance
const updateToken = token => {
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`
}

// API endpoints
const API_ENDPOINTS = {
  homepage: '/',
  // Auth endpoints
  login: '/auth/login',
  register: '/auth/register',
  logout: '/auth/logout',
  forgotPassword: '/auth/forgot_password',
  getCurrentUser: '/auth/current_user',
  updateUser: '/auth/update_user',
  preferences: '/auth/preferences',
  // Admin endpoints
  getUsers: 'admin/users',
  approveUser: `admin/users/:userId/approve`,
  disapproveUser: `admin/users/:userId/disapprove`,
  promoteUser: `admin/users/:userId/promote`,
  demoteUser: `admin/users/:userId/demote`,
  deleteUser: `admin/users/:userId/delete`,
  // db endpoints
  createDive: '/db/dives/entries',
  createSighting: '/db/sightings/entries',
  getDivesByDate: '/db/dives/bydate',
  getDivesByGuide: '/db/dives/byguide',
  editDive: '/db/dives/editDive',
  deleteDive: '/db/dives/deleteDive',
  getPages: '/db/dives/pages'
}

// Set the userId dynamically in the endpoint paths
const setUserId = id => {
  userId = id
}

// Replace the userId placeholder in the endpoint paths with the actual userId
const replaceUserId = path => {
  return path.replace(':userId', userId)
}

const api = {
  // Login endpoint
  loginWithUsername: async (username, password) => {
    try {
      const response = await axios.post(`${apiUrl}${API_ENDPOINTS.login}`, {
        username,
        password
      })

      updateToken(response.data.token)

      return response.data
    } catch (error) {
      throw error.response.data
    }
  },

  loginWithEmail: async (username, password) => {
    try {
      const response = await axios.post(`${apiUrl}${API_ENDPOINTS.login}`, {
        email: username,
        password
      })

      updateToken(response.data.token)

      return response.data
    } catch (error) {
      throw error.response.data
    }
  },

  // Register endpoint
  register: async (username, email, password, firstName, preferredUnits) => {
    try {
      const response = await axios.post(`${apiUrl}${API_ENDPOINTS.register}`, {
        username,
        email,
        password,
        firstName,
        preferredUnits
      })
      return response.data
    } catch (error) {
      if (error.response) {
        return error.response.data
      } else {
        throw error
      }
    }
  },

  // Logout endpoint
  logout: async () => {
    try {
      const response = await axios.post(`${apiUrl}${API_ENDPOINTS.logout}`)
      return response.data
    } catch (error) {
      throw error.response.data
    }
  },

  // Forgot password endpoint
  forgotPassword: async email => {
    try {
      const response = await axios.post(
        `${apiUrl}${API_ENDPOINTS.forgotPassword}`,
        {
          email
        }
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  },

  // Create dive endpoint
  createDive: async diveData => {
    try {
      const response = await axios.post(
        `${apiUrl}${API_ENDPOINTS.createDive}`,
        diveData
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  },

  // Create sighting endpoint
  createSighting: async sightingData => {
    try {
      const response = await axios.post(
        `${apiUrl}${API_ENDPOINTS.createSighting}`,
        sightingData
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  },

  // Get number of pages by different sort methods endpoint
  getPages: async (sortMethod, key) => {
    try {
      const response = await axios.get(`${apiUrl}${API_ENDPOINTS.getPages}`, {
        params: {
          sortMethod,
          key
        }
      })
      return response.data
    } catch (error) {
      throw error.response.data
    }
  },

  // Get dives by date endpoint
  getDivesByDate: async (startDate, endDate) => {
    try {
      const response = await axios.get(
        `${apiUrl}${API_ENDPOINTS.getDivesByDate}`,
        {
          params: {
            startDate,
            endDate
          }
        }
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  },

  // Get dives by guide endpoint
  getDivesByGuide: async (diveGuide, page) => {
    try {
      const response = await axios.get(
        `${apiUrl}${API_ENDPOINTS.getDivesByGuide}`,
        {
          params: {
            diveGuide,
            page
          }
        }
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  },

  // Edit dive endpoint
  editDive: async diveData => {
    try {
      const response = await axios.put(
        `${apiUrl}${API_ENDPOINTS.editDive}`,
        diveData
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  },

  // Delete dive endpoint
  deleteDive: async diveId => {
    try {
      const response = await axios.delete(
        `${apiUrl}${API_ENDPOINTS.deleteDive}`,
        {
          params: {
            diveId
          }
        }
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  },

  // Get current user endpoint
  getCurrentUser: async token => {
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.getCurrentUser}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('401')
      } else if (error.response && error.response.data.message) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error('An error occurred while fetching the current user')
      }
    }
  },

  // Update user endpoint
  updateUser: async (token, userData) => {
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.updateUser}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  },

  // Get user preferences endpoint
  getPreferences: async token => {
    try {
      const response = await axiosInstance.get(`${API_ENDPOINTS.preferences}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      throw error.response.data
    }
  },

  // Update user preferences endpoint
  updatePreferences: async (token, preferencesData) => {
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.preferences}`,
        preferencesData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  },

  setUserId,

  // Replace userId placeholder in endpoint paths with the actual userId
  updateEndpointPaths: () => {
    for (const key in API_ENDPOINTS) {
      API_ENDPOINTS[key] = replaceUserId(API_ENDPOINTS[key])
    }
  }
}

export default api

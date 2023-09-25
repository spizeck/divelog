/**
 * This module provides an 'api' interface for interacting with the backend server.
 * Each method within this interface maps to a specific server endpoint, returning
 * the respective response data. Should any issues arise, an error will be thrown.
 *
 * The methods rely on the axios library for making HTTP requests.
 * - For GET and DELETE requests: Pass parameters directly.
 * - For POST and PUT requests: Provide an object with the request body.
 *
 * Usage Example:
 *
 * 1. Incorporate the 'api' interface:
 *    import api from './api'
 *
 * 2. Employ the provided methods for server interactions:
 *    const userToken = await api.loginWithUsername('username', 'password');
 *    const userInfo = await api.getCurrentUser('your-token-here');
 *
 * Ensure to encompass these methods within try/catch blocks to manage potential errors.
 */

import axios from 'axios'

// Define the base URL for your API
const apiUrl = process.env.REACT_APP_LIVE_API

// Create an axios instance with the base URL and headers
const axiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 10000, // Set timeout to 10 seconds
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    handleApiError(error)
    return Promise.reject(error)
  }
)

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
  getDivesByDate: '/db/dives/by_date',
  getDivesByGuide: '/db/dives/by_guide',
  editDive: '/db/dives/edit_dive',
  deleteDive: '/db/dives/delete_dive',
  getPages: '/db/dives/pages',
  getSightingsForDive: '/db/sightings/for_dive'
}

let userId = null

// Set the userId dynamically in the endpoint paths
const setUserId = id => {
  userId = id
}

// Replace the userId placeholder in the endpoint paths with the actual userId
const replaceUserId = (path, userId) => {
  return path.replace(':userId', userId)
}

const handleApiError = error => {
  if (error.response) {
    const { status, data } = error.response

    switch (status) {
      case 400:
        throw new Error(data.message || 'Bad request')
      case 401:
        throw new Error(data.message || 'Unauthorized')
      case 403:
        throw new Error(data.message || 'Forbidden')
      case 404:
        throw new Error(data.message || 'Not found')
      case 409:
        throw new Error(data.message || 'Conflict')
      case 500:
        throw new Error(data.message || 'Internal server error')
      default:
        throw new Error(data.message || 'Unknown error')
    }
  } else if (error.request) {
    throw new Error('The request was made but no response was received.')
  } else {
    throw new Error(error.message)
  }
}

async function makeApiRequest (method, endpoint, data = null, params = null) {
  try {
    let response
    if (method === 'get') {
      response = await axiosInstance.get(endpoint, { params })
    } else if (method === 'post') {
      response = await axiosInstance.post(endpoint, data)
    } else if (method === 'put') {
      response = await axiosInstance.put(endpoint, data)
    } else if (method === 'delete') {
      response = await axiosInstance.delete(endpoint, { params })
    }
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

const api = {
  loginWithUsername: (username, password) =>
    makeApiRequest('post', API_ENDPOINTS.login, { username, password }),

  loginWithEmail: (email, password) =>
    makeApiRequest('post', API_ENDPOINTS.login, { email, password }),

  register: (username, email, password, firstName, preferredUnits) =>
    makeApiRequest('post', API_ENDPOINTS.register, {
      username,
      email,
      password,
      firstName,
      preferredUnits
    }),

  logout: () => makeApiRequest('post', API_ENDPOINTS.logout),

  forgotPassword: email =>
    makeApiRequest('post', API_ENDPOINTS.forgotPassword, { email }),

  createDive: diveData =>
    makeApiRequest('post', API_ENDPOINTS.createDive, diveData),

  createSighting: sightingData =>
    makeApiRequest('post', API_ENDPOINTS.createSighting, sightingData),

  getPages: (sortMethod, key) =>
    makeApiRequest('get', API_ENDPOINTS.getPages, null, {
      sortMethod,
      key
    }),

  getDivesByDate: (startDate, endDate) =>
    makeApiRequest('get', API_ENDPOINTS.getDivesByDate, null, {
      startDate,
      endDate
    }),

  getDivesByGuide: (diveGuide, page, entriesPerPage) =>
    makeApiRequest('get', API_ENDPOINTS.getDivesByGuide, null, {
      diveGuide,
      page,
      entriesPerPage
    }),

  editDive: diveData => makeApiRequest('put', API_ENDPOINTS.editDive, diveData),

  deleteDive: diveId =>
    makeApiRequest('delete', API_ENDPOINTS.deleteDive, null, {
      diveId
    }),

  getSightingsForDive: diveId =>
    makeApiRequest('get', API_ENDPOINTS.getSightingsForDive, null, {
      diveId
    }),

  getCurrentUser: () => makeApiRequest('get', API_ENDPOINTS.getCurrentUser),

  updateUser: userData =>
    makeApiRequest('put', API_ENDPOINTS.updateUser, userData),

  getPreferences: () => makeApiRequest('get', API_ENDPOINTS.preferences),

  updatePreferences: preferencesData =>
    makeApiRequest('put', API_ENDPOINTS.preferences, preferencesData),

  approveUser: userId => {
    if (!userId) throw new Error('User ID is required')
    const endpoint = API_ENDPOINTS.approveUser.replace(':userId', userId)
    return makeApiRequest('put', endpoint)
  },

  disapproveUser: userId => {
    if (!userId) throw new Error('User ID is required')
    const endpoint = API_ENDPOINTS.disapproveUser.replace(':userId', userId)
    return makeApiRequest('put', endpoint)
  },

  promoteUser: userId => {
    if (!userId) throw new Error('User ID is required')
    const endpoint = replaceUserId(API_ENDPOINTS.promoteUser, userId)
    return makeApiRequest('put', endpoint)
  },

  demoteUser: userId => {
    if (!userId) throw new Error('User ID is required')
    const endpoint = replaceUserId(API_ENDPOINTS.demoteUser, userId)
    return makeApiRequest('put', endpoint)
  },

  deleteUser: userId => {
    if (!userId) throw new Error('User ID is required')
    const endpoint = replaceUserId(API_ENDPOINTS.deleteUser, userId)
    return makeApiRequest('delete', endpoint)
  },

  setUserId
}

export default api

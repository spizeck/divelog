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

type Method = 'get' | 'post' | 'put' | 'delete'

interface UserCredentials {
  username?: string
  email?: string
  password: string
  firstName?: string
  preferredUnits?: string
}

interface DiveData {
  date: string
  diveNumber: number
  diveGuide: string
  diveSite: string
  maxDepth: number
  waterTemp: number
}

interface SightingsData {
  sightings: {
    [key: string]: number
  }
}

// Define the base URL for your API
const apiUrl: string = process.env.REACT_APP_LIVE_API

// Use the apiUrl variable to make API calls
let userId: number | null = null 

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
  getDivesByDate: '/db/dives/by_date',
  getDivesByGuide: '/db/dives/by_guide',
  editDive: '/db/dives/edit_dive',
  deleteDive: '/db/dives/delete_dive',
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

const handleApiError = error => {
  if (error.response) {
    // If the server responded with a status other than 2xx range
    // Use error message from server if available or default to statusText
    const message = error.response.data.message || error.response.statusText
    throw new Error(message)
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error('The request was made but no response was received.')
  } else {
    // If there was an error setting up the request.
    throw new Error(error.message)
  }
}

async function makeApiRequest<T>(
  method: Method,
  endpoint: string,
  data?: T,
  params?: Record<string, any>
): Promise<any> {
  try {
    const response = await axiosInstance({
      method,
      url: params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint,
      data
    })
    return response.data
  } catch (error) {
    handleApiError(error)
    throw error
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

  getDivesByGuide: (diveGuide, page) =>
    makeApiRequest('get', API_ENDPOINTS.getDivesByGuide, null, {
      diveGuide,
      page
    }),

  editDive: diveData => makeApiRequest('put', API_ENDPOINTS.editDive, diveData),

  deleteDive: diveId =>
    makeApiRequest('delete', API_ENDPOINTS.deleteDive, null, {
      diveId
    }),

  getCurrentUser: () => makeApiRequest('get', API_ENDPOINTS.getCurrentUser),

  updateUser: userData =>
    makeApiRequest('put', API_ENDPOINTS.updateUser, userData),

  getPreferences: () => makeApiRequest('get', API_ENDPOINTS.preferences),

  updatePreferences: preferencesData =>
    makeApiRequest('put', API_ENDPOINTS.preferences, preferencesData),

  setUserId
}

export default api

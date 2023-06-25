import axios from 'axios';

// Define the base URL for your API
const BASE_URL = 'http://localhost:5000/';

let userId = null; // Set userId to null to avoid error

// API endpoints
const API_ENDPOINTS = {
    // Home endpoint
    home: '/',
    // Auth endpoints
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    forgotPassword: '/auth/forgot_password',
    // Admin endpoints
    getUsers: 'admin/users',
    approveUser: `admin/users/${userId}/approve`,
    dissaproveUser: `admin/users/${userId}/dissaprove`,
    promoteUser: `admin/users/${userId}/promote`,
    demoteUser: `admin/users/${userId}/demote`,
    deleteUser: `admin/users/${userId}/delete`,
    // db endpoints
    createDive: '/db/dives/entries',
    createSighting: '/db/sightings/entries',
};

// Set the userId dynamically before each request
const setUserId = (id) => {
    userId = id;
};

const api = {
    // Login endpoint
    login: async (username, password) => {
        try {
            const response = await axios.post(`${BASE_URL}${API_ENDPOINTS.login}`, {
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
            const response = await axios.post(`${BASE_URL}${API_ENDPOINTS.register}`, {
                username,
                email,
                password,
            });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },

    // Logout endpoint
    logout: async () => {
        try {
            const response = await axios.post(`${BASE_URL}${API_ENDPOINTS.logout}`);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },

    // Forgot password endpoint
    forgotPassword: async (email) => {
        try {
            const response = await axios.post(`${BASE_URL}${API_ENDPOINTS.forgotPassword}`, {
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
            const response = await axios.post(`${BASE_URL}${API_ENDPOINTS.createDive}`, diveData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },

    // Create sighting endpoint
    createSighting: async (sightingData) => {
        try {
            const response = await axios.post(`${BASE_URL}${API_ENDPOINTS.createSighting}`, sightingData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },

    // Set userId endpoint
    setUserId,
};

export default api;

// Path: frontend\src\utils\auth.js
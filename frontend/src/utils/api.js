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
    createDive: '/dives/entries',
    createSighting: '/sightings/entries',
};

// Login endpoint
export const login = async (username, password) => {
    try {
        const response = await axios.post(`${BASE_URL}${API_ENDPOINTS.login}`, {
            username,
            password,
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Register endpoint
export const register = async (username, email, password) => {
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
};

// Logout endpoint
export const logout = async () => {
    try {
        const response = await axios.post(`${BASE_URL}${API_ENDPOINTS.logout}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Forgot password endpoint
export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${BASE_URL}${API_ENDPOINTS.forgotPassword}`, {
            email,
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Create dive endpoint
export const createDive = async (diveData) => {
    try {
        const response = await axios.post(`${BASE_URL}${API_ENDPOINTS.createDive}`, diveData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Create sighting endpoint
export const createSighting = async (sightingData) => {
    try {
        const response = await axios.post(`${BASE_URL}${API_ENDPOINTS.createSighting}`, sightingData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Add more endpoint functions here


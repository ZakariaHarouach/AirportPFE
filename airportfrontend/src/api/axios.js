import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8000/api', // Your Laravel backend
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
     }
});

// Attach token automatically if exists
API.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5162/amsac/v1/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptores (opcional) para añadir el token JWT automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Obtén el token del localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
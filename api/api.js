import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5162/amsac/v1",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

// Interceptor para adjuntar el token en cada petición
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;

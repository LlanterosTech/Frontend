import axios from 'axios';

const api = axios.create({
    baseURL: 'http://198.150.0.223:5162/amsac/v1',
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});
axios.defaults.timeout = 60000; // 60 segundos

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // Si hay un error 401 (No autorizado) intenta renovar el token.
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');

                const { data } = await api.post('/authentication/refresh-token', { refreshToken });

                localStorage.setItem('token', data.token);
                localStorage.setItem('refreshToken', data.refreshToken);

                api.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;

                return api(originalRequest);
            } catch (refreshError) {
                // Si falla la renovación, redirigir al login.
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

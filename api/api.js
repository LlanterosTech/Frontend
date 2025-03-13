import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5162/amsac/v1',
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});
axios.defaults.timeout = 60000; 

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

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');

                if (!refreshToken) {
                    console.log("⚠️ No hay refreshToken, redirigiendo al login.");
                    localStorage.clear();
                    this.$router.push('/login');  // 🔥 Usa Vue Router en lugar de window.location.href
                    return Promise.reject(error);
                }

                const { data } = await api.post('/authentication/refresh-token', { refreshToken });

                localStorage.setItem('token', data.token);
                localStorage.setItem('refreshToken', data.refreshToken);

                api.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;

                return api(originalRequest);
            } catch (refreshError) {
                console.log("❌ Error refrescando el token, cerrando sesión.");
                localStorage.clear();
                this.$router.push('/login');  // 🔥 Usa Vue Router para evitar recarga
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

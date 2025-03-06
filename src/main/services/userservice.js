import api from "@/../api/api";

const userService = {
    async registerUser(userData) {
        try {
            const response = await api.post("/authentication/sign-up", userData);
            return response.data; 
        } catch (error) {
            console.error("Error registering user:", error);
            throw error.response ? error.response.data : "Error de red o del servidor";
        }
    },
    async loginUser(credentials) {
        try {
            console.log("🔹 Enviando solicitud de login con:", credentials);
    
            const response = await api.post("/authentication/sign-in", credentials);
            console.log(" Respuesta completa de loginUser:", response);
    
            if (!response || !response.data || !response.data.resource || !response.data.resource.token) {
                throw new Error(" No se recibió un token válido.");
            }
    
            localStorage.setItem("token", response.data.resource.token);
            localStorage.setItem("refreshToken", response.data.refreshToken || "");
            localStorage.setItem("idUser", response.data.resource.id);
    
            console.log(" Tokens guardados correctamente en localStorage.");
            return response.data;
        } catch (error) {
            console.error(" Error en loginUser:", error);
    
            if (error.response) {
                console.error(" Respuesta del servidor:", error.response.data);
                console.error(" Código de estado:", error.response.status);
            } else if (error.request) {
                console.error(" No se recibió respuesta. Request:", error.request);
            } else {
                console.error(" Error inesperado:", error.message);
            }
    
            throw error.response ? error.response.data : "Error de red o del servidor";
        }
    },
    
    
    
    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem("token");
    
            if (!refreshToken) {
                console.warn(" No hay refreshToken disponible en localStorage.");
                throw new Error("No refresh token available");
            }
    
            console.log(" Enviando solicitud para refrescar token...");
            const response = await api.post("/authentication/refresh-token", { refreshToken });
    
            console.log("Token refrescado correctamente:", response.data);
    
            localStorage.setItem("token", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
    
            return response.data.accessToken;
        } catch (error) {
            console.error(" Error al refrescar el token:", error);
            throw error.response ? error.response.data : "Error de red o del servidor";
        }
    }
    ,
    async logoutUser() {
        try {
            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
                await api.post("/authentication/sign-out", { refreshToken });
            }

            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("idUser");
        } catch (error) {
            console.error("Error logging out:", error);
            throw error.response ? error.response.data : "Error de red o del servidor";
        }
    },
    async getAuthUser(userId) {
        try {
            const response = await api.get(`/auth-user/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error logging in:", error);
            throw error.response ? error.response.data : "Error de red o del servidor";
        }
    },
};

export default userService;
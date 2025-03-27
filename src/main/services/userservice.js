import api from "@/../api/api";

const userService = {
    // 🔹 REGISTRO DE USUARIO
    async registerUser(userData) {
        try {
            const response = await api.post("/authentication/sign-up", userData);
            return response.data; 
        } catch (error) {
            console.error("Error registering user:", error);
            throw error.response ? error.response.data : "Error de red o del servidor";
        }
    },

    // 🔹 LOGIN DE USUARIO (SE USA HttpOnly COOKIE)
    async loginUser(credentials) {
        try {
            const response = await api.post("/authentication/sign-in", credentials,{ withCredentials: true });
            return response;  // 🔥 RETORNAR la respuesta completa
        } catch (error) {
            console.error("❌ Error en loginUser:", error);
            throw error;  // 🔥 Re-lanzar el error para que lo capture `handleLogin`
        }
    },
    
    // 🔹 REFRESCAR TOKEN (SE USA HttpOnly COOKIE)
    async refreshToken() {
        try {
            console.log("🔄 Enviando solicitud para refrescar token...");
            const response = await api.post("/authentication/refresh-token", {}, { withCredentials: true });

            console.log("✅ Token refrescado correctamente.");
            return response.data.accessToken;
        } catch (error) {
            console.error("❌ Error al refrescar el token:", error);
            throw error.response ? error.response.data : "Error de red o del servidor";
        }
    },

    async getAuthUser(userId) {
        try {
            const response = await api.get(`/auth-user/${userId}`);
            return response.data;
        } catch (error) {
            console.error("❌ Error obteniendo usuario por ID:", error);
            throw error.response ? error.response.data : "Error de red o del servidor";
        }
    },

    // 🔹 LOGOUT DEL USUARIO (ELIMINA COOKIES)
    async logoutUser() {
        try {
            await api.post("/authentication/sign-out", {}, { withCredentials: true });
            console.log("✅ Sesión cerrada correctamente.");
        } catch (error) {
            console.error("❌ Error en logoutUser:", error);
            throw error.response ? error.response.data : "Error de red o del servidor";
        }
    },

    // 🔹 OBTENER INFORMACIÓN DEL USUARIO (USA HttpOnly COOKIES)
    async getInfoUser() {
        try {
            console.log("🔍 Haciendo petición a /auth-user/me...");
            const response = await api.get("/auth-user/me", {
                withCredentials: true,
                skipAuthInterceptor: true, // Bandera personalizada
            });
            console.log("✅ Usuario obtenido correctamente:", response.data);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.warn("⚠️ Usuario no autenticado o token expirado.");
                return null; // Devuelve null si no está autenticado
            }
            console.error("❌ Error obteniendo usuario:", error);
            throw error; // Lanza otros errores
        }
    }
      
};

export default userService;

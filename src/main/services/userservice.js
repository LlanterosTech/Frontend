import api from "@/../api/api";

const userService = {
    async registerUser(userData) {
        try {
            const response = await api.post("/authentication/sign-up", userData);
            return response.data; // Retorna los datos de la respuesta si es exitoso
        } catch (error) {
            console.error("Error registering user:", error);
            throw error.response ? error.response.data : "Error de red o del servidor";
        }
    },

    async loginUser(credentials) {
        try {
            const response = await api.post("/authentication/sign-in", credentials);
            localStorage.setItem("token", response.data.token); // Guarda el token en el localStorage
            localStorage.setItem("idUser", response.id);
            return response.data;
        } catch (error) {
            console.error("Error logging in:", error);
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
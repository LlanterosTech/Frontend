<template>
    <div class="container">
        <h1>¡Hola Mundo! 🌍</h1>
        <p>Esta es una vista de prueba para verificar el enrutamiento en Vue.</p>
        <p v-if="isAdmin">👑 Eres un Administrador</p>
        <p v-else>🔹 Eres un Usuario normal</p>
        <router-link to="/">Volver al Inicio</router-link>
    </div>
</template>

<script>
import userService from '@/main/services/userservice';

export default {
    data() {
        return {
            isAuthenticated: false,
            userRole: null, // 🔥 Guarda el rol del usuario aquí
        };
    },
    name: "HelloWorld",
    computed: {
        isAdmin() {
            return this.userRole === "Admin"; // ✅ Verificación limpia
        }
    },
    async created() {
        try {
            const user = await userService.getInfoUser(); // 🔥 Obtiene usuario desde la API
            if (user) {
                this.isAuthenticated = true;
                this.userRole = user.role; // ✅ Almacena el rol del usuario
            } else {
                this.isAuthenticated = false;
                this.userRole = "User"; // ❌ Si hay error, asume "User"
            }
        } catch (error) {
            console.error("Error obteniendo usuario:", error);
            this.isAuthenticated = false;
            this.userRole = "User"; // ❌ Asume "User" en caso de error
        }
    }
};
</script>

<style scoped>
.container {
    text-align: center;
    margin-top: 50px;
}
h1 {
    color: #42b983;
}
</style>

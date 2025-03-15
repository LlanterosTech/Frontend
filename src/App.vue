<template>
  <div>
    <div class="header">
      <div class="logo">
        <img src="@/assets/Logo AMSAC - BLANCO 2023.png" alt="Logo" />
      </div>
    </div>
    <LogoutButton v-if="showLogoutButton" />
    <router-view />
  </div>
</template>

<script>
import { startInactivityTimer } from './utils/auth.js';
import userService from './main/services/userservice.js';
import LogoutButton from './components/logout-button.vue';
export default {
  components: {
    LogoutButton
  },
  data() {
    return {
      isAuthenticated: false
    }
  },
  computed: {
    showLogoutButton() {
      const noLogoutRoutes = ["/login", "/register"];
      return this.isAuthenticated && !noLogoutRoutes.includes(this.$route.path);
    }
  },
  async created() {
    try {
      const user = await userService.getInfoUser(); // 🔥 Obtiene usuario desde la API
      if (user) {
        this.isAuthenticated = true;
        startInactivityTimer(userService.logoutUser); // Iniciar temporizador de inactividad
      } else {
        this.isAuthenticated = false;
      }
    } catch (error) {
      console.error("Error verificando autenticación:", error);
      this.isAuthenticated = false;
    }
  }
};
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
#app {
  width: 90%;
  max-width: 1200px;
  min-width: 360px;
  margin: auto;
  min-height: 100vh; 
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Estilo para el encabezado con el logo */
.header {
  position: absolute;
  top: 20px;
  left: 20px;
}

.logo img {
  width: 100px; /* Ajusta el tamaño del logo */
  height: auto;
}
</style>
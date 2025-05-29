<template>
  <div>

    <!-- Mostrar el botón de logout solo si la autenticación está verificada -->
    <!-- En tu App.vue -->
    <LogoutButton :visible="showLogoutButton" :disabled="isLoading || !isAuthenticated" />
    <Side-bar
        v-if="showLogoutButton"
        :userName="userName"
        :isExpanded="isSidebarExpanded"
        @toggle="toggleSidebar"
    />
    <router-view />
  </div>
</template>

<script>
import LogoutButton from './components/logout-button.vue';
import userService from "@/main/services/userservice";
import SideBar from "@/components/sidebar.vue";

export default {
  components: {
    SideBar,
    LogoutButton,
  },
  data() {
    return {
      isAuthenticated: false, // Inicialmente asumimos que el usuario no está autenticado
      isLoading: true, // Estado de carga para verificar autenticación
      isSidebarExpanded: false, // Agrega esta línea
      userName: "",
    };
  },
  computed: {
    showLogoutButton() {
      const noLogoutRoutes = ["/login", "/register"];
      return this.isAuthenticated && !noLogoutRoutes.includes(this.$route.path);
    }
  },
  methods: {
    toggleSidebar() {
      this.isSidebarExpanded = !this.isSidebarExpanded;
    }
  },
  async created() {
    try {
      // Verificar si el usuario está autenticado
      const user = await userService.getInfoUser(); // Llama al servicio para obtener información del usuario
      this.isAuthenticated = !!user; // Si hay un usuario, está autenticado
      this.userName = user ? user.name : ""; // Asigna el nombre del usuario si está autenticado
    } catch (error) {
      console.error("Error verificando autenticación:", error);
      this.isAuthenticated = false; // Si hay un error, asumimos que no está autenticado
    } finally {
      this.isLoading = false; // Finaliza la carga después de verificar
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

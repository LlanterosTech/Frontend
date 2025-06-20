<template>
  <div>
 <HeaderComponent
      v-if="showComps"
      :visible="showComps"
      :disabled="isLoading || !isAuthenticated"
    />
     <SideBarComponent
      v-if="showComps"
      :visible="showComps"
      :disabled="isLoading || !isAuthenticated"
    /> 
    <LogoutButton :visible="showLogoutButton" :disabled="isLoading || !isAuthenticated" />
    <router-view />
  </div>
</template>

<script>
import LogoutButton from './components/logout-button.vue';
import userService from "@/main/services/userservice"; // Asegúrate de que este servicio exista
import HeaderComponent from "@/components/headerComponent.vue";
import SideBarComponent from './components/sideBarComponent.vue';
export default {
  components: {
    LogoutButton,
    HeaderComponent,
    SideBarComponent
  },
  data() {
    return {
      isAuthenticated: false, // Inicialmente asumimos que el usuario no está autenticado
      isLoading: true // Estado de carga para verificar autenticación
    };
  },
  computed: {
    showLogoutButton() {
      const noLogoutRoutes = ["/login", "/register"];
      return this.isAuthenticated && !noLogoutRoutes.includes(this.$route.path);
    },
    showComps() {
      const noHeaderRoutes = ["/","/login", "/register"];
      return this.isAuthenticated && !noHeaderRoutes.includes(this.$route.path);
    }
  },
  async created() {
    try {
      // Verificar si el usuario está autenticado
      const user = await userService.getInfoUser(); // Llama al servicio para obtener información del usuario
      this.isAuthenticated = !!user; // Si hay un usuario, está autenticado
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
<template>
  <div>
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
  computed: {
    showLogoutButton() {
      const noLogoutRoutes = ["/login", "/register"];
      return !noLogoutRoutes.includes(this.$route.path);
    }
  },
  created() {
    if (localStorage.getItem('token')) {
      startInactivityTimer(userService.logoutUser); // Iniciar el temporizador
    }
  }
};
</script>

<style>
/* Estilos globales opcionales */
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>
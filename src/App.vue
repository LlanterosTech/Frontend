<template>
  <div>
    <router-view />
  </div>
</template>

<script>
import { startInactivityTimer, logoutUser } from './utils/auth.js';

export default {
  created() {
    if (localStorage.getItem('userToken')) {
      startInactivityTimer(logoutUser); // Iniciar el temporizador
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
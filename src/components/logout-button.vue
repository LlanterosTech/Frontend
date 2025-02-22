<template>
  <button @click="logout" class="logout-btn">
    <i class="fas fa-sign-out-alt"></i>
  </button>
</template>

<script>
import userService from "@/main/services/userservice";

export default {
  methods: {
    async logout() {
      try {
        await userService.logoutUser();
        this.$router.push("/login");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    }
  }
};
</script>

<style scoped>
.logout-btn {
  position: fixed; /* Cambiado a fixed para que esté siempre visible */
  top: 20px;
  right: 20px;
  padding: 10px;
  color: white;
  font-size: 1.5rem;
  background: #fa0202;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s;
  z-index: 1000; /* Asegúrate de que el botón esté por encima de otros elementos */
}

.logout-btn:hover {
  transform: scale(1.1);
}

.logout-btn i {
  margin: 0;
}
</style>
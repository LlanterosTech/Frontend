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
  position: fixed; 
  top: 20px;
  right: 20px;
  padding: 10px;
  color: #fa0202;
  font-size: 1.5rem;
  background: #fff6f6;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s;
  z-index: 1000; 
}

.logout-btn:hover {
  transform: scale(1.1);
}

.logout-btn i {
  margin: 0;
}
</style>
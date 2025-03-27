<template>
  <div class="page-container">
    <login-form />
    <!-- Incrustar el PDF del manual de usuario -->
    <div class="manual-container">
      <iframe
        src="@/assets/manual.pdf"
        class="manual-frame"
        frameborder="0"
        title="Manual de Usuario"
      ></iframe>
    </div>
  </div>
</template>

<script>
import LoginForm from "@/components/login-form.vue";

export default {
  components: { LoginForm },
};
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.manual-container {
  margin-top: 20px;
  width: 80%;
  height: 400px; /* Ajusta la altura según sea necesario */
}

.manual-frame {
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
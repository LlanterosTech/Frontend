<template>
  <div class="page-container">
    <login-form />
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
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
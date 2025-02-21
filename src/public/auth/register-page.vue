<template>
  <div class="page-container">
    <register-form />
  </div>
</template>

<script>
import RegisterForm from "@/components/register-form.vue";

export default {
  components: { RegisterForm }
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
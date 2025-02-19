<script>

import LoginPage from "@/public/auth/login-page.vue";

export default {
  name: "MainContainer",
  components: {LoginPage},
  data() {
    return {
    };
  },
};

</script>

<template>
  <body>
  <login-page></login-page>
  <router-view></router-view>
  </body>

</template>

<style scoped>
body{
  margin: 0;
  padding:0;
  height: auto;
  overflow: hidden;

}
</style>

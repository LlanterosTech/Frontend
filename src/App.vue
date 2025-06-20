<template>
  <div id="app" v-if="!isLoading">
    <HeaderComponent v-if="showComps" />
    <SideBarComponent v-if="showComps" />
    <div :class="{ 'main-content': showComps }">
      <router-view />
    </div>
    <LogoutButton v-if="showLogoutButton" />
  </div>
</template>


<script>
import HeaderComponent from "@/components/headerComponent.vue";
import SideBarComponent from "@/components/sideBarComponent.vue";
import LogoutButton from "@/components/logout-button.vue";
import userService from "@/main/services/userservice";

export default {
  components: {
    HeaderComponent,
    SideBarComponent,
    LogoutButton
  },
  data() {
    return {
      isAuthenticated: false,
      isLoading: true
    };
  },
  computed: {
    showLogoutButton() {
      return this.isAuthenticated && !["/login", "/register"].includes(this.$route.path);
    },
    showComps() {
      return this.isAuthenticated && !["/", "/login", "/register"].includes(this.$route.path);
    }
  },
  async created() {
    try {
      const user = await userService.getInfoUser();
      this.isAuthenticated = !!user;
    } catch (error) {
      this.isAuthenticated = false;
    } finally {
      this.isLoading = false;
    }
  }
};
</script>

<style>
:root {
  --header-height: 80px;
  --sidebar-width: 60px;
}

body {
  margin: 0;
  font-family: 'Arial', sans-serif;
}

#app {
  min-height: 100vh;
}

/* Este div contiene todo lo que está debajo del header */
.main-content {
  margin-top: var(--header-height);
  margin-left: var(--sidebar-width);
  padding: 2rem;
  box-sizing: border-box;
}
</style>

<script>

export default {
  name: "Side-bar",
  props: {
    userName: {
      type: String,
      required: true,
    },
    isExpanded: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      isAuthenticated: false,
      isLoading: true,
      isSidebarExpanded: false,

    };
  },
};

</script>

<template>
  <div class="sidebar" :class="{ expanded: isExpanded }">
    <button class="toggle-btn" @click="$emit('toggle')">
      <i :class="isExpanded ? 'fas fa-chevron-left' : 'fas fa-bars'"></i>
    </button>

    <div class="sidebar-profile" v-if="userName">
      <i class="fas fa-user-circle"></i>
      <p>{{ userName || 'Invitado' }}</p>
    </div>

    <ul>
      <li><i class="fas fa-cog"></i> <span>Configuración</span></li>
      <li><i class="fas fa-seedling"></i> <span>Ver mis plantas</span></li>
      <li>
        <router-link to="/see-my-devices">
          <i class="fas fa-microchip"></i> <span>Ver mis dispositivos</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 61px; /* igual a la altura del header */
  left: 0;
  width: 60px;
  height: calc(100vh - 70px);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(6px);
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  transition: width 0.3s ease;
  overflow-x: hidden;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
}

.sidebar.expanded {
  width: 220px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin-top: 24px;
  width: 100%;
}

.sidebar li {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 16px;
  font-weight: 600;
  color: #333;
  transition: background 0.3s ease;
  cursor: pointer;
}

.sidebar li span {
  display: none;
}

.sidebar.expanded li span {
  display: inline;
}

.toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 24px;
  align-self: flex-end;
  margin-right: 10px;
}

.sidebar li:hover {
  background-color: rgba(106, 170, 41, 0.1);
}

.sidebar-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  width: 100%;
}

.sidebar-profile i {
  font-size: 2rem;
  color: #333;
}

.sidebar-profile p {
  margin-top: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sidebar.expanded .sidebar-profile i {
  font-size: 2.4rem;
}

.sidebar.expanded .sidebar-profile p {
  opacity: 1;
}

.sidebar li i {
  font-size: 1.2rem;
  min-width: 24px;
}

.sidebar li span {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.sidebar.expanded li span {
  opacity: 1;
}

.sidebar a {
  color: inherit;
  text-decoration: none;
  display: flex;
  align-items: center;
  width: 100%;
}

</style>
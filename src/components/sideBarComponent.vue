<template>
  <div class="sidebar" :class="{ expanded: isSidebarExpanded }">
    <button class="toggle-btn" @click="toggleSidebar">
      <i :class="isSidebarExpanded ? 'fas fa-chevron-left' : 'fas fa-bars'"></i>
    </button>
    <ul>
     <li @click="goToInit">
        <i class="fas fa-home"></i>
        <span>Inicio</span>
      </li>
      <li @click="goToSetting">
        <i class="fas fa-cog"></i>
        <span>Configuración</span>
      </li>
      <li @click="goToMyPlants">
        <i class="fas fa-seedling"></i>
        <span>Ver mis plantas</span>
      </li>
      <li @click="goToMyDevices">
        <i class="fas fa-microchip"></i>
        <span>Ver mis dispositivos</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "SideBarComponent",
  props: {
    expanded: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isSidebarExpanded: this.expanded
    };
  },
  watch: {
    expanded(val) {
      this.isSidebarExpanded = val;
    }
  },
  methods: {
    toggleSidebar() {
      this.isSidebarExpanded = !this.isSidebarExpanded;
      this.$emit('update:expanded', this.isSidebarExpanded);
    },
    goToInit() {
      this.$router.push("/init");
    },
    goToMyPlants() {
      this.$router.push("/my-plants");
    },
    goToMyDevices() {
      this.$router.push("/devices");
    },
    goToSetting() {
      this.$router.push("/settings");
    }
  }
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 170px;
  left: 0;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(6px);
  padding: 20px 10px;
  width: 60px;
  height: auto;
  border-radius: 0 12px 12px 0;
  box-shadow: 4px 4px 12px rgba(0,0,0,0.1);
  z-index: 2;
  transition: width 0.3s ease;
  overflow: hidden;
}

.sidebar.expanded {
  width: 200px;
}

.sidebar ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sidebar li {
  margin-bottom: 18px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.3s ease;
  cursor: pointer;
  white-space: nowrap;
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
  margin-bottom: 20px;
  font-size: 1.2rem;
  color: #333;
}

.sidebar li:hover {
  background: rgba(130, 180, 120, 0.3);
}
</style>
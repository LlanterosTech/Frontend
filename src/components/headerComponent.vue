<template>
  <header class="header">
    <div class="logo">
      <img src="@/assets/logo_png.png" alt="Logo Plantita" />
    </div>
    <nav class="nav-links">
      <a href="#">Acerca de nosotros</a>
      <a href="#">Catálogo</a>
    </nav>
    <div class="user-icon" @click="$emit('user-click')">
      <i class="fas fa-user-circle"></i>
    </div>
  </header>
</template>

<script>
export default {
  name: "HeaderComponent"
};
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
  padding: 16px 24px; /* agrega espacio arriba y abajo */
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #2a7028;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  padding: 0 24px;
  z-index: 100;
  box-sizing: border-box;
}



.logo img {
  width: 80px;
  height: auto;
  display: block;
padding-top: 10px;
  padding-bottom: 10px;
}

.nav-links {
  display: flex;
  gap: 32px;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  color: #fff;
  font-weight: 600;
  background: transparent;
  padding: 6px 14px;
  border-radius: 8px;
  transition: background 0.3s, color 0.3s;
}

.nav-links a:hover {
  background-color: rgba(255,255,255,0.15);
  color: #222;
}

.user-icon {
  font-size: 36px;
  color: #fff;
  cursor: pointer;
  margin-left: 16px;
}

.user-icon i {
  transition: transform 0.3s;
}

.user-icon i:hover {
  transform: scale(1.15);
}

/* Responsive */
@media (max-width: 700px) {
  .header {
    flex-direction: column;
    height: auto;
    padding: 12px 8px;
    align-items: flex-start;
  }
  .logo img {
    width: 60px;
  }
  .nav-links {
    gap: 16px;
    margin: 8px 0;
  }
  .user-icon {
    font-size: 28px;
    margin-left: 0;
    align-self: flex-end;
  }
}
</style>
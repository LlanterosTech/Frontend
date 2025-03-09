<template>
  <div class="container fondo">
    <div class="header">
      <div class="logo">
        <img src="@/assets/Logo AMSAC - BLANCO 2023.png" alt="Logo" />
      </div>
    </div>

    <div class="glass-box">
      <h1 class="title">Bienvenidos</h1>
      <div class="options">
        <div class="option" @click="irCalculadora">
          <i  class="fas fa-calculator icono-opcion"></i>
          <p>Calculador</p>
        </div>
        <div class="option" @click="irHistorial">
          <i class="fas fa-history icono-opcion"></i>
          <p>Historial</p>
        </div>
        <div class="option" @click="irBiblioteca">
          <i class="fas fa-book icono-opcion"></i>
          <p>Biblioteca</p>
        </div>
      </div>
    </div>

    <footer class="footer">
      © Todos los derechos reservados por Activos Mineros SAC - AMSAC
    </footer>
  </div>
</template>

<script>
export default {
  methods: {
    irCalculadora() {
      this.$router.push("/nuevaestimacion");
    },
    irHistorial() {
      this.$router.push("/historial-estimaciones");
    },
    irBiblioteca() {
      this.$router.push("/buscar-estimacion");
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");

body, html {
  margin: 0;
  padding: 0;
  font-family: "Poppins", sans-serif;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fondo {
  background: url("@/assets/Pag 37 Proyecto Calioc y Chacrapuquio en Junín.jpg") no-repeat center center fixed;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  position: relative;
}

/* Estilo para el encabezado con el logo */
.header {
  position: absolute;
  top: 20px;
  left: 20px;
}

.logo img {
  width: 100px; /* Ajusta el tamaño del logo */
  height: auto;
}

/* Caja de bienvenida con fondo difuminado */
.glass-box {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.title {
  font-size: 2.5rem;
  font-weight: 600;
  color: white;
}

.options {
  display: flex;
  gap: 20px;
  margin-top: 30px;
}

.option {
  background: white;
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
}

.icono-opcion {
  font-size: 3rem; /* Cambia el tamaño */
  color: #3ea845; /* Cambia el color */
}


.option p {
  font-size: 1rem;
  font-weight: bold;
  color: #3ea845;
}

.option:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.8);
}

/* Pie de página */
.footer {
  position: absolute;
  bottom: 20px;
  font-size: 0.9rem;
  color: white;
  text-align: center;
}
</style>

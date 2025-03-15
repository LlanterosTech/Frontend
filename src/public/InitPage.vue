<template>
  <div class="container fondo">
    <div class="header">
      <div class="logo">
        <img src="@/assets/Logo AMSAC - BLANCO 2023.png" alt="Logo" />
      </div>
    </div>

    <div class="glass-box">
      <h1 class="title">Bienvenido, {{ userName }}</h1>
      <div class="options">
        <div class="option" @click="irCalculadora">
          <i class="fas fa-calculator icono-opcion"></i>
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
import userService from "@/main/services/userservice";

export default {
  data() {
    return {
      userName: "",
    };
  },
  async created() {
    await this.loadUserData(); // Llama a la función al crear el componente
  },
  methods: {
    async loadUserData() {
      try {
        const user = await userService.getInfoUser(); // Llama al servicio de usuario
        if (user) {
          this.userName = user.name; // Asigna el nombre del usuario
        } else {
          console.warn("⚠️ No se encontró un usuario autenticado.");
          this.$router.push('/login'); // Redirige si no hay usuario autenticado
        }
      } catch (error) {
        console.error("❌ Error obteniendo usuario:", error);
        this.userName = "Usuario";
        this.$router.push('/login'); // Redirige en caso de error
      }
    },
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
 max-width: 700px; /* Ajusta según sea necesario */
  width: 90%;
  text-align: center;
}

.title {
  font-size: 2.5rem;
  font-weight: 600;
  color: white;
  max-width: 90%; /* Permite que el título ocupe más espacio */
  text-align: center; /* Centra el texto */
  word-wrap: break-word; /* Permite dividir el texto en varias líneas */
  overflow-wrap: break-word; /* Alternativa para compatibilidad */
  white-space: normal; /* Permite que el texto salte de línea */
  margin: 0 auto; /* Centra el elemento dentro de su contenedor */
}



.options {
  display: flex;
  gap: 20px;
  margin-top: 30px;
}

.btn-primary:hover {
  transform: scale(1.1);
}

.btn-secondary {
  padding: 14px 40px;
  color: white;
  font-size: 1.4rem;
  background: #74c905;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.3s;
}

.btn-secondary:hover {
  transform: scale(1.1);
}

.btn-orden {
  padding: 0;
  color: #4fd87d; 
  font-size: 1.4rem;
  border: none;
  background: none; 
  cursor: pointer;
  transition: transform 0.3s;
}

.btn-orden:hover {
  transform: scale(1.1);
}

.btn-action {
  padding: 5px;
  margin: 0 2px;
  color: white;
  background-color: #548f4e;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.3s;
}
.btn-action-ver {
  padding: 5px;
  margin: 0 2px;
  color: white;
  background-color: #62a1ff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.3s;
}
.btn-action-del {
  padding: 5px;
  margin: 0 2px;
  color: white;
  background-color: #f87c5d;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.3s;
}
.detalle-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
}

.detalle-overlay.show {
  opacity: 1;
  visibility: visible;
}


.options {
  display: flex;
  justify-content: center; /* Centra los botones */
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  flex-wrap: wrap; /* Permite que los botones se acomoden en varias filas si es necesario */
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
  justify-content: center; /* Asegura alineación vertical */
  width: 140px; /* Aumentar si es necesario */
  height: 140px; /* Mantiene proporción */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.icono-opcion {
  font-size: 3rem; /* Asegurar tamaño de los iconos */
  color: #3ea845;
}

.option p {
  font-size: 1rem;
  font-weight: bold;
  color: #3ea845;
  margin-top: 10px; /* Espacio entre icono y texto */
  text-align: center;
}

.option:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.8);
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
.estimado-ultimas {
    text-align: right;
}
.encabezados-ultimas th  {
  text-align: center;
}
.text-center {
    text-align: center !important;
}
.acciones {
    display: flex;
    justify-content: center; 
    align-items: center; 
    gap: 5px; 
}
</style>

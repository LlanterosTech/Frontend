<template>
  <div class="container">
    <div class="design">
      <img src="@/assets/Group_2.png" class="plant plant-1" alt="Plant 1">
      <img src="@/assets/Group_2.png" class="plant plant-2" alt="Plant 2">
      <img src="@/assets/Group_2.png" class="plant plant-3" alt="Plant 3">
      <img src="@/assets/Group_2.png" class="plant plant-4" alt="Plant 4">
      <img src="@/assets/Group_2.png" class="plant plant-5" alt="Plant 5">
      <img src="@/assets/Group_2.png" class="plant plant-6" alt="Plant 6">
    </div>
    <div class="init-box">
      <div class="init">
        <h1 class="title">Gestión de Estimaciones</h1>
        <p class="subtitle">Administra tus estimaciones de manera eficiente.</p>

        <div class="buttons">
          <button 
            @click="crearEstimacion"
            class="btn-primary">
            📝 Nueva Estimación
          </button>

          <button 
            @click="buscarEstimaciones"
            class="btn-secondary">
            🔍 Buscar Estimaciones
          </button>
        </div>

        <!-- Tabla de Últimas Estimaciones -->
        <div class="table-container">
          <h2 class="table-title">
            Últimas Estimaciones
            <button @click="cambiarOrden" class="btn-orden" :key="ordenAscendente">
              <i :class="iconOrden"></i>
            </button>
          </h2>
          
          <table class="table">
            <thead>
              <tr>
                <th>Proyecto</th>
                <th>Tipo de PAM</th>
                <th>Código PAM</th>
                <th>Usuario</th>
                <th>Área</th>
                <th>Costo Estimado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="estimacion in ultimasEstimaciones" :key="estimacion.estimacionId">
                <td>{{ estimacion.proyecto.name }}</td>
                <td>{{ estimacion.tipoPam.name }}</td>
                <td>{{ estimacion.codPam }}</td>
                <td>{{ estimacion.usuario.email }}</td>
                <td>{{ estimacion.usuario.registerArea }}</td>
                <td>
                  <p class="font-bold text-green-600">S/ {{ Number(estimacion.costoEstimado.totalEstimado).toFixed(2) }}</p>
                  <p class="text-sm text-gray-600">Costo Directo: S/ {{ Number(estimacion.costoEstimado.costoDirecto).toFixed(2) }}</p>
                  <p class="text-sm text-gray-600">Gastos Generales: S/ {{ Number(estimacion.costoEstimado.gastosGenerales).toFixed(2) }}</p>
                </td>
                <td>
                  <button @click="verDetalle(estimacion.estimacionId)" class="btn-action">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button @click="editarEstimacion(estimacion.estimacionId)" class="btn-action">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="eliminarEstimacion(estimacion.estimacionId)" class="btn-action">
                    <i class="fas fa-trash"></i>
                  </button>
                  <button @click="descargarPDF(estimacion.estimacionId)" class="btn-action">
                    <i class="fas fa-file-pdf"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bdService from "@/main/services/bdservice";
import userService from "@/main/services/userservice";

export default {
  data() {
    return {
      ultimasEstimaciones: [],
      ordenAscendente: false // Por defecto, las estimaciones están en orden ascendente
    };
  },
  computed: {
    iconOrden() {
      return this.ordenAscendente ? 'fas fa-caret-up' : 'fas fa-caret-down';
    }
  },
  methods: {
    async cargarEstimaciones() {
      try {
        const estimaciones = await bdService.getEstimaciones();
        console.log("Datos obtenidos:", estimaciones); // 🔹 Imprimir los datos recibidos

        for (let estimacion of estimaciones) {
          try {
            const usuario = await userService.getAuthUser(estimacion.usuarioId);
            estimacion.usuario = usuario; // Agrega el usuario a la estimación
          } catch (error) {
            console.error(`Error obteniendo el usuario para ID ${estimacion.usuarioId}:`, error);
            estimacion.usuario = { email: "Desconocido", area: "No definido" }; // Fallback
          }
        }
        this.ultimasEstimaciones = estimaciones.slice(-3);
      } catch (error) {
        console.error("Error al cargar las estimaciones:", error);
      }
    },
    cambiarOrden() {
      this.ordenAscendente = !this.ordenAscendente; // Alterna el estado
      this.ultimasEstimaciones.reverse(); // Invierte el orden del array
      this.$forceUpdate();
    },
    crearEstimacion() {
      this.$router.push("/nuevaestimacion");
    },
    buscarEstimaciones() {
      this.$router.push("/buscar-estimaciones");
    },
    verDetalle(id) {
      this.$router.push(`/detalle-estimacion/${id}`);
    },
    editarEstimacion(id) {
      // Lógica para editar la estimación
      console.log(`Editar estimación con ID: ${id}`);
    },
    eliminarEstimacion(id) {
      // Lógica para eliminar la estimación
      console.log(`Eliminar estimación con ID: ${id}`);
    },
    descargarPDF(id) {
      // Lógica para descargar el PDF de la estimación
      console.log(`Descargar PDF de la estimación con ID: ${id}`);
    }
  },
  mounted() {
    this.cargarEstimaciones();
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

*, html, body {
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Poppins', sans-serif;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom right, #8fc280, #81cc7a, #8fc280);
}

.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.design {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0; /* Asegúrate de que las plantas estén en el fondo */
}

.plant {
  position: absolute;
  width: 420px;
  height: auto;
  opacity: 0.9;
}

.plant-1 {
  bottom: -10px;
  left: -20px;
}

.plant-2 {
  top: -50px;
  left: -60px;
}

.plant-3 {
  top: -50px;
  left: 180px;
}

.plant-4 {
  bottom: -150px;
  left: 200px;
}

.plant-5 {
  top: 30px;
  left: 250px;
}

.plant-6 {
  bottom: 30px;
  left: 80px;
}

.init-box {
  background: rgba(255, 255, 255, 0.9);
  padding: 50px;
  border-radius: 15px;
  box-shadow: 0 0 25px 12px rgb(0 0 0 / 30%);
  z-index: 1; /* Asegúrate de que el init-box esté encima de las plantas */
  width: 80%;
  max-width: 1500px;
}

.init {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.init h1.title {
  margin: 20px 0;
  font-size: 3.2rem;
}

.init p.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 20px;
}

.buttons {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.btn-primary {
  padding: 14px 40px;
  color: white;
  font-size: 1.4rem;
  background: linear-gradient(to right, #8fc280, #81cc7a, #8fc280);
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.3s;
}

.btn-primary:hover {
  transform: scale(1.1);
}

.btn-secondary {
  padding: 14px 40px;
  color: white;
  font-size: 1.4rem;
  background: linear-gradient(to right, #8fc280, #81cc7a, #8fc280);
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.3s;
}

.btn-secondary:hover {
  transform: scale(1.1);
}

.btn-orden {
  padding: 0; /* Eliminar padding */
  color: #4fd87d; /* Cambiar color a verde */
  font-size: 1.4rem;
  border: none;
  background: none; /* Eliminar fondo */
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
  background-color: #4fd87d;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.3s;
}

.btn-action:hover {
  transform: scale(1.1);
}

.table-container {
  width: 100%;
  margin-top: 20px;
}

.table-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th, .table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.table th {
  background-color: #f2f2f2;
}

.table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.table tr:hover {
  background-color: #ddd;
}
</style>
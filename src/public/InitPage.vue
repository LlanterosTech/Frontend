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
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Área</th>
                <th>Total Estimado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="estimacion in ultimasEstimaciones" :key="estimacion.estimacionId">
                <td>{{ estimacion.proyecto.name }}</td>
                <td>{{ estimacion.tipoPam.name }}</td>
                <td>{{ estimacion.codPam }}</td>
                <td>{{ formatFecha(estimacion.fechaPam) }}</td>

                <td>{{ estimacion.usuario.email }}</td>
                <td>{{ estimacion.usuario.registerArea }}</td>
                <td>
                  <p class="font-bold text-green-600"> {{ formatNumero(estimacion.costoEstimado.totalEstimado)}}</p>
                 
                </td>
                <td>
                  <button @click="verDetalle(estimacion)" class="btn-action">
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
          <div v-if="detalleVisible" class="detalle-overlay" :class="{ 'show': detalleVisible }">
          <div class="detalle-box">
            <button @click="toggleDetalle" class="btn-secondary btn-close">
              X
            </button>
            <h2 class="text-lg-font-semibold-mb-4">Costo Estimado del PAM</h2>
            <div class="grid grid-cols-2 gap-4">
              <p class="cost-item"><strong>Costo Directo:</strong>  {{ formatNumero(detalleCosto.costoDirecto) }}</p>
              <p class="cost-item"><strong>Gastos Generales:</strong> {{ formatNumero(detalleCosto.gastosGenerales) }}</p>
              <p class="cost-item"><strong>Utilidad:</strong> {{ formatNumero(detalleCosto.utilidades)}}</p>
              <p class="cost-item"><strong>Subtotal:</strong>  {{ formatNumero(detalleCosto.subTotal)}}</p>
              <p class="cost-item"><strong>IGV:</strong>  {{ formatNumero(detalleCosto.igv) }}</p>
              <p class="cost-item"><strong>Subtotal Obra:</strong>  {{ formatNumero(detalleCosto.subTotalObras) }}</p>
              <p class="cost-item"><strong>Expediente Técnico:</strong>  {{ formatNumero(detalleCosto.expedienteTecnico) }}</p>
              <p class="cost-item"><strong>Supervisión:</strong>  {{ formatNumero(detalleCosto.supervision) }}</p>
              <p class="cost-item"><strong>Gestión de Proyectos:</strong>  {{ formatNumero(detalleCosto.gestionProyecto) }}</p>
              <p class="cost-item"><strong>Capacitación:</strong> {{ formatNumero(detalleCosto.capacitacion) }}</p>
              <p class="cost-item"><strong>Contingencias:</strong>  {{ formatNumero(detalleCosto.contingencias) }}</p>
              <p class="cost-item total-estimado"><strong>Total Estimado:</strong>  {{ formatNumero(detalleCosto.totalEstimado) }}</p>
            </div>
          </div>
        </div>
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
      ordenAscendente: false, // Por defecto, las estimaciones están en orden ascendente
      detalleVisible: false,
      detalleCosto: {},
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
        this.ultimasEstimaciones = estimaciones.slice(-5);
      } catch (error) {
        console.error("Error al cargar las estimaciones:", error);
      }
    },


    cambiarOrden() {
      this.ordenAscendente = !this.ordenAscendente; // Alterna el estado
      this.ultimasEstimaciones.reverse(); // Invierte el orden del array
      this.$forceUpdate();
    },
    formatNumero(valor) {
            if (valor == null || isNaN(valor)) return 'S/ 0.00'; 
            return `S/ ${Number(valor).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        },
    crearEstimacion() {
      this.$router.push("/nuevaestimacion");
    },
    buscarEstimaciones() {
      this.$router.push("/buscar-estimacion");
    },
    formatFecha(fecha) {
      const date = new Date(fecha);
      const dia = date.getDate().toString().padStart(2, '0');
      const mes = (date.getMonth() + 1).toString().padStart(2, '0');
      const anio = date.getFullYear();
      return `${dia}/${mes}/${anio}`;
    },
    verDetalle(estimacion) {
      this.detalleCosto = estimacion.costoEstimado;
      this.detalleVisible = true;
    },
    toggleDetalle() {
      this.detalleVisible = !this.detalleVisible;
    },
    editarEstimacion(id) {
      // Lógica para editar la estimación
      console.log(`Editar estimación con ID: ${id}`);
    },
    eliminarEstimacion(id) {
      if (confirm("¿Estás seguro de que deseas eliminar esta estimación?")) {
      bdService.deleteEstimacion(id)
        .then(() => {
        this.ultimasEstimaciones = this.ultimasEstimaciones.filter(estimacion => estimacion.estimacionId !== id);
        console.log(`Estimación con ID: ${id} eliminada exitosamente.`);
        })
        .catch(error => {
        console.error(`Error al eliminar la estimación con ID: ${id}`, error);
        });
      }
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
  background: #74c905;
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

.detalle-box {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 25px 12px rgb(0 0 0 / 30%);
  z-index: 1001;
  max-width: 800px;
  width: 90%;
}

.btn-close {
    position: relative;
    float: right;
    background: none;
    border: none;
    cursor: pointer;
    color: #13863a;
    font-size: 1.5rem;
    transition: transform 0.3s;
}

.btn-close:hover {
  transform: scale(1.1);
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
.cost-item {
  font-size: 1rem;
  color: #333;
  margin-bottom: 10px;
}

.total-estimado {
  font-size: 1.2rem;
  font-weight: bold;
  color: #1f4401; /* Color rojo para resaltar */
}
.text-lg-font-semibold-mb-4 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
</style>
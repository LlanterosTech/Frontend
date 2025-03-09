<template>
  <div class="container fondo">
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
                <th>ID de PAM</th>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Departamento</th>
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
                  
                  <button @click="eliminarEstimacion(estimacion.estimacionId)" class="btn-action">
                    <i class="fas fa-trash"></i>
                  </button>
                  <button @click="descargarPDF(estimacion)" class="btn-action btn-pdf">
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
            <h2 class="text-lg-font-semibold-mb-4">Costo Estimado del PAM:  - {{ detalleEstimacion.codPam }}
            </h2>
            <div class="grid grid-cols-2 gap-4 costo-estimado-grid">
                <p class="costo-item"><strong>Costo Directo:</strong> {{ formatNumero(detalleCosto.costoDirecto) }}</p>
                <p class="costo-item"><strong>Gastos Generales:</strong> {{ formatNumero(detalleCosto.gastosGenerales) }}</p>
                <p class="costo-item"><strong>Utilidad:</strong> {{ formatNumero(detalleCosto.utilidades) }}</p>
                <p class="costo-item"><strong>Subtotal:</strong> {{ formatNumero(detalleCosto.subTotal) }}</p>
                <p class="costo-item"><strong>IGV:</strong> {{ formatNumero(detalleCosto.igv) }}</p>
                <p class="costo-item"><strong>Subtotal Obra:</strong> {{ formatNumero(detalleCosto.subTotalObras) }}</p>
                <p class="costo-item"><strong>Expediente Técnico:</strong> {{ formatNumero(detalleCosto.expedienteTecnico) }}</p>
                <p class="costo-item"><strong>Supervisión:</strong> {{ formatNumero(detalleCosto.supervision) }}</p>
                <p class="costo-item"><strong>Gestión de Proyectos:</strong> {{ formatNumero(detalleCosto.gestionProyecto) }}</p>
                <p class="costo-item"><strong>Capacitación:</strong> {{ formatNumero(detalleCosto.capacitacion) }}</p>
                <p class="costo-item"><strong>Contingencias:</strong> {{ formatNumero(detalleCosto.contingencias) }}</p>
                </div>
                <div class="total-estimado-container">
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
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  data() {
    return {
      ultimasEstimaciones: [],
      ordenAscendente: false,
      detalleVisible: false,
      detalleCosto: {},
      detalleEstimacion: {}
    };
  },
  computed: {
    iconOrden() {
      return this.ordenAscendente ? 'fas fa-caret-up' : 'fas fa-caret-down';
    }
  },
  methods: {

        descargarPDF(estimacion) {
      const doc = new jsPDF("p", "mm", "a4");

      // Título del documento
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Resumen de Estimación", doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

      doc.setFontSize(12);
      doc.text(`Proyecto: ${estimacion.proyecto.name}`, 15, 30);
      doc.text(`Tipo de PAM: ${estimacion.tipoPam.name}`, 15, 40);
      doc.text(`Código PAM: ${estimacion.codPam}`, 15, 50);
      doc.text(`Fecha: ${this.formatFecha(estimacion.fechaPam)}`, 15, 60);
      doc.text(`Usuario: ${estimacion.usuario.email}`, 15, 70);
      doc.text(`Departamento: ${estimacion.usuario.registerArea}`, 15, 80);

      // Tabla de costos
      const columns = ["Descripción", "Valor"];
      const rows = [
        ["Costo Directo", this.formatNumero(estimacion.costoEstimado?.costoDirecto)],
        ["Gastos Generales", this.formatNumero(estimacion.costoEstimado?.gastosGenerales)],
        ["Utilidad", this.formatNumero(estimacion.costoEstimado?.utilidades)],
        ["Subtotal", this.formatNumero(estimacion.costoEstimado?.subTotal)],
        ["IGV", this.formatNumero(estimacion.costoEstimado?.igv)],
        ["Total Estimado", this.formatNumero(estimacion.costoEstimado?.totalEstimado)]
      ];

      doc.autoTable({
        startY: 90,
        head: [columns],
        body: rows,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [39, 174, 96] },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        margin: { left: 15, right: 15 }
      });

      // Pie de página
      doc.setFontSize(10);
      doc.text("Este documento es un resumen de la estimación de costos.", 15, doc.internal.pageSize.getHeight() - 20);

      // 🔹 Genera un URL temporal del PDF y ábrelo en una nueva pestaña
      const pdfUrl = doc.output("bloburl");
      window.open(pdfUrl, "_blank");
    },
    async cargarEstimaciones() {
      try {
        const estimaciones = await bdService.getEstimaciones();
        console.log("Datos obtenidos:", estimaciones); 

        for (let estimacion of estimaciones) {
          try {
            const usuario = await userService.getAuthUser(estimacion.usuarioId);
            estimacion.usuario = usuario; 
          } catch (error) {
            console.error(`Error obteniendo el usuario para ID ${estimacion.usuarioId}:`, error);
            estimacion.usuario = { email: "Desconocido", area: "No definido" }; 
          }
        }
        this.ultimasEstimaciones = estimaciones.slice(-5);
      } catch (error) {
        console.error("Error al cargar las estimaciones:", error);
      }
    },


    cambiarOrden() {
      this.ordenAscendente = !this.ordenAscendente; 
      this.ultimasEstimaciones.reverse(); 
      this.$forceUpdate();
    },
    formatNumero(valor) {
      if (valor == null || isNaN(valor)) return 'S/ 0';
      const roundedValue = Math.round(valor);
      return `S/ ${Number(roundedValue).toLocaleString('es-PE')}`;
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
      this.detalleEstimacion = estimacion;
    },
    toggleDetalle() {
      this.detalleVisible = !this.detalleVisible;
    },
    editarEstimacion(id) {
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
  z-index: 0; 
}

.plant {
  position: absolute;
  width: 15%;
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

.fondo {
  background: url("@/assets/senora-carrusel-ai-brush-removebg-vm9tw8af.png") no-repeat center center fixed;
  background-size: 100%; /* Reduce el tamaño al 80% del contenedor */
  background-position: bottom center; /* Ajusta la posición para que no se pierda la alineación */
  background-attachment: fixed;
}



.init-box {
  background: rgba(255, 255, 255, 0.9);
  padding: 50px;
  border-radius: 15px;
  box-shadow: 0 0 25px 12px rgb(0 0 0 / 30%);
  z-index: 1; 
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
  font-size: 3.075rem;
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
.costo-estimado-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); 
  gap: 16px;
  padding: 16px;
}

.costo-item {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 8px;
  color: #333;
}

.total-estimado-container {
  margin-top: 20px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.total-estimado {
  font-weight: bold;
  font-size: 16px;
  color: #006400; 
}

.costo-item strong {
  font-weight: bold;
  color: #555;
}

.costo-item {
  border-bottom: 1px solid #ccc;
  padding-bottom: 8px;
}

@media (max-width: 600px) {
  .costo-estimado-grid {
    grid-template-columns: 1fr;
  }
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
  font-size: 1.7375rem;
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
  color: #1f4401; 
}
.text-lg-font-semibold-mb-4 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
</style>
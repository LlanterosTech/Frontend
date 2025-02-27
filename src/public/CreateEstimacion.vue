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
    <div class="estimacion-box" :class="{ 'blur-background': mostrarDetalle }">
      <button @click="goBack" class="btn-back">
        <i class="fas fa-arrow-left"></i> <!-- Icono de flecha hacia la izquierda -->
      </button>
      <div class="estimacion">
        <h1 class="title">Crear Nueva Estimación</h1>
       
        <div class="mb-4">
          <label class="block text-sm font-medium">Proyecto</label>
          <div class="flex items-center">
            <select v-model="estimacion.proyectoId" @change="cargarTiposPAM" :disabled="proyectoBloqueado" class="w-full p-2 border rounded input-standard">
              <option v-for="proyecto in proyectos" :key="proyecto.proyectoId" :value="proyecto.proyectoId">
                {{ proyecto.name }}
              </option>
            </select>
            <button @click="bloquearProyecto" class="btn-secondary ml-2">
              {{ proyectoBloqueado ? 'Desfijar' : 'Fijar' }}
            </button>
          </div>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium">Tipo de PAM</label>
          <select v-model="estimacion.tipoPamId" @change="cargarAtributos" class="w-full p-2 border rounded input-standard">
            <option v-for="tipoPam in tiposPAM" :key="tipoPam.id" :value="tipoPam.id">
              {{ tipoPam.name }}
            </option>
          </select>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium">Código PAM</label>
          <input type="text" v-model="estimacion.codPam" class="w-full p-2 border rounded input-standard" placeholder="Ingrese el código PAM" />
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium">Fecha</label>
          <input type="date" :value="fecha" class="w-full p-2 border rounded bg-gray-200 input-standard" disabled />
        </div>
        
        <div v-if="atributos.length" class="mb-4">
          <h2 class="text-lg font-semibold">Atributos</h2>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="atributo in atributos" :key="atributo.atributoPamId" class="mb-2">
              <label class="block text-sm font-medium">
                {{ atributo.nombre }} 
              </label>
              <template v-if="atributo.nombre === 'TipoCobertura'">
                <select v-model="valoresAtributos[atributo.atributoPamId]" class="w-full p-2 border rounded input-standard">
                  <option value="NINGUNA">NINGUNA</option>
                  <option value="I">I</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                  <option value="IV">IV</option>
                </select>
              </template>
              <template v-else>
                <input v-if="atributo.tipoDato === 'decimal'" type="number" v-model="valoresAtributos[atributo.atributoPamId]" class="w-full p-2 border rounded input-standard" />
                <select v-else-if="atributo.tipoDato === 'bool'" v-model="valoresAtributos[atributo.atributoPamId]" class="w-full p-2 border rounded input-standard">
                  <option :value="true">Sí</option>
                  <option :value="false">No</option>
                </select>
                <input v-else type="text" v-model="valoresAtributos[atributo.atributoPamId]" class="w-full p-2 border rounded input-standard" />
              </template>
            </div>
          </div>
            <p v-if="costoEstimado" class="flex items-center gap-2 text-lg font-semibold mt-4">
              Costo Estimado de la Estimación: S/ {{ Number(costoEstimado.totalEstimado).toFixed(2) }}
              <Eye @click="toggleDetalle" class="cursor-pointer text-green-600" size="24" />
            </p>
        </div>
        
        <div class="flex justify-between mt-4">
          <button @click="guardarEstimacion" class="btn-primary">
            Guardar Estimación
          </button>
          <button @click="limpiarFormulario" class="btn-primary">
            Nueva Estimación
          </button>
        </div>
       
      </div>
    </div>
    
    <div v-if="costoEstimado" class="detalle-overlay" :class="{ 'show': mostrarDetalle }">
      <div class="detalle-box">
        <p @click="toggleDetalle" class="X">
          X
        </p>
        <h2 class="text-lg font-semibold mb-4">Costo Estimado del PAM</h2>
        <div class="grid grid-cols-2 gap-4">
          <p><strong>Costo Directo:</strong> S/ {{ Number(costoEstimado.costoDirecto).toFixed(2) }}</p>
          <p><strong>Gastos Generales:</strong> S/ {{ Number(costoEstimado.gastosGenerales).toFixed(2) }}</p>
          <p><strong>Utilidad:</strong> S/ {{ Number(costoEstimado.utilidades).toFixed(2) }}</p>
          <p><strong>Subtotal:</strong> S/ {{ Number(costoEstimado.subTotal).toFixed(2) }}</p>
          <p><strong>IGV:</strong> S/ {{ Number(costoEstimado.igv).toFixed(2) }}</p>
          <p><strong>Subtotal Obra:</strong> S/ {{ Number(costoEstimado.subTotalObras).toFixed(2) }}</p>
          <p><strong>Expediente Técnico:</strong> S/ {{ Number(costoEstimado.expedienteTecnico).toFixed(2) }}</p>
          <p><strong>Supervisión:</strong> S/ {{ Number(costoEstimado.supervision).toFixed(2) }}</p>
          <p><strong>Gestión de Proyectos:</strong> S/ {{ Number(costoEstimado.gestionProyecto).toFixed(2) }}</p>
          <p><strong>Capacitación:</strong> S/ {{ Number(costoEstimado.capacitacion).toFixed(2) }}</p>
          <p><strong>Contingencias:</strong> S/ {{ Number(costoEstimado.contingencias).toFixed(2) }}</p>
          <p class="cost-item total-estimado"><strong>Total Estimado:</strong> S/ {{ Number(costoEstimado.totalEstimado).toFixed(2) }}</p>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div v-if="error" class="alert-container">
        <p class="error-message">{{ error }}</p>
      </div>
    </transition>
  </div>
</template>

<script>
import bdService from "@/main/services/bdservice";
import { Eye } from 'lucide-vue-next';

export default {
  components: {
    Eye, // 👈 Asegura que esté declarado
  },
  data() {
    return {
      proyectos: [],
      tiposPAM: [],
      atributos: [],
      error: null,
      costosByProyecto: [],
      valoresAtributos: {},
      costoEstimado: null,
      totalProyecto: 0,
      fecha: new Date().toISOString().split("T")[0],
      proyectoBloqueado: false,
      mostrarDetalle: false,
      estimacion: {
        usuarioId: localStorage.getItem('idUser'),
        proyectoId: null,
        codPam: null,
        tipoPamId: null,
        valores: {}
      }
    };
  },
  async created() {
    await this.cargarProyectos();
  },
  methods: {
    async goBack() {
      this.$router.go(-1);
    },
    async cargarProyectos() {
      this.proyectos = await bdService.getProyectos();
    },
    async cargarTiposPAM() {
      this.tiposPAM = await bdService.getTiposPAM();
    },
    async cargarCostosByProyectoId() {
      if (!this.estimacion.proyectoId) {
        console.warn("⚠️ No hay proyectoId definido");
        return;
      }
      try {
        const response = await bdService.getCostoTotalByProyectoId(this.estimacion.proyectoId);
        console.log("🔹 Respuesta de la API para totalCost:", response);
        if (response && response.totalCost !== undefined) {
          this.totalProyecto = response.totalCost;
        } else {
          console.warn("⚠️ La respuesta de la API no contiene totalCost");
          this.totalProyecto = 0;
        }
      } catch (error) {
        console.error("❌ Error al obtener el costo total del proyecto:", error);
        this.totalProyecto = 0;
      }
    },
    async cargarAtributos() {
      if (!this.estimacion.tipoPamId) return;
      try {
        const response = await bdService.getAtributosByTipoPamId(this.estimacion.tipoPamId);
        this.atributos = response || [];
        this.valoresAtributos = {};
        this.atributos.forEach(atributo => {
          if (atributo.tipoDato === "decimal") {
            this.valoresAtributos[atributo.atributoPamId] = 0.0;
          } else if (atributo.tipoDato === "bool") {
            this.valoresAtributos[atributo.atributoPamId] = false;
          } else {
            this.valoresAtributos[atributo.atributoPamId] = "";
          }
        });
        console.log("Atributos cargados:", this.atributos);
        console.log("Valores asignados:", this.valoresAtributos);
      } catch (error) {
        console.error("Error al cargar los atributos:", error);
      }
    },
    bloquearProyecto() {
      this.proyectoBloqueado = !this.proyectoBloqueado;
    },
    limpiarFormulario() {
      this.estimacion.codPam = null;
      this.estimacion.tipoPamId = null;
      this.atributos = [];
      this.valoresAtributos = {};
      this.costoEstimado = null;
    },
    toggleDetalle() {
      this.mostrarDetalle = !this.mostrarDetalle;
    },
    async guardarEstimacion() {
      const storedUserId = localStorage.getItem("idUser");
      if (!storedUserId) {
      this.error = "No se encontró un usuario autenticado.";
      this.clearErrorAfterTimeout();
      return;
      }
      this.estimacion.usuarioId = storedUserId;
      this.estimacion.codPam = this.estimacion.codPam ? this.estimacion.codPam.toString() : "0";
      this.estimacion.valores = {};
      this.atributos.forEach(atributo => {
      this.estimacion.valores[parseInt(atributo.atributoPamId)] = String(this.valoresAtributos[atributo.atributoPamId]);
      });
      console.log("Datos enviados al backend:", JSON.stringify(this.estimacion, null, 2));
      try {
      const response = await bdService.createEstimacion(this.estimacion);
      if (response && response.costoEstimado) {
        this.costoEstimado = response.costoEstimado;
        console.log("Total Estimado:", this.costoEstimado.totalEstimado); // Mostrar TotalEstimado en la consola
        this.mostrarDetalle = true; // Mostrar detalle al guardar la estimación
      } else {
        console.warn("No se recibieron costos estimados en la respuesta.");
      }
      await this.cargarCostosByProyectoId();
      } catch (error) {
      console.error("Error al crear la estimación:", error.response ? error.response.data : error);
      this.error = "Error al crear estimación";
      this.clearErrorAfterTimeout();
      }
    },
    clearErrorAfterTimeout() {
      setTimeout(() => {
        this.error = null;
      }, 4000); // 4 segundos
    },
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

*, html, body {
  margin: 0;
  padding: 0;
}
.alert-container {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 0, 0, 0.8);
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: opacity 0.5s ease-in-out;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

.error-message {
  color: white;
  font-size: 0.9rem;
}
body {
  font-family: 'Poppins', sans-serif;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom right, #53704b, #7ba58d, #4fd87d);
}

.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.blur-background {
  filter: blur(5px);
}

.btn-floating .icon-eye {
  margin-left: 5px;
  font-size: 1.2rem;
}

.design {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0; /* Asegúrate de que las plantas estén en el fondo */
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
  margin-left: 10px;
}

.btn-secondary {
  padding: 10px 20px;
  color: white;
  font-size: 1rem;
  background: #13863a;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.3s;
  margin-top: 10px;
}

.btn-secondary:hover {
  transform: scale(1.1);
}

.btn-floating {
  padding: 10px 20px;
  color: white;
  font-size: 1rem;
  background: #13863a;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.3s;
  margin-top: 10px;
}

.X {
    position: relative;
    float: right;
    background: none;
    border: none;
    cursor: pointer;
    color: #13863a;
    font-size: 1.5rem;
    transition: transform 0.3s;
}

.btn-floating:hover {
  transform: scale(1.1);
}

.btn-back {
 
  background: none;
  border: none;
  cursor: pointer;
  color: #13863a;
  font-size: 1.5rem;
  transition: transform 0.3s;
}

.btn-back:hover {
  transform: scale(1.1);
}

.btn-close {
  position: absolute;
  top: 10px;
  right: 10px;
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

.estimacion-box {
  background: rgba(255, 255, 255, 0.9);
  padding: 50px;
  border-radius: 15px;
  box-shadow: 0 0 25px 12px rgb(0 0 0 / 30%);
  z-index: 1;
  width: 80%;
  max-width: 1200px;
}

.estimacion {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.estimacion h1.title {
  margin: 20px 0;
  font-size: 2.5rem;
}

.mb-4 {
  width: 100%;
  margin-bottom: 1rem;
}

.block {
  display: block;
}

.text-sm {
  font-size: 0.875rem;
}

.font-medium {
  font-weight: 500;
}

.w-full {
  width: 100%;
}

.p-2 {
  padding: 0.5rem;
}

.border {
  border: 1px solid #ccc;
}

.rounded {
  border-radius: 0.375rem;
}

.bg-gray-200 {
  background-color: #edf2f7;
}

.bg-blue-500 {
  background-color: #4299e1;
}

.text-white {
  color: #fff;
}

.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.hover\:bg-blue-600:hover {
  background-color: #3182ce;
}

.transition {
  transition: all 0.2s;
}

.mt-8 {
  margin-top: 2rem;
}

.p-4 {
  padding: 1rem;
}

.bg-white {
  background-color: #fff;
}

.grid {
  display: grid;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.gap-4 {
  gap: 1rem;
}

.text-lg {
  font-size: 1.125rem;
}

.font-semibold {
  font-weight: 600;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mt-4 {
  margin-top: 1rem;
}
.total-estimado {
  font-size: 1.2rem;
  font-weight: bold;
  color: #1f4401; /* Color rojo para resaltar */
}
.text-blue-600 {
  color: #3182ce;
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

.input-standard {
  height: 40px;
  box-sizing: border-box;
}
</style>

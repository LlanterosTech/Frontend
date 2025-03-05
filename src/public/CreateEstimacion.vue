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
        <i class="fas fa-arrow-left"></i> 
      </button>
      <div class="estimacion">
        <h1 class="title">Crear Nueva Estimación</h1>
                  <div class="proyecto-fecha-container">
            <!-- Proyecto -->
            <div class="contenedor-proyecto">
              <label class="texto">Proyecto</label>
              <select v-model="estimacion.proyectoId" @change="cargarTiposPAM" :disabled="proyectoBloqueado"
                class="w-full p-2 border rounded input-standard">
                <option v-for="proyecto in proyectos" :key="proyecto.proyectoId" :value="proyecto.proyectoId">
                  {{ proyecto.name }}
                </option>
              </select>
              <div class="botones-proyecto">
                <button @click="bloquearProyecto" class="btn-secondary">
                  {{ proyectoBloqueado ? 'Desfijar' : 'Fijar' }}
                </button>
                <button @click="mostrarModalNuevoProyecto" class="btn-nuevoproy">+</button>
              </div>
            </div>
            <div class="fecha-container">
              <label class="texto">Fecha</label>
              <input type="date" :value="fecha" class="p-2 border rounded bg-gray-200 input-standard" disabled />
            </div>
          </div>


          <div v-if="modalNuevoProyecto" class="detalle-overlay show">
          <div class="detalle-box">
            <button @click="cerrarModalNuevoProyecto" class="btn-close">&times;</button> <!-- 🔥 Botón X dentro del modal -->
            <h2 class="texto">Crear Nuevo Proyecto</h2>

            <div class="modal-content">
              <label class="cost-item"><strong>Nombre del Proyecto:</strong></label>
              <input v-model="nuevoProyecto.nombre" type="text" class="modal-input" placeholder="Ingrese el nombre del proyecto" />
            </div>

            <div class="modal-footer">
              <button class="btn-secondary" @click="guardarNuevoProyecto">Guardar</button>
              <button class="btn-secondary" @click="cerrarModalNuevoProyecto">Cancelar</button>
            </div>
          </div>
        </div>

        
        <div class="mb-4">
          <label class="texto">Tipo de PAM</label>
          <select v-model="estimacion.tipoPamId" @change="cargarAtributos" class="w-full p-2 border rounded input-standard">
            <option disabled value="">Ingrese el Pasivo Ambiental Minero</option>
            <option v-for="tipoPam in tiposPAM" :key="tipoPam.id" :value="tipoPam.id">
              {{ tipoPam.name }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label class="texto">ID de PAM</label>
          <div class="flex items-center">
            <input type="text" v-model="estimacion.codPam" :disabled="idPamBloqueado" class="w-full p-2 border rounded input-standard" placeholder="Ingrese el código PAM" />
            <input type="checkbox" v-model="idPamBloqueado" @change="toggleIdPam" class="ml-2"> {{ idPamBloqueado ? 'No requiere' : 'Requiere' }} ID de PAM
          </div>
        </div>
        <div v-if="atributos.length" class="texto">
        <h2 class="texto"></h2>
        <button @click="abrirModalAtributos" class="btn-secondary">
          Ingresar Atributos
        </button>
        <p v-if="costoEstimado" class="flex items-center gap-2 text-lg font-semibold mt-4">
          Costo Estimado de la Estimación:  {{ formatNumero(costoEstimado.totalEstimado) }}
          <Eye @click="toggleDetalle" class="cursor-pointer text-green-600" size="24" />
        </p>
      </div>
        
        <div class="flex justify-between mt-4">
          <button v-if="!estimacionGuardada" @click="guardarEstimacion" class="btn-primary">
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
        <h2 class="text-lg font-semibold mb-4">Costo Estimado del PAM - {{ estimacion.codPam }}</h2>
        <div class="grid grid-cols-2 gap-4">
          <p><strong>Costo Directo:</strong> {{ formatNumero(costoEstimado.costoDirecto) }}</p>
          <p><strong>Gastos Generales:</strong> {{ formatNumero(costoEstimado.gastosGenerales) }}</p>
          <p><strong>Utilidad:</strong> {{ formatNumero(costoEstimado.utilidades)}}</p>
          <p><strong>Subtotal:</strong>  {{ formatNumero(costoEstimado.subTotal)}}</p>
          <p><strong>IGV:</strong>  {{ formatNumero(costoEstimado.igv)}}</p>
          <p><strong>Subtotal Obra:</strong>  {{ formatNumero(costoEstimado.subTotalObras) }}</p>
          <p><strong>Expediente Técnico:</strong>  {{ formatNumero(costoEstimado.expedienteTecnico) }}</p>
          <p><strong>Supervisión:</strong>  {{ formatNumero(costoEstimado.supervision) }}</p>
          <p><strong>Gestión de Proyectos:</strong> {{ formatNumero(costoEstimado.gestionProyecto) }}</p>
          <p><strong>Capacitación:</strong>  {{ formatNumero(costoEstimado.capacitacion) }}</p>
          <p><strong>Contingencias:</strong>  {{ formatNumero(costoEstimado.contingencias) }}</p>
          <p class="cost-item total-estimado"><strong>Total Estimado:</strong>  {{ formatNumero(costoEstimado.totalEstimado) }}</p>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div v-if="error" class="alert-container">
        <p class="error-message">{{ error }}</p>
      </div>
    </transition>

    <div v-if="mostrarModalCoberturas" class="modal-overlay">
      <div class="modal-box">
        <button @click="cerrarModalCobertura" class="btn-close">&times;</button>
        <h2 class="texto">Seleccionar Tipo de Cobertura</h2>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="(tipo, index) in tiposCobertura" :key="tipo.value" class="cobertura-option" @click="seleccionarCobertura(tipo.value)">
            <img :src="tipo.img" :alt="tipo.label" :class="{'cobertura-img': true, 'cobertura-img-small': index === 0}"/>
            <p>{{ tipo.label }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
  <div v-if="modalAtributos" class="detalle-overlay show">
  <div class="detalle-box">
    <button @click="cerrarModalAtributos" class="btn-close">&times;</button>
    <h2 class="texto">Ingresar Atributos</h2>

    <div class="grid grid-cols-2 gap-4">
      <div v-for="atributo in atributos" :key="atributo.atributoPamId" class="mb-2">
        <label class="block text-sm font-medium">
          {{ obtenerDescripcionAtributo(atributo.nombre) }}
        </label>

        <!-- 🔹 Si el atributo es "TipoCierre", usa un <select> -->
        <template v-if="atributo.nombre === 'TipoCierre'">
          <select v-model="valoresAtributos[atributo.atributoPamId]" class="w-full p-2 border rounded input-standard" required>
            <option value="TRASLADO">TRASLADO</option>
            <option value="INSITU">INSITU</option>
          </select>
        </template>

        <!-- 🔹 Si el atributo es "TipoCobertura", usa un botón para abrir otro modal -->
        <template v-else-if="atributo.nombre === 'TipoCobertura'">
          <button @click="mostrarModalCobertura(atributo.atributoPamId)" class="w-full p-2 border rounded input-standard">
            Seleccionar Tipo de Cobertura
          </button>
          <p v-if="valoresAtributos[atributo.atributoPamId]">Tipo: {{ valoresAtributos[atributo.atributoPamId] }}</p>
        </template>

        <!-- 🔹 Para booleanos (Sí/No), usa un select -->
        <template v-else-if="atributo.tipoDato === 'bool'">
          <select v-model="valoresAtributos[atributo.atributoPamId]" class="w-full p-2 border rounded input-standard" required>
            <option :value="true">Sí</option>
            <option :value="false">No</option>
          </select>
        </template>

        <!-- 🔹 Para números, usa un input numérico -->
        <template v-else-if="atributo.tipoDato === 'decimal'">
          <input type="number" v-model="valoresAtributos[atributo.atributoPamId]" class="w-full p-2 border rounded input-standard" required />
        </template>

        <!-- 🔹 Para cualquier otro tipo de dato, usa un input de texto -->
        <template v-else>
          <input type="text" v-model="valoresAtributos[atributo.atributoPamId]" class="w-full p-2 border rounded input-standard" required />
        </template>
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn-secondary" @click="guardarAtributos">Guardar</button>
      <button class="btn-secondary" @click="cerrarModalAtributos">Cancelar</button>
    </div>
  </div>
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
      modalNuevoProyecto: false,
      modalAtributos: false,
      nuevoProyecto: { nombre: "" },
      mostrarDetalle: false,
      idPamBloqueado: true,
      mostrarModalCoberturas: false, // Estado para mostrar el modal de cobertura
      atributoPamIdSeleccionado: null, // Estado para almacenar el atributoPamId seleccionado
      tiposCobertura: [
        { value: 'NINGUNA', label: 'Ninguna', img: require('@/assets/ninguna.png') },
        { value: 'I', label: 'Cobertura I', img: require('@/assets/tipo1.jpg') },
        { value: 'II', label: 'Cobertura II', img: require('@/assets/tipo2.jpg') },
        { value: 'III', label: 'Cobertura III', img: require('@/assets/tipo3.jpg') },
        { value: 'IV', label: 'Cobertura IV', img: require('@/assets/tipo4.jpg') }
      ],
      estimacion: {
        usuarioId: localStorage.getItem('idUser'),
        proyectoId: null,
        codPam: null,
        tipoPamId: null,
        valores: {}
      },
      // Objeto de mapeo para los nombres de los atributos
      atributoDescripciones: {
        Volumen: "Volumen (m³)",
        Área: "Área (m²)",
        GeneracionDAR: "¿Es generador de Drenaje Ácido de Roca (DAR)?",
        TipoCierre: "Tipo de Cierre",
        TipoCobertura: "Tipo de Cobertura",
        Cobertura: "¿Requiere Cobertura?",
        DistanciaTraslado: "Distancia de Traslado (km)",
        // Agrega más mapeos aquí según sea necesario
      },
      detalleEstimacion: {},
      estimacionGuardada: false, // Estado para controlar si la estimación ha sido guardada
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
    formatNumero(valor) {
      if (valor == null || isNaN(valor)) return 'S/ 0';
      const roundedValue = Math.round(valor);
      return `S/ ${Number(roundedValue).toLocaleString('es-PE')}`;
    },
    async cargarTiposPAM() {
      this.tiposPAM = await bdService.getTiposPAM();
    },
    toggleIdPam() {
      if (this.idPamBloqueado) {
        this.estimacion.codPam = null;
      }
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
    async guardarNuevoProyecto() {
      if (!this.nuevoProyecto.nombre.trim()) {
        alert("El nombre del proyecto no puede estar vacío.");
        return;
      }

      try {
        // Llamamos al servicio para crear el proyecto
        const nuevoProyecto = await bdService.createProyecto(this.nuevoProyecto.nombre);

        // Volvemos a cargar la lista de proyectos para reflejar el nuevo
        await this.cargarProyectos();

        // Seleccionar automáticamente el nuevo proyecto en el `select`
        this.estimacion.proyectoId = nuevoProyecto.proyectoId;

        // Cerrar el modal
        this.cerrarModalNuevoProyecto();
      } catch (error) {
        alert("Error al crear el proyecto.");
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

    abrirModalAtributos() {
      this.modalAtributos = true;
    },
    cerrarModalAtributos() {
      this.modalAtributos = false;
    },
    guardarAtributos() {
      this.cerrarModalAtributos();
    },
    mostrarModalNuevoProyecto() {
      this.modalNuevoProyecto = true;
    },
    cerrarModalNuevoProyecto() {
      this.modalNuevoProyecto = false;
      this.nuevoProyecto.nombre = ""; // Limpiar input
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
      this.estimacionGuardada = false; // Restablecer el estado de la estimación guardada
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
      let valid = true;
      this.atributos.forEach(atributo => {
        const valor = this.valoresAtributos[atributo.atributoPamId];
        if (atributo.tipoDato !== 'bool' && !valor) {
          valid = false;
        }
        this.estimacion.valores[parseInt(atributo.atributoPamId)] = String(valor);
      });
      if (!valid) {
        this.error = "Todos los atributos son obligatorios.";
        this.clearErrorAfterTimeout();
        return;
      }
      console.log("Datos enviados al backend:", JSON.stringify(this.estimacion, null, 2));
      try {
        const response = await bdService.createEstimacion(this.estimacion);
        if (response && response.costoEstimado) {
          this.costoEstimado = response.costoEstimado;
          console.log("Total Estimado:", this.costoEstimado.totalEstimado); // Mostrar TotalEstimado en la consola
          this.mostrarDetalle = true; // Mostrar detalle al guardar la estimación
          this.estimacionGuardada = true; // Marcar la estimación como guardada
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
    obtenerDescripcionAtributo(nombre) {
      return this.atributoDescripciones[nombre] || nombre;
    },
    mostrarModalCobertura(atributoPamId) {
      this.cerrarModalAtributos(); // 🔥 Cierra el modal de atributos primero
    this.atributoPamIdSeleccionado = atributoPamId;
    this.mostrarModalCoberturas = true;
    },
    cerrarModalCobertura() {
      this.mostrarModalCoberturas = false;
      this.abrirModalAtributos(); // 🔥 Reabrir el modal de atributos después de cerrar el de cobertura

    },
    seleccionarCobertura(value) {
      this.valoresAtributos[this.atributoPamIdSeleccionado] = value;
      this.cerrarModalCobertura();
    }
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

.texto{
  font-size: 20px;
  margin-bottom: 8px;
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
.btn-nuevoproy{
  padding: 10px 20px;
  color: white;
  font-size: 1rem;
  background: #13863a;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.3s;
  margin-top: 10px;
  margin-left: 10px; 
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
  position: absolute;

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
  position: relative;
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
  padding: 25px;
  border-radius: 12px; /* Bordes más suaves */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25); /* Sombra más suave */
  z-index: 1001;
  max-width: 380px; /* 🔥 Reducimos el ancho */
  width: 90%;
  text-align: center;
  position: relative;
}
.input-standard {
  height: 40px;
  box-sizing: border-box;
}
.btn-close {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  cursor: pointer;
  color: #13863a;
  font-size: 1.5rem;
  transition: transform 0.3s;
}

.btn-close:hover {
  transform: scale(1.2);
}

.detalle-box {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  max-width: 500px; /* 🔥 Aumentar el ancho del modal */
  width: 95%;
  text-align: center;
  position: relative;
}

.detalle-overlay {
  position: fixed;  /* 🔥 Fija el modal en toda la pantalla */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;  /* 🔥 Centra el modal */
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5); /* 🔥 FONDO OSCURO DIFUMINADO */
  z-index: 1000; /* 🔥 Asegura que esté sobre otros elementos */
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
}

/* 🔥 Hace visible el modal cuando se activa */
.detalle-overlay.show {
  opacity: 1;
  visibility: visible;
}
.modal-content {
  margin-top: 10px;
  text-align: left;
}

.modal-content label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.modal-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 0.9rem;
  outline: none;
}
.modal-footer {
  display: flex;
  justify-content: center; /* Centra los botones */
  gap: 15px; /* 🔥 Agrega espacio simétrico entre los botones */
  margin-top: 15px;
}

.modal-overlay {
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
}

.modal-box {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  max-width: 500px;
  width: 95%;
  text-align: center;
  position: relative;
}

.btn-close {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  cursor: pointer;
  color: #13863a;
  font-size: 1.5rem;
  transition: transform 0.3s;
}

.btn-close:hover {
  transform: scale(1.2);
}

.cobertura-option {
  cursor: pointer;
  text-align: center;
}

.cobertura-img {
  width: 100%;
  height: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: transform 0.3s;
}

.cobertura-img-small {
  width: 80%; /* Ajusta el tamaño según sea necesario */
  height: 80%;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: transform 0.3s;
}
.cobertura-img:hover {
  transform: scale(1.05);
}
.proyecto-fecha-container {
    display: flex;
    justify-content: space-between; /* Divide el espacio entre los elementos */
    align-items: flex-start; /* Asegura que los labels se alineen correctamente */
    gap: 20px; /* Espacio entre Proyecto y Fecha */
    width: 100%;
}

.contenedor-proyecto, .fecha-container {
    flex: 1; /* Ambos elementos ocupan el mismo espacio */
    display: flex;
    flex-direction: column;
    justify-content: flex-start; /* Mantiene la alineación superior */
}

.contenedor-proyecto {
    width: 50%; /* Ajuste del tamaño para evitar desajustes */
}

.fecha-container {
    width: 50%; /* Igual tamaño que el contenedor de proyecto */
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* Asegura alineación correcta */
}

.botones-proyecto {
    display: flex;
    gap: 12px; /* Espaciado uniforme entre botones */
    margin-top: 5px;
    margin-bottom: 8px;
}

.fecha-container input {
    width: 100%; /* Ajusta el ancho */
    height: 40px; /* Ajusta la altura */
    padding: 8px; /* Espaciado interno */
    text-align: left; /* Evita que el texto de la fecha se centre */
}

.mb-2 {
  margin-bottom: 0.5rem;
}

</style>
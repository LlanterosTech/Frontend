<template class="all">
  <div class="container">
    <div class="design">
      <img src="@/assets/Group_2.png" class="plant plant-1" alt="Plant 1">
      <img src="@/assets/Group_2.png" class="plant plant-2" alt="Plant 2">
      <img src="@/assets/Group_2.png" class="plant plant-3" alt="Plant 3">
      <img src="@/assets/Group_2.png" class="plant plant-4" alt="Plant 4">
      <img src="@/assets/Group_2.png" class="plant plant-5" alt="Plant 5">
      <img src="@/assets/Group_2.png" class="plant plant-6" alt="Plant 6">
    </div>
    <div class="estimacion-box">
      <div class="estimacion">
        <h1 class="title">Crear Nueva Estimación</h1>
        
        <div class="mb-4">
          <label class="block text-sm font-medium">Proyecto</label>
          <select v-model="estimacion.proyectoId" @change="cargarTiposPAM" class="w-full p-2 border rounded">
            <option v-for="proyecto in proyectos" :key="proyecto.proyectoId" :value="proyecto.proyectoId">
              {{ proyecto.name }}
            </option>
          </select>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium">Tipo de PAM</label>
          <select v-model="estimacion.tipoPamId" @change="cargarAtributos" class="w-full p-2 border rounded">
            <option v-for="tipoPam in tiposPAM" :key="tipoPam.id" :value="tipoPam.id">
              {{ tipoPam.name }}
            </option>
          </select>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium">Código PAM</label>
          <input type="text" v-model="estimacion.codPam" class="w-full p-2 border rounded" placeholder="Ingrese el código PAM" />
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium">Fecha</label>
          <input type="date" :value="fecha" class="w-full p-2 border rounded bg-gray-200" disabled />
        </div>
        
        <div v-if="atributos.length" class="mb-4">
          <h2 class="text-lg font-semibold">Atributos</h2>
          <div v-for="atributo in atributos" :key="atributo.atributoPamId" class="mb-2">
            <label class="block text-sm font-medium">
              {{ atributo.nombre }} ({{ atributo.unidadDeMedida.simbolo }})
            </label>
            <input v-if="atributo.tipoDato === 'decimal'" type="number" v-model="valoresAtributos[atributo.atributoPamId]" class="w-full p-2 border rounded" />
            <select v-else-if="atributo.tipoDato === 'bool'" v-model="valoresAtributos[atributo.atributoPamId]" class="w-full p-2 border rounded">
              <option :value="true">Sí</option>
              <option :value="false">No</option>
            </select>
            <input v-else type="text" v-model="valoresAtributos[atributo.atributoPamId]" class="w-full p-2 border rounded" />
          </div>
        </div>
        
        <button @click="guardarEstimacion" class="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition">
          Guardar Estimación
        </button>
        
        <div v-if="costoEstimado" class="mt-8 p-4 bg-white rounded-lg shadow-md">
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
            <p><strong>Total Estimado:</strong> S/ {{ Number(costoEstimado.totalEstimado).toFixed(2) }}</p>
          </div>
          <h3 class="text-lg font-semibold mt-4">Total Acumulado Proyecto: 
            <span class="text-blue-600">S/ {{ Number(totalProyecto).toFixed(2) }}</span>
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bdService from "@/main/services/bdservice";

export default {
  data() {
    return {
      proyectos: [],
      tiposPAM: [],
      atributos: [],
      costosByProyecto: [],
      valoresAtributos: {},
      costoEstimado: null,
      totalProyecto: 0,
      fecha: new Date().toISOString().split("T")[0],
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
    async guardarEstimacion() {
      const storedUserId = localStorage.getItem("idUser");
      if (!storedUserId) {
        alert("Error: No se encontró un usuario autenticado.");
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
        } else {
          console.warn("No se recibieron costos estimados en la respuesta.");
        }
        await this.cargarCostosByProyectoId();
        alert("Estimación creada exitosamente");
      } catch (error) {
        console.error("Error al crear la estimación:", error.response ? error.response.data : error);
        alert("Error al crear estimación. Revisa la consola.");
      }
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

.all {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
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
  justify-content: flex-end;
  align-items: center;
  position: relative;
  padding-right: 100px;
}

.design {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
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
  padding: 100px;
  border-radius: 15px;
  box-shadow: 0 0 25px 12px rgb(0 0 0 / 30%);
  z-index: 1;
  width: 340px;
  margin-right: 190px;
}

.estimacion {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.estimacion h1.title {
  margin: 20px 0;
  font-size: 3.2rem;
}

.text-input {
  background: #e6e6e6;
  height: 55px;
  display: flex;
  width: 85%;
  align-items: center;
  border-radius: 12px;
  padding: 0 18px;
  margin: 12px 0;
}

.text-input input {
  background: none;
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  margin-left: 12px;
  font-size: 1.2rem;
}

.text-input i {
  color: #686868;
  font-size: 1.3rem;
}

::placeholder {
  color: #9a9a9a;
  font-size: 1.2rem;
}

.login-btn {
  padding: 14px 80px;
  color: white;
  font-size: 1.4rem;
  background: linear-gradient(to right, #a6ec93, #65b46b, #4fd87d);
  border: none;
  border-radius: 30px;
  cursor: pointer;
  margin-top: 20px;
  transition: transform 0.3s;
}

.login-btn:hover {
  transform: scale(1.1);
}

a {
  font-size: 16px;
  color: #9a9a9a;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
}

a.forgot {
  margin-top: 15px;
}

.create {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.create i {
  color: #9a9a9a;
  margin-left: 12px;
}
</style>

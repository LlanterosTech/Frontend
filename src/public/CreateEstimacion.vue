<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-4">Crear Nueva Estimación</h1>
    
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
       <!-- Campo manual para Cod PAM -->
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

    <!-- Si el tipo de dato es decimal -->
    <input v-if="atributo.tipoDato === 'decimal'" type="number" 
           v-model="valoresAtributos[atributo.atributoPamId]" class="w-full p-2 border rounded" />

    <!-- Si el tipo de dato es booleano -->
    <select v-else-if="atributo.tipoDato === 'bool'" 
            v-model="valoresAtributos[atributo.atributoPamId]" class="w-full p-2 border rounded">
      <option :value="true">Sí</option>
      <option :value="false">No</option>
    </select>

    <!-- Si el tipo de dato es string -->
    <input v-else type="text" 
           v-model="valoresAtributos[atributo.atributoPamId]" class="w-full p-2 border rounded" />
  </div>
</div>

    <button @click="guardarEstimacion" class="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition">
      Guardar Estimación
    </button>

     <!-- Sección de Costos de la Estimación -->
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
      totalProyecto: 0, // Nueva variable para almacenar el total acumulado del proyecto
      fecha: new Date().toISOString().split("T")[0],
      estimacion: {
        usuarioId: localStorage.getItem('idUser'), // Ajusta esto según tu lógica de autenticación
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
            this.totalProyecto = response.totalCost; // ✅ Asignar valor correcto
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
        this.atributos = response || []; // Si la respuesta es null, usa un array vacío

        // Inicializa valores para cada atributo dependiendo de su tipo
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
}
,
async guardarEstimacion() {
    const storedUserId = localStorage.getItem("idUser");
    if (!storedUserId) {
        alert("Error: No se encontró un usuario autenticado.");
        return;
    }

    this.estimacion.usuarioId = storedUserId; // Asegurar que el usuario ID está presente
    this.estimacion.codPam = this.estimacion.codPam ? this.estimacion.codPam.toString() : "0";

    // Convertir todos los valores de atributos en formato de string
    this.estimacion.valores = {};
    this.atributos.forEach(atributo => {
        this.estimacion.valores[parseInt(atributo.atributoPamId)] = String(this.valoresAtributos[atributo.atributoPamId]);
    });

    console.log("Datos enviados al backend:", JSON.stringify(this.estimacion, null, 2));

    try {
        const response = await bdService.createEstimacion(this.estimacion);
        
        // Guardar los costos estimados en la variable
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
.container {
  max-width: 600px;
}
</style>

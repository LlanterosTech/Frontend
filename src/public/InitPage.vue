<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
    <h1 class="text-3xl font-bold mb-4">Gestión de Estimaciones</h1>
    <p class="text-gray-600 mb-6">Administra tus estimaciones de manera eficiente.</p>

    <div class="flex space-x-4">
      <button 
        @click="crearEstimacion"
        class="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition">
        📝 Nueva Estimación
      </button>

      <button 
        @click="buscarEstimaciones"
        class="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition">
        🔍 Buscar Estimaciones
      </button>
    </div>

    <!-- Tabla de Últimas Estimaciones -->
    <div class="mt-8 w-full max-w-4xl bg-white p-4 rounded-lg shadow">
  <h2 class="text-lg font-semibold mb-4 flex justify-between">
    Últimas Estimaciones
    <button 
      @click="cambiarOrden" 
      class="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition">
      🔄 Cambiar Orden
    </button>
  </h2>
      
      <table class="w-full border-collapse border border-gray-300">
  <thead>
    <tr class="bg-gray-200">
      <th class="border p-2">Proyecto</th>
      <th class="border p-2">Tipo de PAM</th>
      <th class="border p-2">Código PAM</th>
      <th class="border p-2">Usuario</th>
      <th class="border p-2">Area</th>
      <th class="border p-2">Costo Estimado</th>
      <th class="border p-2">Acción</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="estimacion in ultimasEstimaciones" :key="estimacion.estimacionId">
      <td class="border p-2">{{ estimacion.proyecto.name }}</td> <!-- ✅ Solo el nombre del proyecto -->
      <td class="border p-2">{{ estimacion.tipoPam.name }}</td> <!-- ✅ Solo el nombre del tipo de PAM -->
      <td class="border p-2">{{ estimacion.codPam }}</td> <!-- ✅ Código PAM -->
      <td class="border p-2">{{ estimacion.usuario.email }}</td>  <!-- ✅ Mostrar email -->
      <td class="border p-2">{{ estimacion.usuario.registerArea }}</td>  <!-- ✅ Mostrar área -->      <td class="border p-2">
        <p class="font-bold text-green-600">S/ {{ Number(estimacion.costoEstimado.totalEstimado).toFixed(2) }}</p>
        <p class="text-sm text-gray-600">Costo Directo: S/ {{ Number(estimacion.costoEstimado.costoDirecto).toFixed(2) }}</p>
        <p class="text-sm text-gray-600">Gastos Generales: S/ {{ Number(estimacion.costoEstimado.gastosGenerales).toFixed(2) }}</p>
      </td>
      <td class="border p-2">
        <button @click="verDetalle(estimacion.estimacionId)" class="bg-blue-500 text-white px-2 py-1 rounded">Ver</button>
      </td>
    </tr>
  </tbody>
      </table>

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
      ordenDescendente: false // Por defecto, las estimaciones están en orden ascendente
    };
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
        }    this.ultimasEstimaciones = estimaciones.slice(-3);
  } catch (error) {
    console.error("Error al cargar las estimaciones:", error);
  }
},
cambiarOrden() {
    this.ordenAscendente = !this.ordenAscendente;
    this.ultimasEstimaciones.reverse(); // Invierte el orden del array
  },
    crearEstimacion() {
      this.$router.push("/nuevaestimacion");
    },
    buscarEstimaciones() {
      this.$router.push("/buscar-estimaciones");
    },
    verDetalle(id) {
      this.$router.push(`/detalle-estimacion/${id}`);
    }
  },
  mounted() {
    this.cargarEstimaciones();
  }
};
</script>
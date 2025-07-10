<template>
  <div class="device-dashboard">
    <!-- Introducción -->
    <div class="intro">
      <h1>Bienvenido a tu panel de dispositivos</h1>
      <p>Aquí puedes gestionar todos tus sensores conectados.</p>
      <p><strong>Tip:</strong> Asigna cada dispositivo a una planta para obtener información precisa.</p>
    </div>

    <!-- Estadísticas -->
    <div class="stats">
      <div class="card">Total: {{ devices.length }}</div>
      <div class="card">🟢 Activos: {{ activeCount }}</div>
      <div class="card">🔴 Inactivos: {{ inactiveCount }}</div>
    </div>

    <!-- Formulario de nuevo dispositivo -->
    <div class="new-device-form">
      <input v-model="newDevice.deviceName" placeholder="Nombre del dispositivo" />
      <input v-model="newDevice.connectionType" placeholder="Tipo de conexión" />
      <input v-model="newDevice.location" placeholder="Ubicación" />

      <select v-model="newDevice.myPlantId">
        <option disabled value="">🌿 Selecciona una planta (opcional)</option>
        <option v-for="plant in myPlants" :key="plant.myPlantId" :value="plant.myPlantId">
          {{ plant.customName }} - {{ plant.location }}
        </option>
      </select>

      <select v-model="newDevice.status">
        <option value="active">Activo</option>
        <option value="inactive">Inactivo</option>
      </select>

      <button @click="addDevice">Agregar</button>
    </div>

    <!-- Filtros -->
    <div class="filter">
      <input v-model="searchQuery" placeholder="🔍 Buscar por nombre o ubicación" />
    </div>

    <!-- Tabla -->
    <table class="device-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Ubicación</th>
          <th>Planta asignada</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="device in filteredDevices" :key="device.deviceId">
          <td>{{ device.deviceName }}</td>
          <td>{{ device.location }}</td>
          <td>
            <span v-if="device.myPlantId">
              {{ getPlantName(device.myPlantId) }}
            </span>
            <span v-else>No asignado</span>
          </td>
          <td>
            <span :class="['chip', device.status]">
              {{ device.status === 'active' ? '🟢 Activo' : '🔴 Inactivo' }}
            </span>
          </td>
          <td>
            <button @click="openSensors(device)">Sensores</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import iotservice from "@/main/services/deviceservice";
import plantservice from "@/main/services/plantservice";

export default {
  name: 'DeviceDashboard',
  data() {
    return {
      devices: [],
      myPlants: [],
      searchQuery: '',
      newDevice: {
        deviceName: '',
        myPlantId: '',
        connectionType: '',
        location: '',
        activatedAt: new Date().toISOString(),
        status: 'inactive',
        firmwareVersion: ''
      }
    };
  },
  computed: {
    filteredDevices() {
      return this.devices.filter(device =>
        device.deviceName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        device.location.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    activeCount() {
      return this.devices.filter(d => d.status === 'active').length;
    },
    inactiveCount() {
      return this.devices.filter(d => d.status !== 'active').length;
    }
  },
  methods: {
    getPlantName(plantId) {
      const plant = this.myPlants.find(p => p.myPlantId === plantId);
      return plant ? `${plant.customName} (${plant.location})` : "No asignado";
    },
    async loadDevices() {
      try {
        this.devices = await iotservice.getAllDevicesByUser();
      } catch (error) {
        console.error("❌ Error cargando dispositivos:", error);
      }
    },
    async loadUserPlants() {
      try {
        this.myPlants = await plantservice.getAllPlantsByUser();
      } catch (error) {
        console.error("❌ Error cargando plantas del usuario:", error);
      }
    },
    async addDevice() {
      try {
        if (!this.newDevice.deviceName || !this.newDevice.location) {
          alert("Por favor completa los campos requeridos.");
          return;
        }
        await iotservice.createIotDevice(this.newDevice);
        await this.loadDevices();
        this.newDevice = {
          deviceName: '',
          myPlantId: '',
          connectionType: '',
          location: '',
          activatedAt: new Date().toISOString(),
          status: 'inactive',
          firmwareVersion: ''
        };
      } catch (error) {
        console.error("❌ Error agregando dispositivo:", error);
      }
    },
    openSensors(device) {
      this.$router.push({ name: 'sensors', params: { deviceId: device.deviceId } });
    },
    editDevice(device) {
      alert(`Editar dispositivo: ${device.deviceName}`);
    },
    async deleteDevice(id) {
      try {
        await iotservice.deleteIotDevice(id);
        await this.loadDevices();
      } catch (error) {
        console.error("❌ Error eliminando dispositivo:", error);
      }
    }
  },
  async mounted() {
    await Promise.all([
      this.loadDevices(),
      this.loadUserPlants()
    ]);
  }
};
</script>

<style scoped>
.device-dashboard {
  margin-top: -20px;
  padding: 1rem;
}
.intro { margin-bottom: 2rem; }
.stats {
  display: flex; gap: 1rem; margin-bottom: 1.5rem;
}
.card {
  background: #e3f5e7;
  padding: 1rem;
  border-radius: 8px;
  font-weight: bold;
  flex: 1;
}
.new-device-form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
.new-device-form input,
.new-device-form select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  flex: 1;
  min-width: 150px;
}
.new-device-form button {
  padding: 0.5rem 1rem;
  background-color: #2a7028;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.new-device-form button:hover {
  background-color: #25631f;
}
.filter input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.device-table {
  width: 100%;
  border-collapse: collapse;
}
.device-table th,
.device-table td {
  border: 1px solid #ccc;
  padding: 0.75rem;
  text-align: left;
}
.device-table th {
  background-color: #f4f4f4;
}
.chip {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}
.active {
  background: #d4edda;
  color: #155724;
}
.inactive {
  background: #f8d7da;
  color: #721c24;
}
button {
  margin-right: 5px;
  padding: 4px 8px;
  border: none;
  background: #eee;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #ddd;
}
</style>

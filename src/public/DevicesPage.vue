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
      <input v-model="newDevice.name" placeholder="Nombre del dispositivo" />
      <input v-model="newDevice.serial" placeholder="Número de serie" />
      <input v-model="newDevice.location" placeholder="Ubicación" />
      <input v-model="newDevice.plantName" placeholder="Planta asignada (opcional)" />
      <select v-model="newDevice.status">
        <option value="active">Activo</option>
        <option value="inactive">Inactivo</option>
      </select>
      <button @click="addDevice">Agregar</button>
    </div>

    <!-- Filtros -->
    <div class="filter">
      <input v-model="searchQuery" placeholder="🔍 Buscar por nombre o serial" />
    </div>

    <!-- Tabla de dispositivos -->
    <table class="device-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Serial</th>
          <th>Ubicación</th>
          <th>Planta asignada</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="device in filteredDevices" :key="device.id">
          <td>{{ device.name }}</td>
          <td>{{ device.serial }}</td>
          <td>{{ device.location }}</td>
          <td>{{ device.plantName || 'No asignado' }}</td>
          <td>
            <span :class="['chip', device.status]">
              {{ device.status === 'active' ? '🟢 Activo' : '🔴 Inactivo' }}
            </span>
          </td>
          <td>
            <button @click="editDevice(device)">Editar</button>
            <button @click="deleteDevice(device.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'DeviceDashboard',
  data() {
    return {
      devices: [
        {
          id: 1,
          name: 'Sensor 1',
          serial: 'ABC123',
          location: 'Jardín',
          status: 'active',
          plantName: 'Rosa'
        },
        {
          id: 2,
          name: 'Sensor 2',
          serial: 'XYZ456',
          location: 'Interior',
          status: 'inactive',
          plantName: null
        }
      ],
      searchQuery: '',
      newDevice: {
        name: '',
        serial: '',
        location: '',
        plantName: '',
        status: 'inactive'
      }
    };
  },
  computed: {
    filteredDevices() {
      return this.devices.filter(device =>
        device.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        device.serial.toLowerCase().includes(this.searchQuery.toLowerCase())
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
    addDevice() {
      if (!this.newDevice.name || !this.newDevice.serial || !this.newDevice.location) {
        alert("Por favor completa los campos requeridos.");
        return;
      }

      const newId = this.devices.length ? Math.max(...this.devices.map(d => d.id)) + 1 : 1;
      this.devices.push({ id: newId, ...this.newDevice });

      // Resetear el formulario
      this.newDevice = {
        name: '',
        serial: '',
        location: '',
        plantName: '',
        status: 'inactive'
      };
    },
    editDevice(device) {
      alert(`Editar dispositivo: ${device.name}`);
    },
    deleteDevice(id) {
      this.devices = this.devices.filter(d => d.id !== id);
    }
  }
};
</script>

<style scoped>
.device-dashboard {
  margin-top: -40px;
  padding: 1rem;
}

/* INTRO */
.intro {
  margin-bottom: 2rem;
}

/* STATS */
.stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.card {
  background: #e3f5e7;
  padding: 1rem;
  border-radius: 8px;
  font-weight: bold;
  flex: 1;
}

/* FORMULARIO NUEVO DISPOSITIVO */
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

/* FILTRO */
.filter input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

/* TABLA */
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

/* ESTADO */
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

/* BOTONES */
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

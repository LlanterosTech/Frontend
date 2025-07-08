<template>
  <div class="device-sensors">
    <h2>🔧 Sensores del dispositivo: {{ device?.deviceName }}</h2>

    <section v-if="sensors.length">
      <table class="sensor-table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Rango</th>
            <th>Unidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sensor in sensors" :key="sensor.sensorId">
            <td>{{ sensor.sensorType }}</td>
            <td>{{ sensor.rangeMin }} - {{ sensor.rangeMax }}</td>
            <td>              <span class="unit-badge">{{ sensor.unit }}</span>
</td>
            <td>
              <button @click="removeSensor(sensor.sensorId)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <p v-else>🌱 Este dispositivo no tiene sensores asignados.</p>

    <hr />

    <h3>➕ Agregar nuevo sensor</h3>
    <div class="new-sensor-form">
      <input v-model="newSensor.sensorType" placeholder="Tipo de sensor" />
      <button @click="addSensor">Agregar Sensor</button>
    </div>
  </div>
</template>

<script>
import iotservice from '@/main/services/deviceservice';

export default {
  name: 'DeviceSensorsView',
  data() {
    return {
      device: null,
      sensors: [],
      newSensor: {
        sensorType: '',
        unit: ''
      }
    };
  },
  async created() {
    const deviceId = this.$route.params.deviceId;
    await this.loadDevice(deviceId);
    await this.loadSensors(deviceId);
  },
  methods: {
    async loadDevice(deviceId) {
      try {
        this.device = await iotservice.getMyDeviceById(deviceId);
      } catch (error) {
        console.error('❌ Error cargando dispositivo:', error);
      }
    },
    async loadSensors(deviceId) {
      try {
        this.sensors = await iotservice.getMySensorByDeviceId(deviceId);
      } catch (error) {
        console.error('❌ Error cargando sensores:', error);
      }
    },
    async addSensor() {
      if (!this.newSensor.sensorType) {
        alert('Completa el formulario con tipo y unidad');
        return;
      }

      try {
        await iotservice.createSensor({
          ...this.newSensor,
          deviceId: this.device.deviceId
        });
        await this.loadSensors(this.device.deviceId);
        this.newSensor = { sensorType: '' };
      } catch (error) {
        console.error('❌ Error creando sensor:', error);
      }
    },
    async removeSensor(sensorId) {
      try {
        await iotservice.deleteSensor(sensorId);
        await this.loadSensors(this.device.deviceId);
      } catch (error) {
        console.error('❌ Error eliminando sensor:', error);
      }
    }
  }
};
</script>

<style scoped>
.device-sensors {
  padding: 2rem;
}

.sensor-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

.sensor-table th,
.sensor-table td {
  border: 1px solid #ccc;
  padding: 0.75rem;
}

.sensor-table th {
  background-color: #f4f4f4;
}

.unit-badge {
  background-color: #e3f5e7;
  border-radius: 6px;
  padding: 2px 6px;
  margin-right: 8px;
  font-size: 12px;
  color: #155724;
}

.new-sensor-form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.new-sensor-form input {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.new-sensor-form button {
  padding: 0.5rem 1rem;
  background-color: #2a7028;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.new-sensor-form button:hover {
  background-color: #25631f;
}
</style>

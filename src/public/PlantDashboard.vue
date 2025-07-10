<template>
  <div class="dashboard">
    <h2 class="dashboard-title">{{ myPlant?.customName || 'Mi Planta' }}</h2>

    <div class="plant-overview">
      <img :src="myPlant?.photoUrl" alt="Planta" class="plant-image" />
      <div class="plant-info">
        <p><strong>Ubicación:</strong> {{ myPlant?.location }}</p>
        <p>
          <strong>Estado actual: </strong>
          <span :class="statusColor(myPlant?.currentStatus)">
            {{ myPlant?.currentStatus }}
          </span>
        </p>
        <p><strong>Fecha de adquisición:</strong> {{ formatDate(myPlant?.acquiredAt) }}</p>
      </div>
    </div>

    <div class="section">
      <h3>Temperatura (°C)</h3>
      <RealTimeChart :sensorData="sensorReadings.AirTemperature" label="Temperatura" unit="°C" />
    </div>

    <div class="section">
      <h3>Humedad del Suelo</h3>
      <RealTimeChart :sensorData="sensorReadings.SoilMoisture" label="Humedad del Suelo" unit="u" />
    </div>

    <div class="section">
      <h3>Luz</h3>
      <RealTimeChart :sensorData="sensorReadings.Light" label="Luz" unit="lx" />
    </div>

    <div class="section">
      <h3>Humedad Ambiental</h3>
      <RealTimeChart :sensorData="sensorReadings.AirHumidity" label="Humedad Ambiental" unit="%" />
    </div>

    <div class="section">
      <h3>Lecturas de sensores</h3>
      <table class="data-table">
        <thead>
        <tr>
          <th>Sensor</th>
          <th>Valor</th>
          <th>Unidad</th>
          <th>Fecha</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="r in sensor" :key="r.sensorId">
          <td>{{ r.sensorType }}</td>
          <td>{{ r.value }}</td>
          <td>{{ r.unit }}</td>
          <td>{{ formatDate(r.timestamp) }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h3>Historial de salud</h3>
      <table class="data-table">
        <thead>
        <tr>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Fuente</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="healthLogs.length === 0">
          <td colspan="3">No hay historial de salud generado aún.</td>
        </tr>
        <tr v-for="log in healthLogs" :key="log.healthLogId">
          <td>{{ formatDate(log.timestamp) }}</td>
          <td>{{ log.healthStatus }}</td>
          <td>{{ log.source }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h3>Tareas de cuidado</h3>
      <table class="data-table">
        <thead>
        <tr>
          <th>Tarea</th>
          <th>Fecha</th>
          <th>Estado</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="careTasks.length === 0">
          <td colspan="3">No hay tareas pendientes generadas.</td>
        </tr>
        <tr v-for="task in careTasks" :key="task.taskId">
          <td>{{ task.taskType }}</td>
          <td>{{ formatDate(task.scheduledFor) }}</td>
          <td :class="task.status === 'Completed' ? 'status-done' : 'status-pending'">
            {{ task.status }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h3>Alertas</h3>
      <table class="data-table">
        <thead>
        <tr>
          <th>Tipo</th>
          <th>Mensaje</th>
          <th>Severidad</th>
          <th>Fecha</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="alerts.length === 0">
          <td colspan="4">No hay alertas generadas.</td>
        </tr>
        <tr v-for="alert in alerts" :key="alert.alertId">
          <td>{{ alert.alertType }}</td>
          <td>{{ alert.message }}</td>
          <td :class="'level-' + alert.level">{{ alert.level }}</td>
          <td>{{ formatDate(alert.generatedAt) }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import plantservice from '@/main/services/plantservice';
import deviceservice from '@/main/services/deviceservice';
import RealTimeChart from '@/components/RealTimeChart.vue';

export default {
  name: 'PlantDashboard',
  components: {
    RealTimeChart
  },
  data() {
    return {
      myPlant: null,
      sensor: [],
      careTasks: [],
      healthLogs: [],
      alerts: [],
      updateInterval: null,
      sensorReadings: {
        AirTemperature: [],
        SoilMoisture: [],
        Light: [],
        AirHumidity: []
      }
    };
  },
  created() {
    const plantId = this.$route.params.plantId;
    this.fetchDashboardData(plantId);
    this.updateInterval = setInterval(() => {
      this.updateSensorReadings();
    }, 5000);
  },
  beforeUnmount() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  },
  methods: {
    async fetchDashboardData(plantId) {
      try {
        await this.updateSensorReadings();
        const plant = await plantservice.getMyPlantById(plantId);
        this.myPlant = plant;
      } catch (err) {
        console.error('Error cargando dashboard:', err);
      }
    },
    async updateSensorReadings() {
      try {
        const devices = await deviceservice.getAllDevicesByUser();
        const deviceIds = Array.isArray(devices) ? devices.map(d => d.deviceId) : [];
        let sensores = [];
        if (deviceIds.length > 0) {
          const sensorArrays = await Promise.all(
              deviceIds.map(deviceId =>
                  deviceservice.getAllSensorsByDeviceId(deviceId).catch(() => [])
              )
          );
          sensores = sensorArrays.flat();
          await this.loadSensorReadings(sensores);
        } else {
          this.sensor = [];
        }
      } catch (error) {
        console.error('Error actualizando lecturas:', error);
      }
    },
    async loadSensorReadings(sensores) {
      const sensorWithReadings = await Promise.all(
          sensores.map(async (sensor) => {
            try {
              const readings = await deviceservice.getMySensorReadingBySensorId(sensor.sensorId);
              let latestReading = null;
              if (Array.isArray(readings) && readings.length > 0) {
                latestReading = readings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
                const value = Number(latestReading.value);
                if (this.sensorReadings[sensor.sensorType]) {
                  this.sensorReadings[sensor.sensorType].push({
                    timestamp: latestReading.timestamp,
                    value
                  });
                  if (this.sensorReadings[sensor.sensorType].length > 20) {
                    this.sensorReadings[sensor.sensorType].shift();
                  }
                }
              }
              return {
                sensorId: sensor.sensorId,
                sensorType: sensor.sensorType,
                unit: sensor.unit ?? 'N/A',
                value: latestReading?.value ?? 'N/A',
                timestamp: latestReading?.timestamp || null
              };
            } catch (error) {
              return {
                sensorId: sensor.sensorId,
                sensorType: sensor.sensorType,
                unit: sensor.unit ?? 'N/A',
                value: 'N/A',
                timestamp: null
              };
            }
          })
      );
      this.sensor = sensorWithReadings;
      this.generateAlertsAndTasks();
    },
    generateAlertsAndTasks() {
      const alerts = [];
      const tasks = [];
      this.sensor.forEach(s => {
        if (s.value === 'N/A' || s.value == null) return;
        const val = Number(s.value);
        if (s.sensorType === 'SoilMoisture' && val < 1000) {
          alerts.push({ alertId: `${s.sensorId}-low-moisture`, alertType: 'Humedad Baja', message: 'Nivel de humedad del suelo es bajo.', level: 'advertencia', generatedAt: s.timestamp });
          tasks.push({ taskId: `${s.sensorId}-water`, taskType: 'Regar la planta', scheduledFor: new Date().toISOString(), status: 'Pending' });
        }
        if (s.sensorType === 'AirTemperature' && val > 35) {
          alerts.push({ alertId: `${s.sensorId}-high-temp`, alertType: 'Temperatura Alta', message: 'La temperatura ambiente es muy alta.', level: 'crítica', generatedAt: s.timestamp });
          tasks.push({ taskId: `${s.sensorId}-shade`, taskType: 'Mover a sombra', scheduledFor: new Date().toISOString(), status: 'Pending' });
        }
        if (s.sensorType === 'Light' && val < 400) {
          alerts.push({ alertId: `${s.sensorId}-low-light`, alertType: 'Poca Luz', message: 'Nivel de luz insuficiente.', level: 'advertencia', generatedAt: s.timestamp });
          tasks.push({ taskId: `${s.sensorId}-move-light`, taskType: 'Reubicar en lugar con más luz', scheduledFor: new Date().toISOString(), status: 'Pending' });
        }
        if (s.sensorType === 'AirHumidity' && val < 30) {
          alerts.push({ alertId: `${s.sensorId}-low-humidity`, alertType: 'Humedad Baja', message: 'El ambiente está muy seco.', level: 'advertencia', generatedAt: s.timestamp });
          tasks.push({ taskId: `${s.sensorId}-spray`, taskType: 'Pulverizar agua', scheduledFor: new Date().toISOString(), status: 'Pending' });
        }
      });
      this.alerts = alerts;
      this.careTasks = tasks;
    },
    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleString();
    },
    statusColor(status) {
      return status === 'Healthy' ? 'status-ok' : 'status-warning';
    }
  }
};
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1100px;
  margin: auto;
}
.dashboard-title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
}
.plant-overview {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
}
.plant-image {
  width: 150px;
  height: 150px;
  border-radius: 12px;
  object-fit: cover;
}
.section {
  margin-bottom: 2rem;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}
.data-table th,
.data-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}
.status-ok {
  color: green;
}
.status-warning {
  color: orange;
}
.status-done {
  color: green;
  font-weight: bold;
}
.status-pending {
  color: orange;
}
.level-info {
  color: blue;
}
.level-advertencia {
  color: orange;
}
.level-crítica {
  color: red;
  font-weight: bold;
}
</style>

<template>
  <div class="dashboard">
    <h2 class="dashboard-title">{{ myPlant?.customName || 'Mi Planta' }}</h2>

    <div class="plant-overview">
      <img :src="myPlant?.photoUrl" alt="Planta" class="plant-image" />
      <div class="plant-info">
        <p><strong>Ubicación:</strong> {{ myPlant?.location }}</p>
        <p>
          <strong>Estado actual:</strong>
          <span :class="statusColor(myPlant?.currentStatus)">
            {{ myPlant?.currentStatus }}
          </span>
        </p>
        <p><strong>Fecha de adquisición:</strong> {{ formatDate(myPlant?.acquiredAt) }}</p>
      </div>
    </div>

    <!-- Sección: Sensor readings -->
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

    <!-- Sección: Health log -->
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
          <tr v-for="log in healthLogs" :key="log.healthLogId">
            <td>{{ formatDate(log.timestamp) }}</td>
            <td>{{ log.healthStatus }}</td>
            <td>{{ log.source }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Sección: Tareas -->
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

    <!-- Sección: Alertas -->
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
import deviceservice from "@/main/services/deviceservice";

export default {
  name: 'PlantDashboard',
  data() {
    return {
      myPlant: null,
      sensor: [],
      careTasks: [],
      healthLogs: [],
      alerts: [],
      updateInterval: null,
    };
  },
  created() {
    const plantId = this.$route.params.plantId;
    this.fetchDashboardData(plantId);

    // Refrescado cada 5 segundos
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

        // Cargar datos de la planta
        const plant = await plantservice.getMyPlantById(plantId);
        this.myPlant = plant;

      } catch (err) {
        console.error('❌ Error cargando dashboard:', err);
      }
    },

    async updateSensorReadings() {
      try {
        // Volver a traer TODO: dispositivos, sensores y lecturas
        const devices = await deviceservice.getAllDevicesByUser();
        const deviceIds = Array.isArray(devices) ? devices.map(d => d.deviceId) : [];

        let sensores = [];
        if (deviceIds.length > 0) {
          const sensorPromises = deviceIds.map(deviceId =>
            deviceservice.getAllSensorsByDeviceId(deviceId).catch(() => [])
          );
          const sensorArrays = await Promise.all(sensorPromises);
          sensores = sensorArrays.flat();

          await this.loadSensorReadings(sensores);
          console.log('✅ Lecturas de sensores actualizadas');
        } else {
          this.sensor = [];
        }
      } catch (error) {
        console.error('❌ Error actualizando lecturas de sensores:', error);
      }
    },

    async loadSensorReadings(sensores) {
      const sensorWithReadings = await Promise.all(
        sensores.map(async (sensor) => {
          try {
            const readings = await deviceservice.getMySensorReadingBySensorId(sensor.sensorId);
            console.log(`🔎 Todas las lecturas para ${sensor.sensorType}:`, readings);

            let latestReading = null;
            if (Array.isArray(readings) && readings.length > 0) {
              latestReading = readings.sort(
                (a, b) =>
                  new Date(b.timestamp || b.createdAt || b.date) -
                  new Date(a.timestamp || a.createdAt || a.date)
              )[0];
            }

            console.log(`✅ Última lectura para ${sensor.sensorType}:`, latestReading);

            return {
              sensorId: sensor.sensorId,
              sensorType: sensor.sensorType,
              unit: sensor.unit ?? 'N/A',
              value: latestReading?.value ?? 'N/A',
              timestamp: latestReading?.timestamp || latestReading?.createdAt || latestReading?.date || null
            };
          } catch (error) {
            console.warn(`⚠️ Error obteniendo lecturas para sensor ${sensor.sensorId}:`, error);
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

<template>
  <div class="dashboard">
    <h2 class="dashboard-title">{{ myPlant?.customName || 'Mi Planta' }}</h2>

    <div class="plant-overview">
      <img :src="myPlant?.photoUrl" alt="Planta" class="plant-image" />
      <div class="plant-info">
        <p><strong>Ubicación:</strong> {{ myPlant?.location }}</p>
        <p><strong>Estado actual:</strong> <span :class="statusColor(myPlant?.currentStatus)">
          {{ myPlant?.currentStatus }}</span>
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
          <tr v-for="r in sensorReadings" :key="r.readingId">
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

export default {
  name: 'PlantDashboard',
  data() {
    return {
      myPlant: null,
      sensorReadings: [],
      careTasks: [],
      healthLogs: [],
      alerts: []
    };
  },
  created() {
    const plantId = this.$route.params.plantId;
    this.fetchDashboardData(plantId);
  },
  methods: {
    async fetchDashboardData(plantId) {
      try {
        const [plant, readings, tasks, logs, alerts] = await Promise.all([
          plantservice.getMyPlantById(plantId),
      
        ]);

        this.myPlant = plant;
        this.sensorReadings = readings;
        this.careTasks = tasks;
        this.healthLogs = logs;
        this.alerts = alerts;
      } catch (err) {
        console.error('Error cargando dashboard:', err);
      }
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

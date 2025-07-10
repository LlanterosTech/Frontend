<template>
  <div>
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

export default {
  name: 'RealTimeChart',
  components: { Line },
  props: {
    sensorData: Array,
    label: {
      type: String,
      default: 'Sensor'
    },
    unit: {
      type: String,
      default: ''
    }
  },
  computed: {
    chartData() {
      return {
        labels: this.sensorData.map(d => new Date(d.timestamp).toLocaleTimeString()),
        datasets: [
          {
            label: `${this.label} (${this.unit})`,
            data: this.sensorData.map(d => d.value),
            borderColor: 'rgba(75,192,192,1)',
            tension: 0.3,
            fill: false,
            pointRadius: 3,
            pointHoverRadius: 6,
          }
        ]
      };
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 5
            }
          }
        },
        plugins: {
          legend: {
            display: true
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        }
      };
    }
  }
};
</script>

<style scoped>
div {
  height: 300px;
}
</style>

<template>
  <div class="background-layer"></div>
  <div class="my-plants-view content-layer">
  <div class="my-plants-view">
    <h1 class="title">Mis Plantas 🌿</h1>

    <div v-if="myPlants.length" class="plant-list">
      <div v-for="plant in myPlants" :key="plant.myPlantId" class="plant-card">
        <img :src="plant.photoUrl" alt="Imagen planta" class="plant-image" />
        <div class="plant-info">
          <h2>{{ plant.customName }}</h2>
          <p><strong>Ubicación:</strong> {{ plant.location }}</p>
          <p><strong>Estado:</strong> {{ plant.currentStatus }}</p>
          <p><strong>Nota:</strong> {{ plant.note }}</p>
<router-link :to="`/dashboard-myplant/${plant.myPlantId}`" class="btn-view">Ver Detalles</router-link>
        </div>
      </div>
    </div>

    <div v-else class="no-plants">
      <p>No tienes plantas registradas todavía.</p>
      <router-link to="/identificar" class="btn-primary">Identificar y Registrar Planta</router-link>
    </div>
  </div>
  </div>
</template>

<script>
import myPlantService from "@/main/services/plantservice";

export default {
  data() {
    return {
      myPlants: [],
    };
  },
  async created() {
    try {
      this.myPlants = await myPlantService.getAllPlantsByUser();
    } catch (error) {
      console.error("Error al obtener mis plantas:", error);
    }
  },
  
};
</script>

<style scoped>
.my-plants-view {
  background: #e6f3e6;
  flex: 1;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
}

.plant-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}

.plant-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 280px;
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
  top: 0;
}

.plant-card:hover {
  transform: scale(1.02);
}

.plant-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.plant-info {
  padding: 1rem;
}

.btn-view {
  display: inline-block;
  margin-top: 0.8rem;
  background: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
}

.no-plants {
  text-align: center;
  margin-top: 3rem;
}

.btn-primary {
  background: #4caf50;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  margin-top: 1rem;
  display: inline-block;
}

.background-layer {
  background-color: #e6f3e6;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 50px;
  height: 100vh;
  width: 100vw;
  z-index: 0;
}

.content-layer {
  position: relative;
  z-index: 1;
}


</style>

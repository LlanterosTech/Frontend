<template>
  <div class="register-container">
    <!-- Columna izquierda -->
    <div class="plant-info">
      <img :src="plant.imageUrl" class="plant-image" alt="Foto de la planta" />
      <div class="plant-details">
        <p><strong>Nombre común:</strong> {{ plant.commonName }}</p>
        <p><strong>Nombre científico:</strong> {{ plant.scientificName }}</p>
        <p><strong>Descripción:</strong> {{ plant.description }}</p>
      </div>
    </div>

    <!-- Columna derecha -->
    <div class="user-form">
      <h2>Registrar Mi Planta</h2>
      <label>Nombre personalizado</label>
      <input type="text" v-model="myPlant.customName" />

      <label>Ubicación</label>
      <input type="text" v-model="myPlant.location" />

      <label>Nota</label>
      <textarea v-model="myPlant.note" rows="3" />

      <label>Fecha de adquisición</label>
      <input type="date" v-model="myPlant.acquiredAt" />

      <button class="btn-save" @click="saveMyPlant">
        Guardar Planta
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    plant: Object, // Datos técnicos de la planta ya identificada
    imageFile: File // Imagen que el usuario subió
  },
  data() {
    return {
      myPlant: {
        customName: '',
        location: '',
        note: '',
        acquiredAt: new Date().toISOString().split("T")[0],
      }
    };
  },
  methods: {
    async saveMyPlant() {
      try {
        const formData = new FormData();
        formData.append("customName", this.myPlant.customName);
        formData.append("location", this.myPlant.location);
        formData.append("note", this.myPlant.note);
        formData.append("acquiredAt", this.myPlant.acquiredAt);
        formData.append("photo", this.imageFile);
        formData.append("plantId", this.plant.plantId); // ID devuelto al identificar

        const response = await this.$axios.post("/myplants", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        alert("🌱 ¡Tu planta ha sido registrada!");
        this.$router.push("/mis-plantas");
      } catch (error) {
        console.error("❌ Error al registrar la planta:", error);
      }
    }
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  gap: 40px;
  padding: 40px;
  background: #f1f9f1;
  border-radius: 15px;
  max-width: 1200px;
  margin: 0 auto;
}

.plant-info {
  flex: 1;
  text-align: center;
}

.plant-image {
  width: 100%;
  max-width: 350px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.plant-details p {
  font-size: 1.1rem;
  margin: 8px 0;
  text-align: left;
}

.user-form {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.user-form h2 {
  margin-bottom: 20px;
  color: #3b703c;
}

.user-form label {
  margin-top: 10px;
  font-weight: bold;
}

.user-form input,
.user-form textarea {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

.btn-save {
  margin-top: 20px;
  padding: 12px;
  background-color: #4caf50;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s ease;
}

.btn-save:hover {
  background-color: #388e3c;
}
</style>

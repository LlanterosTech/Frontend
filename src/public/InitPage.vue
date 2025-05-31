<template>
  <div class="fondo">
    <div class="container">

      <!-- HEADER COMPLETO -->
      <div class="header">
        <div class="logo">
          <img src="@/assets/logo.png" alt="Logo" />
        </div>

        <div class="nav-links">
          <a href="#">Acerca de nosotros</a>
          <a href="#">Catálogo</a>
        </div>

        <div class="user-icon">
          <i class="fas fa-user-circle"></i>
        </div>
      </div>


      <!-- CONTENIDO PRINCIPAL -->
      <div class="main-content-row">
        <div class="main-card">
          <h2 class="welcome-title">¡Hola, {{ userName || 'invitado' }}!</h2>
          <p class="subtitle">Sube una imagen para identificar tu planta</p>

        <label for="plantImage" class="upload-label">
          <i class="fas fa-upload"></i> Seleccionar imagen
          <input type="file" id="plantImage" @change="handleImageUpload" accept="image/*" />
        </label>

        <button class="btn-identify" @click="identifyPlant" :disabled="!selectedImage">
          <i class="fas fa-search"></i> Identificar Planta
        </button>
        </div>

        <!-- Resultado y Formulario -->
        <div v-if="identifiedPlant" class="result-form-wrapper">
          <div class="result-card">
            <h3>🌿 Resultado</h3>
            <img :src="identifiedPlant.imageUrl" alt="Planta" class="plant-image" />
            <p><strong>Nombre científico:</strong><br />{{ identifiedPlant.scientificName }}</p>
          </div>

          <form @submit.prevent="submitForm" class="form-card">
            <h3>📋 Registra tu planta</h3>

            <label for="field1">Nombre</label>
            <input id="field1" v-model="formData.customName" type="text" placeholder="Ej. Mi ficus favorito" />

            <label for="field2">Ubicación</label>
            <input id="field2" v-model="formData.location" type="text" placeholder="Ej. Jardín trasero" />

            <label for="field3">Descripción</label>
            <input id="field3" v-model="formData.note" type="text" placeholder="Ej. Planta con sombra parcial" />

            <button type="submit" class="btn-primary">Registrar</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <footer class="footer">
      © Todos los derechos reservados por Plantita
    </footer>
</template>


<script>
import userService from "@/main/services/userservice";
import plantservice from "@/main/services/plantservice";

export default {
  data() {
    return {
      userName: "",
      selectedImage: null,
      identifiedPlant: null,
      plantId: null,
      isSidebarExpanded: false,
      formData: {
        customName: "",
        location: "",
        note: ""
      }
    };
  },
  async created() {
    await this.loadUserData();
  },
  methods: {
    async loadUserData() {
      try {
        const user = await userService.getInfoUser();
        if (user) this.userName = user.name;
        else this.$router.push("/login");
      } catch {
        this.$router.push("/login");
      }
    },

    handleImageUpload(event) {
      this.selectedImage = event.target.files[0];
      console.log("📷 Imagen seleccionada:", this.selectedImage);
    },

    async identifyPlant() {
      if (!this.selectedImage) return;

      try {
        const formData = new FormData();
        formData.append("Image", this.selectedImage); // Usa la clave esperada por tu backend

        // Log para revisar lo que se envía
        console.log("📦 FormData enviado:");
        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }

        const response = await plantservice.identifySavePlant(formData);
        this.plantId = response.plantId;
        this.identifiedPlant = response;

        console.log("✅ Planta identificada:", response);
      } catch (error) {
        console.error("❌ Error identificando planta:", error);
      }
    },

    async registerPlant() {
      try {
        await plantservice.registerPlant({ plantId: this.plantId });
        alert("🌱 Planta registrada con éxito!");
        this.identifiedPlant = null;
        this.selectedImage = null;
      } catch (err) {
        console.error("❌ Error registrando planta:", err);
      }
    },

    async submitForm() {
      try {
        const payload = {
          customName: this.formData.customName,
          location: this.formData.location,
          note: this.formData.note
        };

        await plantservice.sendFormData(this.plantId, payload);
        alert("Datos enviados con éxito!");

        // Limpiar formulario
        this.formData.customName = "";
        this.formData.location = "";
        this.formData.note = "";

      } catch (error) {
        console.error("Error enviando datos del formulario:", error);
        alert("Error enviando datos. Intenta nuevamente.");
      }
    }
  }
};

</script>


<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");

.fondo {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #555555;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Poppins', sans-serif;
  overflow: hidden;
  z-index: 0;
  min-height: unset;
  max-width: unset;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

.fondo::before {
  content: "";
  position: absolute;
  inset: 0;
  backdrop-filter: blur(5px);
  background: rgba(0,0,0,0.1);
  z-index: 0;
}

.container {
  position: relative;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;

  margin: 0;
  padding: 40px 30px;
  box-sizing: border-box;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #028090;
  padding: 0 32px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.logo {
  background-color: #ffffff22;
  padding: 6px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo img {
  width: 42px;
  height: auto;
  border-radius: 8px;
  object-fit: contain;
}

.main-card {
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  box-shadow: 0 12px 28px rgba(0,0,0,0.15);
  text-align: center;
  width: 100%;
  max-width: 420px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}

.subtitle {
  font-size: 1.1rem;
  color: #666;
}

upload-label {
  display: inline-block;
  padding: 12px 20px;
  background-color: #6aaa29;
  color: white;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s ease;
  font-size: 1rem;
  position: relative;
}

.upload-label i {
  margin-right: 8px;
}

.upload-label input[type="file"] {
  display: none;
}

.upload-label:hover {
  background-color: #85c940;
}

.btn-identify {
  background-color: #333;
  color: white;
  border: none;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-identify:hover:not(:disabled) {
  background-color: #000;
}

.btn-identify:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}


.form-upload > div:first-child {
  flex: 1 1 45%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-upload button {
  font-size: 1.1rem;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.25s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 8px 25px;
}

.form-upload label {
  background: #6aaa29;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  padding: 8px 15px;
}
.form-upload label:hover {
  background: #6aaa29;
  color: white;
}

.form-upload button:hover:not(:disabled) {
  transform: scale(1.05);
}

.form-upload input[type="file"] {
  display: none;
}

.plant-result h2 {
  margin-bottom: 15px;
  color: #000000;
  text-align: center;
  font-weight: 700;
}

.btn-primary {
  background: #6aaa29;
  border-radius: 28px;
  border: none;
  color: white;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 12px rgba(106, 170, 41, 0.5);
  transition: background-color 0.3s ease, transform 0.25s ease;
  margin-top: 15px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding: 10px 35px;
}

.btn-primary:hover {
  background: #67a62c;
  transform: scale(1.1);
}

.footer {
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  position: fixed;
  bottom: 12px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.75);
  user-select: none;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-shadow: 0 0 6px rgba(0,0,0,0.5);
}

.result-form-wrapper {
  display: flex;
  gap: 32px;
  justify-content: center;
  margin-top: 24px;
}

.result-card, .form-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px 20px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
  max-width: 320px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
  animation: fadeIn 0.6s ease;
}

.result-card h3,
.form-card h3 {
  text-align: center;
  font-size: 1.3rem;
  color: #333;
  font-weight: 600;
  margin-bottom: 8px;
}

.plant-image {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 100%;
  height: auto;
  margin: auto;
}

.form-card input {
  padding: 10px 14px;
  font-size: 0.95rem;
  border-radius: 8px;
  border: 1px solid #bbb;
  transition: border 0.2s ease;
}

.form-card input:focus {
  border: 1px solid #6aaa29;
  outline: none;
}

@media screen and (max-width: 700px) {
  .result-form-wrapper {
    flex-direction: column;
    align-items: center;
  }
}

.plant-form h2 {
  margin-bottom: 15px;
  text-align: center;
  font-weight: 700;
  color: #000000;
}

.plant-form label {
  font-weight: 600;
  font-size: 1rem;
}

.plant-form input {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #999;
  font-size: 1rem;
}

.plant-form button {
  margin-top: 20px;
  align-self: center;
  width: 50%;
  font-size: 1.1rem;
}

@keyframes fadeIn {
  from {opacity: 0; transform: translateY(20px);}
  to {opacity: 1; transform: translateY(0);}
}

.nav-links {
  display: flex;
  gap: 32px;
  align-items: center;
}

.nav-links a {
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  position: relative;
  transition: color 0.2s ease;
}

.nav-links a::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: #fff;
  transition: width 0.3s ease;
}

.nav-links a:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

.nav-links a:hover::after {
  width: 100%;
}

.user-icon {
  font-size: 28px;
  color: #fff;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.user-icon i {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.user-icon i:hover {
  transform: scale(1.15);
}

.main-content-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 30px;
  width: 100%;
  justify-content: center;
}
</style>

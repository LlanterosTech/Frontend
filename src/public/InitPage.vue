<template>
  <div class="fondo">
    <div class="container">

  

      <!-- CONTENIDO PRINCIPAL -->
      <div class="main-layout" :class="{ 'sidebar-expanded': isSidebarExpanded }">
      <div class="glass-box">
          <h1 class="title">Bienvenido, {{ userName }}</h1>

          <div class="form-upload">
            <div class="form-inputs">
              <label for="plantImage">Sube una imagen de tu planta:</label>
              <input type="file" id="plantImage" @change="handleImageUpload" accept="image/*" />
              <div class="buttons-group">
                <button class="btn-secondary" @click="identifyPlant" :disabled="!selectedImage">
                  Identificar Planta
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Resultado y Formulario -->
        <div v-if="identifiedPlant" class="result-and-form-container">
          <div class="plant-result">
            <h2>Resultado:</h2>
            <img :src="identifiedPlant.imageUrl" alt="Planta" class="preview-image" />
            <p><strong>Nombre científico:</strong> {{ identifiedPlant.scientificName }}</p>
           </div>

           <form @submit.prevent="submitForm" class="plant-form">
             <h2>Registra tu planta</h2>

             <label for="field1">Nombre</label>
             <input id="field1" v-model="formData.customName" type="text" placeholder="Ingresa el nombre" />

             <label for="field2">Ubicación</label>
             <input id="field2" v-model="formData.location" type="text" placeholder="Ingresa la ubicación" />

             <label for="field3">Descripción</label>
             <input id="field3" v-model="formData.note" type="text" placeholder="Ingresa la descripción" />

             <button type="submit" class="btn-primary">Enviar</button>
           </form>
         </div>
       </div>
     </div>

     <!-- FOOTER -->
    <footer class="footer">
      © Todos los derechos reservados por Plantita
    </footer>
  </div>
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
  background-color: #a4d69f;
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
  background: rgba(228, 225, 225, 0.1);
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

.logo img {
  width: 20px;
  height: 20px;
}

.glass-box {
  flex: 0 0 350px;
  background: #ffffff;
  backdrop-filter: saturate(180%) blur(12px);
  border-radius: 18px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  color: #333333;
  padding: 40px 40px 50px 40px;
  max-height: 90vh;
  overflow-y: auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 25px;
}


.title {
  font-size: 2.2rem;
  font-weight: 700;
  color: black;
  text-shadow: 1px 1px 6px rgba(0, 0, 0, 0.4);
  margin-bottom: 20px;
}

.form-upload {
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  color: #222;
  font-weight: 600;
  font-size: 1.2rem;
  max-width: 350px;
  display: flex;
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

.buttons-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.form-upload button:hover:not(:disabled) {
  transform: scale(1.05);
}

.form-upload input[type="file"] {
  display: none;
}

.btn-secondary {
  background: #6aaa29;
  font-size: 1.35rem;
  font-weight: 600;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  color: white;
  box-shadow: 0 6px 12px rgba(106, 170, 41, 0.5);
  transition: all 0.3s ease;
  user-select: none;
  padding: 10px 35px;
}

.btn-secondary:hover:not(:disabled) {
  background: #8fca3f;
  transform: scale(1.12);
  box-shadow: 0 8px 20px rgba(143, 202, 63, 0.7);
}
.btn-secondary:disabled {
  background: #a3bba5;
  cursor: not-allowed;
  box-shadow: none;
  color: #e0e0e0;
}

.plant-result {
  flex: 1 1 50%;
  background: #e3f3d6;
  border-radius: 15px;
  padding: 30px 25px;
  box-shadow: 0 0 25px rgba(0,0,0,0.1);
  color: #000;
  text-align: left;
  animation: fadeIn 0.8s ease forwards;
  max-width: 100%;
}


.form-inputs {
  flex: 1 1 45%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.plant-result h2 {
  margin-bottom: 15px;
  color: #000000;
  text-align: center;
  font-weight: 700;
}

.preview-image {
  max-width: 150px;
  border-radius: 12px;
  margin-bottom: 15px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  display: block;
  margin-left: auto;
  margin-right: auto;
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
  position: fixed;
  bottom: 12px;
  width: 100%;
  text-align: center;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.75);
  user-select: none;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-shadow: 0 0 6px rgba(0,0,0,0.5);
}

.result-and-form-container {
  flex: 1 1 auto; /* ocupa espacio restante a la derecha */
  display: flex;
  gap: 30px;
  max-width: calc(100% - 390px); /* evita que se salga del contenedor */
  justify-content: flex-start;
  align-items: flex-start;
  background: transparent;
}

.plant-form {
  flex: 1 1 50%;
  background: #e6f2d4;
  border-radius: 15px;
  padding: 25px 20px;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
  max-width: 350px;
  width: 100%;
  color: #222;
  display: flex;
  flex-direction: column;
  gap: 15px;
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

.main-layout {
  display: flex;
  gap: 40px;
  justify-content: flex-start;
  align-items: flex-start;
  max-width: 100%;
  overflow-x: auto;
  padding-left: 80px;
  padding-bottom: 2rem;
  transition: padding-left 0.3s ease;
}

.main-layout.sidebar-expanded {
  padding-left: 200px;
}

@keyframes fadeIn {
  from {opacity: 0; transform: translateY(20px);}
  to {opacity: 1; transform: translateY(0);}
}

.logo img {
  width: 80px;
  height: auto;
}

.nav-links {
  display: flex;
  gap: 60px;
  align-items: center;
  margin-left: 30px;
}

.nav-links a {
  text-decoration: none;
  color: black;
  font-weight: 600;
  background: #00A6A6;
  padding: 6px 14px;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.nav-links a:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

.user-icon {
  font-size: 40px;
  color: #333;
  cursor: pointer;
  margin-right: 40px;
}

.user-icon i {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.user-icon i:hover {
  transform: scale(1.15);
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 170px;
  left: 0;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(6px);
  padding: 20px 10px;
  width: 60px;
  height: auto;
  border-radius: 0 12px 12px 0;
  box-shadow: 4px 4px 12px rgba(0,0,0,0.1);
  z-index: 2;
  transition: width 0.3s ease;
  overflow: hidden;
}

.sidebar.expanded {
  width: 200px;
}

.sidebar ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sidebar li {
  margin-bottom: 18px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.3s ease;
  cursor: pointer;
  white-space: nowrap;
}

.sidebar li span {
  display: none;
}

.sidebar.expanded li span {
  display: inline;
}

.toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 1.2rem;
  color: #333;
}

.sidebar li:hover {
  background: rgba(130, 180, 120, 0.3);
}

</style>

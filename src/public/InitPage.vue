<template>
  <div class="fondo">
    <div class="container">

      <div class="header">
        <div class="logo">
          <img src="@/assets/logo.png" alt="Logo" />
        </div>
      </div>

      <div class="main-layout">
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

        <!-- Derecha: fuera de glass-box, pero dentro de main-layout -->
        <div v-if="identifiedPlant" class="result-and-form-container">
          <div class="plant-result">
            <h2>Resultado:</h2>
            <img :src="identifiedPlant.imageUrl" alt="Planta" class="preview-image" />
            <p><strong>Nombre común:</strong> {{ identifiedPlant.commonName }}</p>
            <p><strong>Nombre científico:</strong> {{ identifiedPlant.scientificName }}</p>
            <p><strong>Descripción:</strong> {{ identifiedPlant.description }}</p>

            <button class="btn-primary" @click="registerPlant">
              Registrar Planta
            </button>
          </div>

          <form @submit.prevent="submitForm" class="plant-form">
            <h2>Formulario</h2>

            <label for="field1">Campo 1</label>
            <input id="field1" v-model="formData.campo1" type="text" placeholder="Ingresa valor 1" />

            <label for="field2">Campo 2</label>
            <input id="field2" v-model="formData.campo2" type="text" placeholder="Ingresa valor 2" />

            <label for="field3">Campo 3</label>
            <input id="field3" v-model="formData.campo3" type="text" placeholder="Ingresa valor 3" />

            <button type="submit" class="btn-primary">Enviar</button>
          </form>
        </div>
      </div>
    </div>

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
        this.plantId = response.id;
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
  background-color: #d1d1d1;
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
  max-width: 720px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 40px 30px;
  box-sizing: border-box;
}

.header {
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.25);
  padding: 8px 15px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.25);
  transition: transform 0.3s ease;
  cursor: pointer;
  z-index: 2;
  position: fixed;
}

.header:hover {
  transform: scale(1.05);
}

.logo img {
  width: 110px;
  height: auto;
}

.glass-box {
  flex: 0 0 350px; /* ancho fijo a la izquierda */
  background: white;
  backdrop-filter: saturate(180%) blur(12px);
  border-radius: 18px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  color: #333;
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
  color: #222;
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
  cursor: pointer;
  background: #4c7a28;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  padding: 8px 15px;
}
.form-upload label:hover {
  background: #73b139;
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
  background: #7E8C54;
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
  color: #e3f3d6;
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
  background: #4a7f21;
  border-radius: 28px;
  border: none;
  color: white;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 5px 12px rgba(74,127,33,0.6);
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
  color: #4a7f21;
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
  /* Para evitar scroll horizontal si la pantalla es pequeña */
  overflow-x: auto;
  padding-bottom: 2rem;
}

@keyframes fadeIn {
  from {opacity: 0; transform: translateY(20px);}
  to {opacity: 1; transform: translateY(0);}
}
</style>

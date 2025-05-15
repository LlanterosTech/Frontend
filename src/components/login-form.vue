<template>
  <AlertComponent v-if="alertMessage" :message="alertMessage" :type="alertType" @close="clearAlert" />

  <div class="container fondo">

   
    <div class="login-container">
  <div class="login-box">
    <div class="login">
      <img src="@/assets/logo.png" alt="Logo Activos Mineros" class="logo" />

      <form @submit.prevent="handleLogin">
        <div :class="['text-input', { 'input-error': inputError }]">
          <i class="ri-user-fill"></i>
          <input v-model="email" type="text" placeholder="Usuario" />
        </div>

        <div :class="['text-input', { 'input-error': inputError }]">
          <i class="ri-lock-fill"></i>
          <input v-model="password" type="password" placeholder="Contraseña" />
        </div>

        <div ref="recaptcha" class="g-recaptcha"></div>

        <button type="submit" class="login-btn">Iniciar Sesión</button>
      </form>

      <div class="create">
        <a @click.prevent="goToRegister" href="#">¿No tienes cuenta? Regístrate</a>
        <i class="ri-arrow-right-fill"></i>
      </div>
    </div>
  </div>

</div>


  </div>
</template>
<script>
import userService from "@/main/services/userservice";
import { loadRecaptcha } from "@/utils/recaptcha";
import AlertComponent from "@/components/AlertComponent.vue";

export default {
  components: {
    AlertComponent
  },
  data() {
    return {
      email: "",
      password: "",
      error: null,
      recaptchaSiteKey: "6Lc7S94qAAAAAE2ohl9u4JgSRLkqFCBd-ypbg9Wd",
      alertMessage: null,
      alertType: "error",
      inputError: false, // Estado para manejar el error en los inputs
    };
  },
  async mounted() {
    try {
      const grecaptcha = await loadRecaptcha();

      setTimeout(() => {
        if (!this.$refs.recaptcha) {
          console.error("No se encontró el div de reCAPTCHA en el DOM.");
          return;
        }

        grecaptcha.ready(() => {
          grecaptcha.render(this.$refs.recaptcha, {
            sitekey: this.recaptchaSiteKey,
            theme: "light"
          });
        });
      }, 500); 
    } catch (error) {
      console.error("Error al cargar reCAPTCHA:", error);
      this.error = "No se pudo cargar el reCAPTCHA. Intenta recargar la página.";
    }
  },
  methods: {
    showAlert(message, type = "error") {
      this.alertMessage = message;
      this.alertType = type;
    },
    clearAlert() {
      setTimeout(() => {
        this.alertMessage = null;
      }, 200);
    },
    async handleLogin(event) {
    if (event) event.preventDefault(); 
    console.log("🔥 handleLogin ejecutado");

    try {
        this.error = null;

        if (!window.grecaptcha || !window.grecaptcha.getResponse) {
            console.log("⚠️ reCAPTCHA no está cargado.");
            this.showAlert("Error: reCAPTCHA no está cargado.", "error");
            return;
        }

        const recaptchaResponse = window.grecaptcha.getResponse();
        if (!recaptchaResponse) {
            console.log("⚠️ CAPTCHA no completado.");
            this.showAlert("Por favor, completa el CAPTCHA.", "error");
            return;
        }

        const credentials = {
            email: this.email,
            password: this.password,
            recaptchaResponse
        };

        console.log("🔹 Enviando credenciales:", credentials);

        const response = await userService.loginUser(credentials);
        
        console.log("✅ Respuesta completa del backend:", response);

        if (!response) {
            throw new Error("Error: La respuesta del backend es undefined.");
        }

        if (response?.status === 200) {
            console.log("✅ Login exitoso. Redirigiendo...");
            this.$router.push("/init");
        } else {
            console.log("❌ Error en login: Respuesta inesperada.");
            throw new Error("Error: Respuesta inesperada.");
        }
    } catch (error) {
        console.error("❌ Error en login:", error);

        if (error.response?.status === 401) {
          this.showAlert("Usuario o contraseña incorrectos.", "error");
        } else {
            this.showAlert("Usuario o contraseña incorrectos.", "error");
            this.inputError = true;
            setTimeout(() => {
                this.inputError = false;
            }, 2000);
        }

        return;
    }
},
    goToRegister() {
      console.log("🔹 Navegando a registro");
      this.$router.push("/register");
    },
    goToForgotPassword() {
      console.log("🔹 Navegando a recuperación de contraseña");
      this.$router.push("/forgot-password");
    }
  }
};
</script>



<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

html, body {
  height: 100%;
  background-size: cover;
  font-size: 15px;
}

body {
  font-family: 'Poppins', sans-serif;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  background: none; /* Quita cualquier fondo en body */
}

.logo {
  display: block;
  width: 100px;  /* Ajusta según el tamaño deseado */
  margin: 0 auto 10px; /* Centra y da espacio debajo */
  filter: drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.2)); /* Sombra sutil */
}

.login h3.title {
  margin: 20px 0;
  font-size: 2.4rem; /* Ajusta según necesites */
  font-weight: 10; /* Negrita */
  letter-spacing: 1px; /* Para mejorar legibilidad */
  text-transform: uppercase; /* Para mantener mayúsculas */
  font-family: 'Nunito', sans-serif; /* Asegura la fuente */
}

.g-recaptcha {
  display: flex;
  justify-content: center;
  margin: 15px 0;
}

.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

}

.text-box {
  position: absolute;
  left: 5%;
  top: 30%;
  color: white;
  max-width: 1200px; /* Aumenta el ancho permitido */
  width: auto; /* Permite que el contenedor se expanda si es necesario */
}

.text-box h1 {
  font-size: 4.2rem;
  font-weight: bold;
  text-transform: uppercase;
  line-height: 1.2;
  white-space: nowrap; /* Evita que "Calculator" baje de línea */
}

.text-box p {
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 1.5;
  max-width: 600px; /* Ajusta el ancho del texto para evitar que se vea angosto */
}

.fondo {
  background: #73ac78;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.login-box {
  background: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  width: 350px;
  text-align: center;
}
.text-input {
  background: #e6e6e6;
  height: 45px;
  display: flex;
  width: 100%;
  align-items: center;
  border-radius: 10px;
  margin-bottom: 10px;
}

.text-input input {
  background: none;
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  margin-left: 10px;
  font-size: 1rem;
}

.text-input i {
  color: #686868;
  font-size: 1.2rem;
}

::placeholder {
  color: #9a9aa9;
  font-size: 1rem;
}

.login-btn {
  padding: 12px 60px;
  color: #ffffff;
  font-size: 1.2rem;
  background: rgba(62, 189, 36, 0.75);
  border: none;
  border-radius: 15px;
  cursor: pointer;
  margin-top: 15px;
  transition: transform 0.3s;
}

.login-btn:hover {
  transform: scale(1.05);
}

.create {
  margin-top: 15px;
}

.forgot-password a {
  font-size: 11px;
  color: #555;
  cursor: pointer;
  text-decoration: none;
}

.forgot-password {
  text-align: left !important;
  margin-left: 10px; /* Ajusta el valor según lo necesites */
}

.create a {
  font-size: 14px;
  color: #555;
  cursor: pointer;
  text-decoration: none;
}

.alert-container {
  position: fixed; 
  top: 20px;
  right: 20px;
  background: rgba(255, 0, 0, 0.9);
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  opacity: 0; 
  transform: translateY(-10px);
}

.alert-container.show {
  opacity: 1;
  transform: translateY(0);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.error-message {
  color: white;
  font-size: 0.9rem;
}

.input-error {
  border: 2px solid red;
}

.login-container {
  position: absolute;
  right: 8%;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.manual-button {
  margin-top: 20px;
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.manual-button:hover {
  background-color: #0056b3;
}
</style>

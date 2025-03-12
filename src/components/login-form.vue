<template>
  <div class="container fondo">
    <div class="login-box">
      <div class="login">        
        <img src="@/assets/cropped-logo-amsac.png" alt="Logo Activos Mineros" class="logo">
        <h3 class="title">ACTIVOS MINEROS</h3>

        <!-- Campo de usuario -->
        <div class="text-input">
            <i class="ri-user-fill"></i>
            <input v-model="email" type="text" placeholder="Usuario">
        </div>

        <!-- Campo de contraseña -->
        <div class="text-input">
            <i class="ri-lock-fill"></i>
            <input v-model="password" type="password" placeholder="Contraseña">
        </div>
      <!-- Recuperación de contraseña -->
        <div class="forgot-password">
            <a @click.prevent="goToForgotPassword" href="#">¿Olvidaste tu contraseña?</a>
        </div>
        <!-- reCAPTCHA -->
        <div ref="recaptcha" class="g-recaptcha"></div>

        <!-- Mensaje de cuenta no verificada -->
        <p v-if="showVerificationMessage" class="verification-message">
            Tu cuenta no está verificada. <a @click="resendVerificationEmail" href="#">Reenviar correo de verificación</a>.
        </p>

        <!-- Botón de inicio de sesión -->
        <button @click="handleLogin" class="login-btn">Iniciar Sesión</button>

        <!-- Registro de nuevo usuario -->
        <div class="create">
            <a @click.prevent="goToRegister" href="#">¿No tienes cuenta? Regístrate</a>
            <i class="ri-arrow-right-fill"></i>
        </div>
    </div>

    </div>
    <transition name="fade">
  <div v-if="error" class="alert-container show">
    <p class="error-message">{{ error }}</p>
  </div>
</transition>
  </div>
</template>
<script>
import userService from "@/main/services/userservice";
import { loadRecaptcha } from "@/utils/recaptcha";

export default {
  data() {
    return {
      email: "",
      password: "",
      error: null,
      recaptchaSiteKey: "6Lc7S94qAAAAAE2ohl9u4JgSRLkqFCBd-ypbg9Wd" 
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
    async handleLogin() {
      try {
        this.error = null;
        
        if (!window.grecaptcha || !window.grecaptcha.getResponse) {
          this.error = "Error: reCAPTCHA no está cargado.";
          this.clearErrorAfterTimeout();
          return;
        }

        const recaptchaResponse = window.grecaptcha.getResponse();
        if (!recaptchaResponse) {
          this.error = "Por favor, completa el CAPTCHA.";
          this.clearErrorAfterTimeout();
          return;
        }

        const credentials = {
          email: this.email,
          password: this.password,
          recaptchaResponse
        };

        const response = await userService.loginUser(credentials);

        if (response && response.resource.token) {
          this.$router.push("/init");
        } else {
          this.error = "Error: No se recibió un token válido.";
          this.clearErrorAfterTimeout();
        }
      } catch (error) {
        console.error("Error al Iniciar Sesión:", error);
        this.error = "Error al Iniciar Sesión: " + (error.message || "Error inesperado");
        this.clearErrorAfterTimeout();
      }
    },
    clearErrorAfterTimeout() {
      setTimeout(() => {
        this.error = null;
      }, 4000); 
    },
    goToRegister() {
      this.$router.push("/register");
    },
    goToForgotPassword() {
        this.$router.push("/forgot-password"); 
    }
  },
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
  justify-content: center; /* Centrará el modal horizontalmente */
  align-items: center; /* Centrará el modal verticalmente */
  position: relative;
}

.fondo {
  background: url("https://www.amsac.pe/wp-content/uploads/2025/01/NP-Catalogo-de-especies-02-scaled.jpg") no-repeat center center fixed;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.login-box {
  background: rgba(255, 255, 255);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 0 25px 5px rgb(0 0 0 / 20%);
  z-index: 10;
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
  color: #9a9a9a;
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
  position: fixed;  /* Fija el mensaje en la pantalla */
  top: 20px;
  right: 20px;
  background: rgba(255, 0, 0, 0.9); /* Color rojo más visible */
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 9999; /* Asegura que esté por encima de otros elementos */
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  opacity: 0; /* Inicia oculto */
  transform: translateY(-10px); /* Pequeña animación */
}

.alert-container.show {
  opacity: 1;  /* Se muestra cuando hay un error */
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
</style>

<template>
  <div class="container">
    <div class="design">
      <img src="@/assets/Group_2.png" class="plant plant-1" alt="Plant 1">
      <img src="@/assets/Group_2.png" class="plant plant-2" alt="Plant 2">
      <img src="@/assets/Group_2.png" class="plant plant-3" alt="Plant 3">
      <img src="@/assets/Group_2.png" class="plant plant-4" alt="Plant 4">
      <img src="@/assets/Group_2.png" class="plant plant-5" alt="Plant 5">
      <img src="@/assets/Group_2.png" class="plant plant-6" alt="Plant 6">
    </div>
    <div class="login-box">
      <div class="login">
        <h3 class="title">Iniciar Sesión</h3>
        <div class="text-input">
          <i class="ri-user-fill"></i>
          <input v-model="email" type="text" placeholder="Usuario">
        </div>
        <div class="text-input">
          <i class="ri-losck-fill"></i>
          <input v-model="password" type="password" placeholder="Contraseña">
        </div>
        <div ref="recaptcha" class="g-recaptcha"></div>
        <button @click="handleLogin" class="login-btn">Iniciar Sesión</button>
        <div class="create">
          <a @click.prevent="goToRegister" href="#">¿No tienes cuenta? Registrate</a>
          <i class="ri-arrow-right-fill"></i>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div v-if="error" class="alert-container">
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
}

,

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
    }
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

*, html, body {
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Poppins', sans-serif;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom right, #53704b, #7ba58d, #4fd87d);
}

.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  padding-right: 100px;
}

.design {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.plant {
  position: absolute;
  width: 420px; 
  height: auto;
  opacity: 0.9;
}

.plant-1 {
  bottom: -10px;
  left: -20px;
}

.plant-2 {
  top: -50px;
  left: -60px;
}

.plant-3 {
  top: -50px;
  left: 180px;
}

.plant-4 {
  bottom: -150px;
  left: 200px;
}

.plant-5 {
  top: 30px;
  left: 250px;
}

.plant-6 {
  bottom: 30px;
  left: 80px;
}

.login-box {
  background: rgba(255, 255, 255, 0.9);
  padding: 100px;
  border-radius: 15px;
  box-shadow: 0 0 25px 12px rgb(0 0 0 / 30%);
  z-index: 1;
  width: 340px;
  margin-right: 190px;
}

.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.login h3.title {
  margin: 20px 0;
  font-size: 3.2rem;
}

.text-input {
  background: #e6e6e6;
  height: 55px;
  display: flex;
  width: 85%;
  align-items: center;
  border-radius: 12px;
  padding: 0 18px;
  margin: 12px 0;
}

.text-input input {
  background: none;
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.login h3.title {
  margin: 20px 0;
  font-size: 3.2rem;
}

.text-input input {
  background: none;
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  margin-left: 12px;
  font-size: 1.2rem;
}

.text-input i {
  color: #686868;
  font-size: 1.3rem;
}

::placeholder {
  color: #9a9a9a;
  font-size: 1.2rem;
}

.login-btn {
  padding: 14px 80px;
  color: #ffffff;
  font-size: 1.4rem;
  background: #74c905;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  margin-top: 20px;
  transition: transform 0.3s;
}

.login-btn:hover {
  transform: scale(1.1);
}

a {
  font-size: 16px;
  color: #9a9a9a;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
}

a.forgot {
  margin-top: 15px;
}

.create {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.create i {
  color: #9a9a9a;
  margin-left: 12px;
}

.alert-container {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 0, 0, 0.8);
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: opacity 0.5s ease-in-out;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

.error-message {
  color: white;
  font-size: 0.9rem;
}
</style>

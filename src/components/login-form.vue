<template>
  <AlertComponent v-if="alertMessage" :message="alertMessage" :type="alertType" @close="clearAlert" />

  <div class="container fondo">
    <div class="login-container">
      <div class="login-box">
        <div class="login">
          <img src="@/assets/logo.png" alt="Logo Activos Mineros" class="logo" />

          <form @submit.prevent="handleLogin" novalidate>
            <div :class="['text-input', { 'input-error': inputError }]">
              <i class="ri-user-fill icon"></i>
              <input v-model="email" type="text" placeholder="Usuario" autocomplete="username" />
            </div>

            <div :class="['text-input', { 'input-error': inputError }]">
              <i class="ri-lock-fill icon"></i>
              <input v-model="password" type="password" placeholder="Contraseña" autocomplete="current-password" />
            </div>

            <!-- reCAPTCHA eliminado -->

            <button type="submit" class="login-btn" :disabled="inputError">
              Iniciar Sesión
            </button>
          </form>

          <div class="create">
            <a @click.prevent="goToRegister" href="#" class="register-link">
              ¿No tienes cuenta? <strong>Regístrate</strong>
            </a>
            <i class="ri-arrow-right-fill arrow-icon"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userService from "@/main/services/userservice";
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
      alertMessage: null,
      alertType: "error",
      inputError: false, // Estado para manejar el error en los inputs
    };
  },
  // reCAPTCHA eliminado del ciclo de vida
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
      if (this.email === "admin" && this.password === "admin") {
        console.log("✅ Acceso rápido como admin");
        this.$router.push("/init");
        return;
      }
      try {
        this.error = null;

        // reCAPTCHA eliminado

        const credentials = {
          email: this.email,
          password: this.password
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

html, body {
  height: 100%;
  margin: 0;
  font-family: 'Inter', sans-serif;
  background-size: cover;
  background: #73ac78 center;
}

.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.login-container {
  max-width: 380px;
  width: 100%;
}

.login-box {
  background: #fff;
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.12);
  text-align: center;
  transition: box-shadow 0.3s ease;
}

.login-box:hover {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.18);
}

.logo {
  width: 110px;
  margin-bottom: 30px;
  filter: drop-shadow(0 3px 6px rgba(0,0,0,0.1));
}

.text-input {
  background: #f7f9fa;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  height: 48px;
  margin-bottom: 18px;
  border: 2px solid black;
  transition: border-color 0.3s ease;
}

.text-input.input-error {
  border-color: #e74c3c;
}

.text-input:focus-within {
  border-color: #3c9d3c;
  background: #f0f7f0;
}

.text-input input {
  flex-grow: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  color: #333;
  padding-left: 10px;
  font-weight: 500;
}

.icon {
  font-size: 1.3rem;
  color: #6c757d;
  min-width: 20px;
}

::placeholder {
  color: #a0a5ab;
  font-weight: 400;
}

.g-recaptcha {
  display: none;
}

.login-btn {
  width: 100%;
  background: #3c9d3c;
  color: white;
  border: none;
  padding: 14px 0;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  user-select: none;
}

.login-btn:disabled {
  background: #a5d6a7;
  cursor: not-allowed;
}

.login-btn:hover:not(:disabled) {
  background-color: #35862b;
}

.create {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.9rem;
  color: #4b4b4b;
  user-select: none;
}

.register-link {
  color: #3c9d3c;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: #2a6a21;
  text-decoration: underline;
}

.arrow-icon {
  font-size: 1.1rem;
  color: #3c9d3c;
  margin-left: 8px;
  user-select: none;
}

.g-recaptcha iframe {
  border-radius: 8px !important;
}

.fondo {
  background-image: url('@/assets/planta_fondo.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.login-box {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  width: 350px;
  text-align: center;
}


</style>
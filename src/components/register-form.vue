<template>
  <AlertComponent v-if="alertMessage" :message="alertMessage" :type="alertType" @close="clearAlert" />

  <div class="container fondo">
    <div class="register-box">
      <div class="register">zz
        <img src="@/assets/logo.png" alt="Logo Activos Mineros" class="logo" />
        <form @submit.prevent="handleRegister">
          <div :class="['text-input', { 'input-error': false }]">
            <i class="ri-user-fill icon"></i>
            <input id="email" v-model="formData.email" type="text" placeholder="usuario@dominio" required />
          </div>

          <div :class="['text-input', { 'input-error': false }]">
            <i class="ri-user-fill icon"></i>
            <input id="name" v-model="formData.name" type="text" placeholder="Nombre" required />
          </div>

          <div :class="['text-input', { 'input-error': false }]">
            <i class="ri-user-fill icon"></i>
            <input id="lastname" v-model="formData.lastname" type="text" placeholder="Apellido" required />
          </div>

          <div :class="['text-input', { 'input-error': false }]">
            <i class="ri-lock-fill icon"></i>
            <input id="password" v-model="formData.password" type="password" placeholder="Contraseña" required />
          </div>

          <div :class="['text-input', { 'input-error': false }]">
            <i class="ri-earth-fill icon"></i>
            <select v-model="formData.preferredLanguage" required>
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>

          <div :class="['text-input', { 'input-error': false }]">
            <i class="ri-user-fill icon"></i>
            <input id="area" v-model="formData.role" type="text" placeholder="User / Invitado" required />
            <button type="button" @click="setAreaInvitado" class="btn-invitado">Invitado</button>
          </div>

          <button type="submit" class="register-btn">Registrarse</button>

          <div class="create">
            <a @click.prevent="goToLogin" href="#" class="register-link">¿Ya tienes cuenta? Inicia Sesión</a>
            <i class="ri-arrow-right-fill arrow-icon"></i>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>



<script>
import userService from "@/main/services/userservice";
import AlertComponent from "./AlertComponent.vue";

export default {
  name: "RegisterFormComponent",
  components: {
    AlertComponent,
  },
  data() {
    return {
      formData: {
        email: "",
        password: "",
        name: "",
        lastname: "",
        preferredLanguage: navigator.language.startsWith("es") ? "es" : "en",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        registeredAt: new Date().toISOString(),
        role: "User",
      },
      alertMessage: null,
      alertType: "error",
      registrationSuccess: false,
    };
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
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email.toLowerCase());
    },
    async handleRegister() {
      if (!this.validateEmail(this.formData.email)) {
        this.showAlert("Por favor, ingrese un correo electrónico válido.", "error");
        return;
      }

      try {
        // Actualiza zona horaria y fecha antes de enviar
        this.formData.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.formData.registeredAt = new Date().toISOString();

        await userService.registerUser(this.formData);
        this.registrationSuccess = true;
        this.showAlert("Registro exitoso. Redirigiendo a la página de inicio de sesión...", "success");
        setTimeout(() => {
          this.$router.push("/login");
        }, 3000);
      } catch (err) {
        this.showAlert("Error al registrarse. La cuenta ya existe o falló la conexión.", "error");
      }
    },
    goToLogin() {
      this.$router.push("/login");
    },
    setAreaInvitado() {
      this.formData.role = "Invitado";
    },
  },
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
  padding-top: 50px;
  padding-bottom: 50px;
  box-sizing: border-box;
}

.register-box {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.12);
  width: 350px;
  text-align: center;
  transition: box-shadow 0.3s ease;
  max-height: 90vh;
  margin: auto 0;
}

.register-box:hover {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.18);
}

.logo {
  width: 110px;
  margin-bottom: 30px;
  filter: drop-shadow(0 3px 6px rgba(0,0,0,0.1));
}

.text-input {
  background: #f7f9fa;
  height: 48px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  border-radius: 10px;
  margin-bottom: 18px;
  border: 2px solid black;
  transition: border-color 0.3s ease;
}

.text-input:focus-within {
  border-color: #1e5d1e; /* verde oscuro al enfocar */
  background: #f0f7f0;
}

.text-input.input-error {
  border-color: #e74c3c !important; /* rojo para error */
}

.text-input input,
.text-input select {
  flex-grow: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  color: #333;
  padding-left: 10px;
  font-weight: 500;
  appearance: none;
}

.icon {
  font-size: 1.3rem;
  color: #6c757d;
  min-width: 20px;
}

.btn-invitado {
  margin-left: 10px;
  background: #74c905;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 5px 10px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.3s ease;
  user-select: none;
}

.btn-invitado:hover {
  transform: scale(1.1);
}

.register-btn {
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
  margin-top: 15px;
}

.register-btn:hover {
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
  margin-bottom: 40px;
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

::placeholder {
  color: #a0a5ab;
  font-weight: 400;
}

.fondo {
  background-image: url('@/assets/planta_fondo.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

</style>
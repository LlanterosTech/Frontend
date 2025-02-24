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
    <div class="register-box">
      <div class="register">
        <h3 class="title">Registrarse</h3>
        <form @submit.prevent="handleRegister">
          <div class="text-input">
            <i class="ri-mail-fill"></i>
            <input id="email" v-model="formData.email" type="email" placeholder="Usuario" required>
          </div>
          <div class="text-input">
            <i class="ri-lock-fill"></i>
            <input id="password" v-model="formData.password" type="password" placeholder="Contraseña" required>
          </div>
          <div class="text-input">
            <i class="ri-user-fill"></i>
            <input id="area" v-model="formData.registerArea" type="text" placeholder="Area" required>
          </div>
          <button type="submit" class="register-btn">Registrarse</button>
       
        </form>
        <p v-if="error">{{ error }}</p>
        <div class="create">
          <a @click.prevent="goToLogin" href="#">¿Ya tienes cuenta? Inicia Sesion</a>
          <i class="ri-arrow-right-fill"></i>
          </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import userService from "@/main/services/userservice";

export default {
  name: "RegisterFormComponent",
  data() {
    return {
      formData: {
        email: "",
        password: "",
        area: "",
      },
      error: null,
    };
  },
  methods: {
    async handleRegister() {
      try {
        this.error = null; // Limpia errores anteriores
        await userService.registerUser(this.formData);
        console.log("Registration successful");
        this.$router.push("/login"); // Redirige al login o a otra página
      } catch (err) {
        this.error = err || "Failed to register. Please try again.";
      }
    },
    async goToLogin() {
      this.$router.push("/login");
    },
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

.create {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.create i {
  color: #9a9a9a;
  margin-left: 12px;
}

.plant {
  position: absolute;
  width: 420px; /* Tamaño aumentado */
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

.register-box {
  background: rgba(255, 255, 255, 0.9);
  padding: 100px;
  border-radius: 15px;
  box-shadow: 0 0 25px 12px rgb(0 0 0 / 30%);
  z-index: 1;
  width: 340px;
  margin-right: 190px;
}

.register {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

.register h3.title {
  margin: 20px 0;
  font-size: 3.2rem;
}

.text-input i {
  color: #686868;
  font-size: 1.3rem;
}

::placeholder {
  color: #9a9a9a;
  font-size: 1.2rem;
}

.register-btn {
  padding: 14px 80px;
  color: white;
  font-size: 1.4rem;
  background: #74c905;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  margin-top: 20px;
  transition: transform 0.3s;
}

.register-btn:hover {
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
</style>
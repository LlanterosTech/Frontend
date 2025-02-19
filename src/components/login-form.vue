<template>
    <div class="login-container">
      <h1>Login</h1>
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button @click="handleLogin">Login</button>
      <p>
        ¿No tienes cuenta?
        <a @click.prevent="goToRegister" href="#">Regístrate aquí</a>
      </p>
    </div>
  </template>
  
  <script>
  import userService from "@/main/services/userservice";
  
  export default {
    data() {
      return {
        email: "",
        password: "",
      };
    },
    methods: {
      async handleLogin() {
    try {
        const credentials = {
            email: this.email,
            password: this.password,
        };
        const response = await userService.loginUser(credentials);

        if (response && response.token) {
            localStorage.setItem("userToken", response.token);
            localStorage.setItem("idUser", response.id);
            console.log("Token guardado:", response.token);
            console.log("Redirigiendo a /init...");
            this.$router.push("/init"); // 🔹 Redirección
        } else {
            alert("Error: No se recibió un token válido.");
        }
    } catch (error) {
        console.error("Login fallido:", error);
        alert("Login fallido: " + (error.message || "Error inesperado"));
    }
}
,
      goToRegister() {
        this.$router.push("/register");
      },
      goToInit(){
        this.$router.push("/init");
      }
    },
  };
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  p {
    margin-top: 1rem;
  }
  
  a {
    color: #007bff;
    text-decoration: none;
    cursor: pointer;
  }
  
  a:hover {
    text-decoration: underline;
  }
  </style>
  
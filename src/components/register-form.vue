<template>
    <div class="register-form">
      <h2>Register</h2>
      <form @submit.prevent="handleRegister">
        <div>
          <label for="email">Email:</label>
          <input id="email" v-model="formData.email" type="email" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input id="password" v-model="formData.password" type="password" required />
        </div>
        <div>
          <label for="name">Area:</label>
          <input id="name" v-model="formData.registerArea" type="text" required />
        </div>
        <button type="submit">Register</button>
      </form>
      <p v-if="error">{{ error }}</p>
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
    },
  };
  </script>
  
  
  <style scoped>
  .register-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 1em;
    background: #f9f9f9;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
  
  .register-form h2 {
    text-align: center;
  }
  
  .register-form form {
    display: flex;
    flex-direction: column;
  }
  
  .register-form div {
    margin-bottom: 1em;
  }
  
  .register-form label {
    margin-bottom: 0.5em;
    color: #333333;
  }
  
  .register-form input {
    padding: 0.5em;
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 3px;
  }
  
  .register-form button {
    padding: 0.7em;
    font-size: 1em;
    color: #fff;
    background: #007bff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .register-form button:hover {
    background: #0056b3;
  }
  
  .register-form p {
    color: red;
    text-align: center;
  }
  </style>
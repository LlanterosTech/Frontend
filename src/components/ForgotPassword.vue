    <template>
        <div class="container fondo">
        <div class="forgot-box">
            <div class="forgot">
            <img src="@/assets/cropped-logo-amsac.png" alt="Logo Activos Mineros" class="logo">
            <p class="description">
                Por favor ingresa tu dirección de correo electrónico y reinicia tu contraseña.
            </p>
    
            <form @submit.prevent="handleForgotPassword">
                <div class="text-input">
                <i class="ri-mail-fill"></i>
                <input id="email" v-model="email" type="email" placeholder="Correo Electrónico *" required>
                </div>
    
                <div class="forgot-password-container">
                <button type="submit" class="forgot-password-btn">Reiniciar contraseña</button>
                </div>
            </form>
    
            <div v-if="message" class="success-message">{{ message }}</div>
            <div v-if="error" class="error-message">{{ error }}</div>
    
            <div class="go-back">
                <a @click.prevent="goToLogin" href="#">Volver al inicio</a>
            </div>
            </div>
        </div>
        </div>
    </template>
    
    <script>
    import bdService from "@/main/services/bdservice"; // Importamos el servicio
    
    export default {
        name: "ForgotPasswordComponent",
        data() {
        return {
            email: "",
            message: "",
            error: ""
        };
        },
        methods: {
        async handleForgotPassword() {
            try {
            this.message = "";
            this.error = "";
    
            await bdService.forgotPassword(this.email, "Recuperación de contraseña", 
                "Haz clic en el enlace para restablecer tu contraseña.");
    
            this.message = "Correo de recuperación enviado. Revisa tu bandeja de entrada.";
            } catch (error) {
            this.error = "Hubo un error al enviar el correo. Inténtalo nuevamente.";
            }
        },
        goToLogin() {
            this.$router.push("/login");
        }
        }
    };
    </script>
    
    <style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
    
    .container {
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    
    .fondo {
        background: url("@/assets/Pag 37 Proyecto Calioc y Chacrapuquio en Junín.jpg") no-repeat center center fixed;
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
    }
    
    .forgot-box {
        background: rgba(255, 255, 255);
        padding: 40px;
        border-radius: 15px;
        box-shadow: 0 0 25px 5px rgb(0 0 0 / 20%);
        z-index: 10;
        width: 380px;
        text-align: center;
    }
    
    .logo {
        display: block;
        width: 100px;
        margin: 0 auto 10px;
        filter: drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.2));
    }
    
    h3.title {
        margin: 10px 0;
        font-size: 1.8rem;
        font-weight: bold;
        letter-spacing: 1px;
        text-transform: uppercase;
        font-family: 'Poppins', sans-serif;
    }
    
    .description {
        font-size: 1rem;
        color: #333;
        margin-bottom: 20px;
    }
    
    .text-input {
        background: #e6e6e6;
        height: 45px;
        display: flex;
        width: 100%;
        align-items: center;
        border-radius: 10px;
        margin-bottom: 15px;
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
    
    .forgot-password-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
    
    .forgot-password-btn {
        display: block;
        width: 80%;
        max-width: 300px;
        padding: 12px;
        background: rgba(62, 189, 36, 0.75);
        color: white;
        font-size: 1.2rem;
        border: none;
        border-radius: 15px;
        cursor: pointer;
        transition: transform 0.3s;
    }
    
    .forgot-password-btn:hover {
        transform: scale(1.05);
    }
    
    .success-message {
        margin-top: 15px;
        color: green;
        font-weight: bold;
    }
    
    .error-message {
        margin-top: 15px;
        color: red;
        font-weight: bold;
    }
    
    .go-back {
        margin-top: 15px;
    }
    
    .go-back a {
        font-size: 14px;
        color: #555;
        cursor: pointer;
        text-decoration: none;
    }
    </style>
    
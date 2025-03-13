    <template>
        <div class="container fondo">
        <div class="reset-box">
            <div class="reset">
            <img src="@/assets/cropped-logo-amsac.png" alt="Logo Activos Mineros" class="logo">
            <h3 class="title">ACTIVOS MINEROS</h3>
            <p class="description">
                Ingresa tu nueva contraseña para restablecer tu cuenta.
            </p>
    
            <form @submit.prevent="handleResetPassword">
                <div class="text-input">
                <i class="ri-lock-fill"></i>
                <input id="password" v-model="password" type="password" placeholder="Nueva Contraseña *" required>
                </div>
    
                <div class="text-input">
                <i class="ri-lock-fill"></i>
                <input id="confirmPassword" v-model="confirmPassword" type="password" placeholder="Confirmar Contraseña *" required>
                </div>
    
                <div class="reset-password-container">
                <button type="submit" class="reset-password-btn">Restablecer contraseña</button>
                </div>
            </form>
    
            <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
            </div>
            <div v-if="successMessage" class="success-message">
                {{ successMessage }}
            </div>
    
            <div class="go-back">
                <a @click.prevent="goToLogin" href="#">Volver al inicio</a>
            </div>
            </div>
        </div>
        </div>
    </template>
    
    <script>
    import axios from 'axios';
    import { useRoute, useRouter } from 'vue-router';
    
    export default {
        name: "ResetPasswordComponent",
        data() {
        return {
            password: "",
            confirmPassword: "",
            token: "",
            errorMessage: "",
            successMessage: "",
        };
        },
        setup() {
        const route = useRoute();
        const router = useRouter();
        return { route, router };
        },
        mounted() {
        this.token = this.$route.query.token; // Obtener token desde la URL
        if (!this.token) {
            this.errorMessage = "Token inválido o expirado.";
        }
        },
        methods: {
        async handleResetPassword() {
            if (!this.token) {
            this.errorMessage = "Token inválido o expirado.";
            return;
            }
    
            if (this.password !== this.confirmPassword) {
            this.errorMessage = "Las contraseñas no coinciden.";
            return;
            }
    
            try {
            const response = await axios.post("http://localhost:5162/amsac/v1/authentication/reset-password", {
                token: this.token,
                newPassword: this.password
            });
    
            this.successMessage = response.data.message;
            setTimeout(() => {
                this.$router.push("/login");
            }, 3000);
            } catch (error) {
            this.errorMessage = error.response?.data?.message || "Error al restablecer la contraseña.";
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
        background: url("https://www.amsac.pe/wp-content/uploads/2025/01/NP-Catalogo-de-especies-02-scaled.jpg") no-repeat center center fixed;
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
    }
    
    .reset-box {
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
    
    .reset-password-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
    
    .reset-password-btn {
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
    
    .reset-password-btn:hover {
        transform: scale(1.05);
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
    
    .error-message {
        color: red;
        font-size: 0.9rem;
        margin-top: 10px;
    }
    
    .success-message {
        color: green;
        font-size: 0.9rem;
        margin-top: 10px;
    }
    </style>
    
    <template>
        <div class="container fondo">
        <div class="verify-box">
            <div class="verify">
            <img src="@/assets/cropped-logo-amsac.png" alt="Logo Activos Mineros" class="logo">
            <p class="description">
                Verificando tu cuenta, por favor espera...
            </p>
    
            <div v-if="loading" class="loading">
                <span class="spinner"></span>
            </div>
    
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
import api from '../../api/api' // asumiendo que estás en src/components
import { useRoute, useRouter } from "vue-router";
    
    export default {
        name: "VerifyAccount",
        data() {
        return {
            errorMessage: "",
            successMessage: "",
            loading: true
        };
        },
        setup() {
        const route = useRoute();
        const router = useRouter();
        return { route, router };
        },
        async mounted() {
        const token = this.$route.query.token;
        if (!token) {
            this.errorMessage = "Token inválido o expirado.";
            this.loading = false;
            return;
        }
    
        try {
            const response = await api.post("/authentication/verify-account", { token },{ withCredentials: true });
            this.successMessage = response.data.message;
            setTimeout(() => this.$router.push("/login"), 3000);
        } catch (error) {
            this.errorMessage = error.response?.data?.message || "Error al verificar la cuenta.";
        } finally {
            this.loading = false;
        }
        },
        methods: {
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
    
    .verify-box {
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
    
    .description {
        font-size: 1rem;
        color: #333;
        margin-bottom: 20px;
    }
    
    .loading {
        margin: 20px 0;
    }
    
    .spinner {
        display: inline-block;
        width: 30px;
        height: 30px;
        border: 4px solid rgba(0, 0, 0, 0.2);
        border-left-color: #3ebd24;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
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
    
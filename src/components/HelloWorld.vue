    <template>
        <div class="container">
        <h1>¡Hola Mundo! 🌍</h1>
        <p>Esta es una vista de prueba para verificar el enrutamiento en Vue.</p>
        <router-link to="/">Volver al Inicio</router-link>
        </div>
    </template>
    
    <script>
    export default {
        name: "HelloWorld",
    };
    </script>
    
    <style scoped>
    .container {
        text-align: center;
        margin-top: 50px;
    }
    h1 {
        color: #42b983;
    }
    </style>
    
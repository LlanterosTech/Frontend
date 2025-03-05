import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from "@/public/auth/login-page.vue";
import RegisterPage from "@/public/auth/register-page.vue";
import CreateEstimacion from "@/public/CreateEstimacion.vue";
import InitPage from "@/public/InitPage.vue";
import MainContainer from '@/components/main-container.vue';
import BuscarEstimacion from "@/public/BuscarEstimacion.vue";

const routes = [
    {
        path: '/',
        name: 'home',
        component: MainContainer,
        meta: { title: 'Inicio' }
    },
    {
        path: '/login',
        name: 'login',
        component: LoginPage,
        meta: { title: 'Login' }
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterPage,
        meta: { title: 'Register' }
    },
    {
        path: '/init',
        name: 'init',
        component: InitPage,
        meta: { title: 'Init', requiresAuth: true }
    },
    {
        path: '/nuevaestimacion',
        name: 'nuevaestimacion',
        component: CreateEstimacion,
        meta: { title: 'Nueva Estimación', requiresAuth: true }
    },
    {
        path: '/buscar-estimacion',
        name: 'BuscarEstimacion',
        component: BuscarEstimacion,
        meta: { title: 'Buscar Estimación' }
    },
    // Ruta de captura para redirigir a InitPage o LoginPage
    {
        path: '/:catchAll(.*)',
        name: 'not-found',
        beforeEnter: (to, from, next) => {
            const isAuthenticated = localStorage.getItem('token');
            if (isAuthenticated) {
                next('/init');
            } else {
                next('/login');
            }
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Función para verificar si el token es válido
function isTokenValid(token) {
    // Aquí puedes agregar la lógica para verificar si el token es válido
    // Por ejemplo, decodificar el token y verificar su fecha de expiración
    // Esta es una implementación simplificada
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiration = payload.exp * 1000;
        return Date.now() < expiration;
    } catch (e) {
        return false;
    }
}

// 🔹 Proteger rutas
router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'App';

    const token = localStorage.getItem('token');
    const isAuthenticated = token && isTokenValid(token);

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login'); // Redirige al login si no está autenticado
    } else {
        if (!['/', '/register'].includes(to.path)) {
            localStorage.setItem('lastRoute', to.path); // Guarda la última ruta
        }
        next();
    }
});

// 🔹 Cuando se recarga la página, redirigir a la última ruta visitada
window.addEventListener('load', () => {
    const lastRoute = localStorage.getItem('lastRoute');
    const token = localStorage.getItem('token');
    if (lastRoute && token && isTokenValid(token)) {
        router.push(lastRoute);
    } else {
        router.push('/login'); // Redirige al login si el token no es válido
    }
});

export default router;

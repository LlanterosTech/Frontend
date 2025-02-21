import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from "@/public/auth/login-page.vue";
import RegisterPage from "@/public/auth/register-page.vue";
import CreateEstimacion from "@/public/CreateEstimacion.vue";
import InitPage from "@/public/InitPage.vue";
import MainContainer from '@/components/main-container.vue';

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
    // Ruta de captura para redirigir a InitPage o LoginPage
    {
        path: '/:catchAll(.*)',
        name: 'not-found',
        beforeEnter: (to, from, next) => {
            const isAuthenticated = localStorage.getItem('userToken');
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

// 🔹 Proteger rutas
router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'App';

    const isAuthenticated = localStorage.getItem('userToken'); 

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
    if (lastRoute && localStorage.getItem('userToken')) {
        router.push(lastRoute);
    }
});

export default router;

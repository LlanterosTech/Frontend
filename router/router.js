import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from "@/public/auth/login-page.vue";
import RegisterPage from "@/public/auth/register-page.vue";
import CreateEstimacion from "@/public/CreateEstimacion.vue";
import InitPage from "@/public/InitPage.vue";
import MainContainer from '@/components/main-container.vue';
import BuscarEstimacion from "@/public/BuscarEstimacion.vue";
import HistoralEstimacion from '@/public/HistoralEstimacion.vue';

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
        meta: { title: 'Buscar Estimación', requiresAuth: true }
    },
    {
        path: '/historial-estimaciones',
        name: 'HistorialEstimaciones',
        component: HistoralEstimacion,
        meta: { title: 'Historial Estimaciones', requiresAuth: true }
    },
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

function isTokenValid(token) {

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiration = payload.exp * 1000;
        return Date.now() < expiration;
    } catch (e) {
        return false;
    }
}

router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'App';

    const token = localStorage.getItem('token');
    const isAuthenticated = token && isTokenValid(token);

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } else {
        if (!['/', '/register'].includes(to.path)) {
            localStorage.setItem('lastRoute', to.path);
        }
        next();
    }
});

window.addEventListener('load', () => {
    const lastRoute = localStorage.getItem('lastRoute');
    const token = localStorage.getItem('token');
    if (lastRoute && token && isTokenValid(token)) {
        router.push(lastRoute);
    } else {
        router.push('/login');
    }
});

export default router;

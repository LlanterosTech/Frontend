import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from "@/public/auth/login-page.vue";
import RegisterPage from "@/public/auth/register-page.vue";
import CreateEstimacion from "@/public/CreateEstimacion.vue";
import InitPage from "@/public/InitPage.vue";
import MainContainer from '@/components/main-container.vue';
import BuscarEstimacion from "@/public/BuscarEstimacion.vue";
import HistoralEstimacion from '@/public/HistoralEstimacion.vue';
import ForgotPassword from "@/components/ForgotPassword.vue";
import ResetPassword from "@/components/ResetPassword.vue"; 
import VerifyAccount from "@/components/VerifyAccount.vue";
import HelloWorld from '@/components/HelloWorld.vue'; // Import correcto
import userService from '@/main/services/userservice';
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
        path: "/forgot-password",
        name: "ForgotPassword",
        component: ForgotPassword,
    },
    {
        path: '/hello',
        name: 'HelloWorld',
        component: HelloWorld,
        meta: { title: 'Hola Mundo' , requiresAuth: true,role: "Admin" }
    },
    {
        path: "/reset-password",
        name: "ResetPassword",
        component: ResetPassword,
        meta: { title: "Restablecer Contraseña" }
    },
    {
        path: "/verify-account",
        name: "VerifyAccount",
        component: VerifyAccount,
        meta: { title: "Verificación de Cuenta" }
    },
    {
        path: '/:catchAll(.*)',
        name: 'not-found',
        beforeEnter: async (to, from, next) => {
            try {
                const user = await userService.getInfoUser();
                if (user) {
                    next('/init'); // ✅ Usuario autenticado, redirigir a /init
                } else {
                    next('/login'); // ❌ No autenticado, redirigir a /login
                }
            } catch (error) {
                console.error("Error obteniendo usuario:", error);
                next('/login'); // ❌ Manejo seguro de error
            }
        }
    },
   
];

const router = createRouter({
    history: createWebHistory(),
    routes
});



router.beforeEach(async (to, from, next) => {
    document.title = to.meta.title || 'App';

    // 👉 Si la ruta no necesita auth ni rol, pasa directo sin llamar al backend
    if (!to.meta.requiresAuth && !to.meta.role) {
    return next();
    }

    try {
    const user = await userService.getInfoUser();
    const isAuthenticated = !!user;
    const userRole = user?.role || "User";

    if (to.meta.requiresAuth && !isAuthenticated) {
        return next('/login');
    } else if (to.meta.role && userRole !== to.meta.role) {
        return next('/');
    } else {
        return next();
    }
    } catch (error) {
    console.error("Error verificando autenticación:", error);
    return next('/login');
    }
});

// window.addEventListener('load', () => {
//     const lastRoute = localStorage.getItem('lastRoute');
//     const token = localStorage.getItem('token');
//     if (lastRoute && token && isTokenValid(token)) {
//         router.push(lastRoute);
//     } else {
//         router.push('/login');
//     }
// });

export default router;

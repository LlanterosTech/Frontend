import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from "@/public/auth/login-page.vue";
import RegisterPage from "@/public/auth/register-page.vue";
import InitPage from "@/public/InitPage.vue";
import MainContainer from '@/components/main-container.vue';

import userService from '@/main/services/userservice';
import MyPlants from '@/public/MyPlants.vue';
import PlantDashboard from '@/public/PlantDashboard.vue';
import DevicesPage from '@/public/DevicesPage.vue';
import DeviceSensors from '@/public/DeviceSensors.vue';
import AboutUs from "@/public/AboutUs.vue";
import Settings from "@/public/Settings.vue";
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
        path: '/my-plants',
        name: 'my-plants',
        component: MyPlants,
        meta: { title: 'Mis Plantas', requiresAuth: true }
    },
    {
        path: '/dashboard-myplant/:plantId',
        name: 'dashboard-myplant',
        component: PlantDashboard,
        meta: { title: 'Dashboard Mis Plantas', requiresAuth: true }
    },
    {
        path: '/devices',
        name: 'devices',
        component: DevicesPage,
        meta: { title: 'Dispositivos', requiresAuth: true }
    },
     {
        path: '/devices/:deviceId/sensors',
        name: 'sensors',
        component: DeviceSensors,
        meta: { title: 'Sensores', requiresAuth: true }
    },
    {
        path: '/about-us',
        name: 'about-us',
        component: AboutUs,
        meta: { title: 'About-us', requiresAuth: true }
    },
    {
        path: '/settings',
        name: 'settings',
        component: Settings,
        meta: { title: 'settings', requiresAuth: true }
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

let inactivityTimer;

export function startInactivityTimer(logoutCallback) {
    resetInactivityTimer(logoutCallback);
    
    document.addEventListener('mousemove', () => resetInactivityTimer(logoutCallback));
    document.addEventListener('keydown', () => resetInactivityTimer(logoutCallback));
    document.addEventListener('click', () => resetInactivityTimer(logoutCallback));
}

export function resetInactivityTimer(logoutCallback) {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        logoutCallback();  // Llama a la función de cierre de sesión
    }, 0.50 * 60 * 1000); // 15 minutos de inactividad
}

export function logoutUser() {
    localStorage.removeItem('userToken'); // Elimina el token
    window.location.href = '/'; // Redirige al login
}

let inactivityTimer;
import userService from "@/main/services/userservice";

export function startInactivityTimer() {
    resetInactivityTimer();
    
    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keydown', resetInactivityTimer);
    document.addEventListener('click', resetInactivityTimer);
}

export function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        userService.logoutUser(); 
    }, 0.50 * 60 * 1000); // 15 minutos de inactividad
}

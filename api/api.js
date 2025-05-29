import axios from "axios";
import userService from "@/main/services/userservice";
const api = axios.create({
    baseURL: "https://localhost:7230/plantita/v1",
    withCredentials: true, 
 
});

axios.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
  
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes('/authentication/sign-in')
      ) {
        originalRequest._retry = true;
  
        try {
          await userService.refreshToken(); 
          return axios(originalRequest); 
        } catch (refreshError) {
          console.error("Error al refrescar el token:", refreshError);
        }
      }
  
      return Promise.reject(error);
    }
  );
  

export default api;

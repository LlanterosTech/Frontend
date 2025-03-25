import axios from "axios";

const api = axios.create({
    baseURL: "http://198.150.0.223:5162/amsac/v1",
    withCredentials: true, // 🔥 Permitir cookies en requests
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

export default api;

import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5162/amsac/v1",
    withCredentials: true, // 🔥 Permitir cookies en requests
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

export default api;

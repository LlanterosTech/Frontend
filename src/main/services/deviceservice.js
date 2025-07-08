import api from '@/../api/api';

export default {
  async createIotDevice(formData) {
    try {
      const response = await api.post("iot-device", formData);
      return response.data;
    } catch (error) {
      console.error("❌ Error identificando y guardando planta:", error);
      throw error;
    }
  },
    async getAllDevicesByUser() {
        try {
            console.log("🔍 Haciendo petición a /auth-user/me...");
            const response = await api.get("/iot-devices/me/me", {
                withCredentials: true,
                skipAuthInterceptor: true, // Bandera personalizada
            });
            console.log("✅ Usuario obtenido correctamente:", response.data);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.warn("⚠️ Usuario no autenticado o token expirado.");
                return null; // Devuelve null si no está autenticado
            }
            console.error("❌ Error obteniendo usuario:", error);
            throw error; // Lanza otros errores
        }
    },

  async getMyDeviceById(deviceId) {
    try {
      const response = await api.get(`iot-device/${deviceId}`);
      console.log("✅ Device obtenida por ID:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniesndo Device por ID:", error);
      throw error;
    }
  },
  
  async createSensor(formData) {
    try {
      const response = await api.post("sensor", formData);
      return response.data;
    } catch (error) {
      console.error("❌ Error identificando y guardando planta:", error);
      throw error;
    }
  },

    async getMySensorById(sensorId) {
    try {
      const response = await api.get(`sensor/${sensorId}`);
      console.log("✅ Device obtenida por ID:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo Device por ID:", error);
      throw error;
    }
  },

      async getMySensorByDeviceId(deviceId) {
    try {
      const response = await api.get(`sensor/device/${deviceId}`);
      console.log("✅ Device obtenida por ID:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo Device por ID:", error);
      throw error;
    }
  },
};

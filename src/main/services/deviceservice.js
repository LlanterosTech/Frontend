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
    async getAllDevicesByUser(){
    try{
      const response = await api.get('iot-device/me');
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo plantas del usuario:", error);
      throw error;
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

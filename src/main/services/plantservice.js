import api from "@/../api/api";


const plantservice = {
  async identifySavePlant(formData) {
    try {
      const response = await api.post("plant/identify-and-save", formData);
      return response.data;
    } catch (error) {
      console.error("❌ Error identificando y guardando planta:", error);
      throw error;
    }
  },

  async sendFormData(plantId, formPayload) {
    try {
      const response = await api.post(`my-plant/${plantId}`, formPayload);
      return response.data;
    } catch (error) {
      console.error("❌ Error enviando datos del formulario:", error);
      throw error;
    }
  },

  async getAllPlantsByUser(){
    try{
      const response = await api.get('my-plant');
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo plantas del usuario:", error);
      throw error;
    }
  },

  async getMyPlantById(plantId) {
    try {
      const response = await api.get(`my-plant/${plantId}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo planta por ID:", error);
      throw error;
    }
  } 
};

export default plantservice;
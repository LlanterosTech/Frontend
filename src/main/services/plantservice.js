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
};

export default plantservice;
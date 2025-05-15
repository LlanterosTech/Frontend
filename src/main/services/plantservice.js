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
  }
};

export default plantservice;
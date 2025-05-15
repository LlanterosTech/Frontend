import api from "@/../api/api";

const plantservice = {
  async identifySavePlant(formData) {
    try {
      const response = await api.post("plant/identify-and-save", formData, {
        headers: {
          // ❌ No incluyas "Content-Type" y deja que Axios lo infiera
        }
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error identificando y guardando planta:", error);
      throw error;
    }
  }
};

export default plantservice;

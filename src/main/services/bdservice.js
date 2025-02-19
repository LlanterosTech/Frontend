import api from "@/../api/api";

const bdService = {
    async getEstimaciones() {
        return api.get('estimacion')
            .then(response => response.data)
            .catch(error => {
                console.error("Error al obtener estimaciones:", error);
                throw error;
            });
    },

    async getEstimacionById(id) {
        return api.get(`estimacion/${id}`)
            .then(response => response.data)
            .catch(error => {
                console.error("Error al obtener la estimación:", error);
                throw error;
            });
    },

    async createEstimacion(estimacionData) {
        return api.post('estimacion/createestimacion', estimacionData)
        .then(response => response.data)
        .catch(error => {
            console.error("Error al crear la estimación:", error);
            throw error;
        });
    },

    async updateEstimacion(id, estimacionData) {
        return api.put(`estimacion/${id}`, estimacionData)
        .then(response => response.data)
        .catch(error => {
            console.error("Error al actualizar la estimación:", error);
            throw error;
        });
    },

    async getTotalCost(proyectoId) {
        return api.get(`estimacion/totalcost/${proyectoId}`)
            .then(response => response.data)
            .catch(error => {
                console.error("Error al obtener el costo total:", error);
                throw error;
            });
    },

    async getAtributosByTipoPamId(tipoPamId) {
        return api.get(`atributos-pam/atributos/${tipoPamId}`)
            .then(response => response.data)
            .catch(error => {
                console.error("Error al obtener los atributos del tipo PAM:", error);
                throw error;
            });
    },
    async getProyectos() {
        return api.get(`proyecto`)
            .then(response => response.data)
            .catch(error => {
                console.error("Error al obtener los atributos del tipo PAM:", error);
                throw error;
            });
    },
    async getTiposPAM() {
        return api.get(`tipo-pam/tipopams`)
            .then(response => response.data)
            .catch(error => {
                console.error("Error al obtener los atributos del tipo PAM:", error);
                throw error;
            });
    },
    async getCostoTotalByProyectoId(proyectoId) {
        return api.get(`estimacion/totalcost/${proyectoId}`)
            .then(response => response.data)
            .catch(error => {
                console.error("Error al obtener el costo total por proyecto:", error);
                throw error;
            });
    }
};

export default bdService;
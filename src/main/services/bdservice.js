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
            .then(response => response.data.filter(proyecto => proyecto.estado === true))
            .catch(error => {
                console.error("Error al obtener los proyectos:", error);
                throw error;
            });
    },
    async getTiposPAM() {
        return api.get(`tipo-pam/tipopams`)
            .then(response => response.data.filter(tipoPam => tipoPam.status === true))
            .catch(error => {
                console.error("Error al obtener los tipos PAM:", error);
                throw error;
            });
    },
    async createProyecto(nombreProyecto) {
        return api.post('proyecto/createproyecto', { name: nombreProyecto, descripcion: "Proyecto creado desde la UI" })
            .then(response => response.data)
            .catch(error => {
                console.error("Error al crear el proyecto:", error);
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
    },
    async getEstimacionesByProyectoAndTipoPam(proyectoId, tipoPamId) {
        return api.get(`estimacion/buscar?proyectoId=${Number(proyectoId)}&tipoPamId=${Number(tipoPamId)}`)
            .then(response => response.data)
            .catch(error => {
                console.error("Error al obtener estimaciones por ProyectoId y TipoPamId:", error);
                throw error;
            });
    },
    async getEstimacionesByTipoPamId(tipoPamId) {
        return api.get(`estimacion/tipoPam/${tipoPamId}`)
            .then(response => response.data)
            .catch(error => {
                console.error("Error al obtener estimaciones por TipoPamId:", error);
                throw error;
            });
    },
    async getEstimacionesByProyectoId(proyectoId) {
        return api.get(`estimacion/proyecto/${proyectoId}`)
            .then(response => response.data)
            .catch(error => {
                console.error("Error al obtener estimaciones por ProyectoId:", error);
                throw error;
            });
    },
    async deleteEstimacion(estimacionId){
        return api.delete(`estimacion/delete/${estimacionId}`)
            .then(response => response.data)
            .catch(error => {
                console.error("Error al eliminar la estimación:", error);
                throw error;
        });
    }
};

export default bdService;
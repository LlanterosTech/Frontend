<template>
    <div class="container">
        <div class="search-box">
            <div class="search-field">
                <label>Proyecto</label>
                <input type="text" v-model="proyecto" placeholder="Negros" />
            </div>
            <div class="search-field">
                <label>Tipo PAM</label>
                <input type="text" v-model="tipoPam" placeholder="Ingrese tipo PAM" />
            </div>
            <div class="search-field">
                <label>ID de PAM</label>
                <input type="text" v-model="idPam" placeholder="Ingrese ID de PAM" />
            </div>
            <button @click="buscarEstimacion" class="btn-search">Buscar</button>
        </div>

        <table class="estimaciones-table">
            <thead>
                <tr>
                    <th>Proyecto</th>
                    <th>Tipo de PAM</th>
                    <th>ID de PAM</th>
                    <th>Volumen (m³)</th>
                    <th>Área (m²)</th>
                    <th>Generación DAR</th>
                    <th>Cobertura</th>
                    <th>Tipo de cierre</th>
                    <th>Tipo de cobertura</th>
                    <th>Distancia (Km)</th>
                    <th class="highlight">Valor total Algoritmo</th>
                    <th>Editar</th>
                    <th>Eliminar</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="estimacion in estimaciones" :key="estimacion.estimacionId">
                    <td>{{ estimacion.proyecto.name }}</td>
                    <td>{{ estimacion.tipoPam.name }}</td>
                    <td>{{ estimacion.codPam }}</td>
                    <td>{{ obtenerAtributo(estimacion.valores, 1) || 'N/A' }}</td>
                    <td>{{ obtenerAtributo(estimacion.valores, 2) || 'N/A' }}</td>
                    <td>{{ obtenerAtributo(estimacion.valores, 3) || 'N/A' }}</td>
                    <td>{{ obtenerAtributo(estimacion.valores, 4) || 'N/A' }}</td>
                    <td>{{ obtenerAtributo(estimacion.valores) || 'N/A' }}</td>
                    <td>{{ obtenerAtributo(estimacion.valores, 5) || 'N/A' }}</td>
                    <td>{{ obtenerAtributo(estimacion.valores, 6) || 'N/A' }}</td>
                    <td class="highlight">{{ estimacion.costoEstimado?.totalEstimado || 'N/A' }}</td>
                    <td><button class="btn-edit">✔</button></td>
                    <td><button class="btn-delete">✖</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import bdService from "@/main/services/bdservice";

export default {
    data() {
        return {
            proyecto: "",
            tipoPam: "",
            idPam: "",
            estimaciones: [],
            proyectos: [],
            tiposPAM: []
        };
    },
    async mounted() {
        await this.getEstimaciones(); 
        await this.getProyectosYTipos(); 
    },
    methods: {
        async getEstimaciones() {
            try {
                const response = await bdService.getEstimaciones();
                this.estimaciones = response;
            } catch (error) {
                console.error("Error al obtener estimaciones:", error);
            }
        },
        async getProyectosYTipos() {
            try {
                this.proyectos = await bdService.getProyectos();
                this.tiposPAM = await bdService.getTiposPAM();
            } catch (error) {
                console.error("Error al cargar proyectos y tipos de PAM:", error);
            }
        },
        async buscarEstimacion() {
            try {
                if (!this.proyecto && !this.tipoPam && !this.idPam) {
                    return this.getEstimaciones();
                }
                let proyectoId = null;
                let tipoPamId = null;
                if (this.proyecto) {
                    const proyectoEncontrado = this.proyectos.find(p => p.name.toLowerCase() === this.proyecto.toLowerCase());
                    if (!proyectoEncontrado) {
                        alert("El proyecto ingresado no existe.");
                        return;
                    }
                    proyectoId = proyectoEncontrado.proyectoId;
                }
                if (this.tipoPam) {
                    const tipoPamEncontrado = this.tiposPAM.find(tp => tp.name.toLowerCase() === this.tipoPam.toLowerCase());
                    if (!tipoPamEncontrado) {
                        alert("El tipo de PAM ingresado no existe.");
                        return;
                    }
                    tipoPamId = tipoPamEncontrado.id;
                }
                let response;
                if (proyectoId && tipoPamId) {
                    response = await bdService.getEstimacionesByProyectoAndTipoPam(proyectoId, tipoPamId);
                } else if (proyectoId) {
                    response = await bdService.getEstimacionesByProyectoId(proyectoId);
                } else if (tipoPamId) {
                    response = await bdService.getEstimacionesByTipoPamId(tipoPamId);
                } else {
                    response = await bdService.getEstimaciones();
                }
                this.estimaciones = response;
            } catch (error) {
                console.error("Error al buscar estimaciones:", error);
                alert("Error al buscar estimaciones.");
            }
        },
        obtenerAtributo(valores, atributoId) {
            const atributo = valores.find(v => v.atributoPamId === atributoId);
            return atributo ? atributo.valor : 'N/A';
        }
    }
};
</script>

<style scoped>
.container {
    padding: 20px;
    background-color: #f8f9fa;
}
.search-box {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}
.search-field {
    display: flex;
    flex-direction: column;
}
.btn-search {
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
}
.estimaciones-table {
    width: 100%;
    border-collapse: collapse;
}
.estimaciones-table th, .estimaciones-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
}
.highlight {
    background-color: yellow;
}
.btn-edit {
    color: green;
    font-size: 20px;
}
.btn-delete {
    color: red;
    font-size: 20px;
}
</style>

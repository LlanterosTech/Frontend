<template>
        <div class="container">
        <div class="design">
            <img src="@/assets/Group_2.png" class="plant plant-1" alt="Plant 1">
            <img src="@/assets/Group_2.png" class="plant plant-2" alt="Plant 2">
            <img src="@/assets/Group_2.png" class="plant plant-3" alt="Plant 3">
            <img src="@/assets/Group_2.png" class="plant plant-4" alt="Plant 4">
            <img src="@/assets/Group_2.png" class="plant plant-5" alt="Plant 5">
            <img src="@/assets/Group_2.png" class="plant plant-6" alt="Plant 6">
        </div>
            <div class="init-box">
            <div class="top-buttons">
                <button @click="goBack" class="btn-back">
                    <i class="fas fa-arrow-left"></i>
                </button>
            </div>
                <div class="download-buttons">
            <button @click="downloadFilteredPdf" class="btn-download-pdf">
                <i class="fas fa-file-pdf"></i> Descargar PDF
            </button>
            <button @click="downloadResumenEjecutivo" class="btn-download-resumen">
                <i class="fas fa-file-pdf"></i> Resumen Ejecutivo
            </button>
        </div>
            <div class="init">
            <h1 class="title">Buscar Estimaciones</h1>
            <p class="subtitle">Encuentra y administra tus estimaciones.</p>

            <div class="search-box">
            <div class="search-field">
                <label>Proyecto</label>
                <input type="text" v-model="proyecto" placeholder="" />
            </div>
            <div class="search-field">
                <label>Tipo de PAM</label>
                <input type="text" v-model="tipoPam" placeholder="Ingrese tipo PAM" />
            </div>
            <div class="search-field">
                <label>ID de PAM</label>
                <input type="text" v-model="idPam" placeholder="Ingrese ID de PAM" />
            </div>
            </div>

            <div class="table-container">
            <table class="table">
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
                    <th class="highlight">Total Estimado</th>
                    <th>Fecha</th>
                    <th>Usuario</th>
                    <th>Área de Registro</th>
                    <th>Editar</th>
                    <th>Eliminar</th>
                    <th>Detalle</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="estimacion in paginatedEstimaciones" :key="estimacion.estimacionId">
                    <td>{{ estimacion.proyecto.name }}</td>
                    <td>{{ estimacion.tipoPam.name }}</td>
                    <td>{{ estimacion.codPam }}</td>
                    <td>{{ obtenerAtributo(estimacion.valores, 1) || 'N/A' }}</td>
                    <td>{{ obtenerAtributo(estimacion.valores, 2) || 'N/A' }}</td>
                    <td>{{ convertirBooleano(obtenerAtributo(estimacion.valores, 3)) }}</td>
                    <td>{{ convertirBooleano(obtenerAtributo(estimacion.valores, 4)) }}</td>
                    <td>{{ obtenerAtributo(estimacion.valores, 5) || 'N/A' }}</td>
                    <td>{{ obtenerAtributo(estimacion.valores, 6) || 'N/A' }}</td>
                    <td>{{ obtenerAtributo(estimacion.valores, 7) || 'N/A' }}</td>
                    <td class="highlight">S/&nbsp;{{ estimacion.costoEstimado?.totalEstimado.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A' }}
                    </td>                <td>{{ formatFecha(estimacion.fechaPam) }}</td>
                    <td>{{ estimacion.usuario.email }}</td>
                    <td>{{ estimacion.usuario.registerArea }}</td>
                    <td>   
                        <button @click="editarEstimacion(estimacion.estimacionId)" class="btn-action">
                        <i class="fas fa-edit"></i>
                        </button>
                    </td>  
                        <td> 
                        <button @click="eliminarEstimacion(estimacion.estimacionId)" class="btn-action">
                        <i class="fas fa-trash"></i>
                        </button>
                        </td>
                        <td>
                        <button @click="verDetalle(estimacion)" class="btn-action">
                        <i class="fas fa-eye"></i>
                        </button>
                        </td>
                        
                    </tr>
                </tbody>
                </table>
                <div class="pagination">
                <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
                <span>Página {{ currentPage }} de {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages">Siguiente</button>
                </div>
            </div>

            <div v-if="detalleVisible" class="detalle-overlay" :class="{ 'show': detalleVisible }">
                <div class="detalle-box">
                    <button @click="toggleDetalle" class="btn-secondary btn-close">
                        X
                    </button>
                    <h2  class="text-lg-font-semibold-mb-4">Costo Estimado del PAM - {{ estimaciones.codPam }}</h2>
                    <div class="grid grid-cols-2 gap-4">
                        <p class="cost-item"><strong>Costo Directo:</strong> {{ formatNumero(detalleCosto.costoDirecto) }}</p>
                        <p class="cost-item"><strong>Gastos Generales:</strong> {{ formatNumero(detalleCosto.gastosGenerales) }}</p>
                        <p class="cost-item"><strong>Utilidad:</strong> {{ formatNumero(detalleCosto.utilidades) }}</p>
                        <p class="cost-item"><strong>Subtotal:</strong> {{ formatNumero(detalleCosto.subTotal) }}</p>
                        <p class="cost-item"><strong>IGV:</strong> {{ formatNumero(detalleCosto.igv) }}</p>
                        <p class="cost-item"><strong>Subtotal Obra:</strong> {{ formatNumero(detalleCosto.subTotalObras) }}</p>
                        <p class="cost-item"><strong>Expediente Técnico:</strong> {{ formatNumero(detalleCosto.expedienteTecnico) }}</p>
                        <p class="cost-item"><strong>Supervisión:</strong> {{ formatNumero(detalleCosto.supervision) }}</p>
                        <p class="cost-item"><strong>Gestión de Proyectos:</strong> {{ formatNumero(detalleCosto.gestionProyecto) }}</p>
                        <p class="cost-item"><strong>Capacitación:</strong> {{ formatNumero(detalleCosto.capacitacion) }}</p>
                        <p class="cost-item"><strong>Contingencias:</strong> {{ formatNumero(detalleCosto.contingencias) }}</p>
                        <p class="cost-item total-estimado"><strong>Total Estimado:</strong> {{ formatNumero(detalleCosto.totalEstimado) }}</p>
                    </div>
                </div>
            </div>    </div>
        </div>
        <transition name="fade">
            <div v-if="error" class="alert-container">
            <p class="error-message">{{ error }}</p>
            </div>
        </transition>
        </div>
    </template>

    <script>
    import jsPDF from "jspdf";
    import "jspdf-autotable";
    import bdService from "@/main/services/bdservice";
    import userService from "@/main/services/userservice";

    export default {
    data() {
        return {
        proyecto: "",
        tipoPam: "",
        idPam: "",
        estimaciones: [],
        proyectos: [],
        tiposPAM: [],
        detalleVisible: false,
        detalleCosto: {},
        currentPage: 1,
        itemsPerPage: 10,
        ultimasEstimaciones: []
        };
    },
    computed: {
        totalPages() {
        return Math.ceil(this.estimaciones.length / this.itemsPerPage);
        },
        paginatedEstimaciones() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.estimaciones.slice(start, end);
        }
    },
    watch: {
        proyecto: 'buscarEstimacion',
        tipoPam: 'buscarEstimacion',
        idPam: 'buscarEstimacion'
    },
    async mounted() {
        await this.getEstimaciones();
        await this.getProyectosYTipos();
    },
    methods: {
        async goBack() {
        this.$router.go(-1);
        },
        async getEstimaciones() {
        try {
            const estimaciones = await bdService.getEstimaciones();
            console.log("Datos obtenidos:", estimaciones); // 🔹 Imprimir los datos recibidos

            for (let estimacion of estimaciones) {
            try {
                const usuario = await userService.getAuthUser(estimacion.usuarioId);
                estimacion.usuario = usuario; // Agrega el usuario a la estimación
            } catch (error) {
                console.error(`Error obteniendo el usuario para ID ${estimacion.usuarioId}:`, error);
                estimacion.usuario = { email: "Desconocido", area: "No definido" }; // Fallback
            }
            }
            this.estimaciones = estimaciones;
        } catch (error) {
            console.error("Error al cargar las estimaciones:", error);
        }
        },
        formatFecha(fecha) {
        const date = new Date(fecha);
        const dia = date.getDate().toString().padStart(2, '0');
        const mes = (date.getMonth() + 1).toString().padStart(2, '0');
        const anio = date.getFullYear();
        return `${dia}/${mes}/${anio}`;
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
            let response = await bdService.getEstimaciones();

            if (this.proyecto) {
            response = response.filter(estimacion =>
                estimacion.proyecto.name.toLowerCase().includes(this.proyecto.toLowerCase())
            );
            }

            if (this.tipoPam) {
            response = response.filter(estimacion =>
                estimacion.tipoPam.name.toLowerCase().includes(this.tipoPam.toLowerCase())
            );
            }

            if (this.idPam) {
            response = response.filter(estimacion =>
                estimacion.codPam === this.idPam
            );
            }

            console.log("Datos obtenidos:", response); // 🔹 Imprimir los datos recibidos

            for (let estimacion of response) {
            try {
                const usuario = await userService.getAuthUser(estimacion.usuarioId);
                estimacion.usuario = usuario; // Agregar el usuario a la estimación
            } catch (error) {
                console.error(`Error obteniendo el usuario para ID ${estimacion.usuarioId}:`, error);
                estimacion.usuario = { email: "Desconocido", area: "No definido" }; // Fallback en caso de error
            }
            }

            this.estimaciones = response; // Actualizar el estado con las estimaciones obtenidas
        } catch (error) {
            console.error("Error al buscar estimaciones:", error);
            alert("Error al buscar estimaciones.");
        }
        },
        convertirBooleano(valor) {
        if (valor === true || valor === "true") return "Sí";
        if (valor === false || valor === "false") return "No";
        return valor; // Retorna el valor original si no es booleano
        },
        obtenerAtributo(valores, atributoId) {
        const atributo = valores.find(v => v.atributoPamId === atributoId);
        if (!atributo) return "N/A";

        if (atributo.valor === true || atributo.valor === false || atributo.valor === "true" || atributo.valor === "false") {
            return this.convertirBooleano(atributo.valor);
        }

        return atributo.valor; // Devuelve el valor original si no es booleano
        },
        verDetalle(estimacion) {
        this.detalleCosto = estimacion.costoEstimado;
        this.detalleVisible = true;
        },
        toggleDetalle() {
        this.detalleVisible = !this.detalleVisible;
        },
        formatNumero(valor) {
      if (valor == null || isNaN(valor)) return 'S/ 0';
      const roundedValue = Math.round(valor);
      return `S/ ${Number(roundedValue).toLocaleString('es-PE')}`;
    },
        editarEstimacion(id) {
        // Lógica para editar la estimación
        console.log(`Editar estimación con ID: ${id}`);
        },
        eliminarEstimacion(id) {
        if (confirm("¿Estás seguro de que deseas eliminar esta estimación?")) {
            bdService.deleteEstimacion(id)
            .then(() => {
                console.log(`Estimación con ID: ${id} eliminada exitosamente.`);
                this.estimaciones = this.estimaciones.filter(estimacion => estimacion.estimacionId !== id);
            })
            .catch(error => {
                console.error(`Error al eliminar la estimación con ID: ${id}`, error);
            });
        }
        },
        descargarPDF(id) {
        // Lógica para descargar el PDF de la estimación
        console.log(`Descargar PDF de la estimación con ID: ${id}`);
        },
        prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
        },
        nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
        },
        downloadFilteredPdf() {
      const doc = new jsPDF("p", "mm", "a4");

      // 📌 Título del reporte
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Cálculo de Costos por PAM", 10, 15);

      let startY = 25; // 📌 Margen inicial
      let totalCostoProyectos = {}; // 📌 Acumulador del costo total por proyecto

      // 🔹 ORDENAMOS LAS ESTIMACIONES POR CÓDIGO PAM
      const estimacionesOrdenadas = [...this.paginatedEstimaciones].sort((a, b) => a.codPam - b.codPam);

      estimacionesOrdenadas.forEach((estimacion) => {
        // Si ya imprimimos una estimación en la página, forzamos una nueva
        if (startY !== 25) {
          doc.addPage();
          startY = 25; // Reiniciar margen superior
        }

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`Proyecto: ${estimacion.proyecto.name}`, 10, startY);
        doc.text(`Tipo de PAM: ${estimacion.tipoPam.name}`, 10, startY + 8);
        doc.text(`ID de PAM: ${estimacion.codPam}`, 10, startY + 16);

        doc.setFont("helvetica", "normal");

        // Sección de Características
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.setFillColor(0, 102, 204); // Azul
        doc.rect(10, startY + 24, 190, 10, "F");
        doc.text("Características", 12, startY + 31);

        const tableColumnsCaracteristicas = ["Descripción", "Valor"];
        const tableRowsCaracteristicas = [
          ["Volumen (m³)", estimacion.valores?.find(v => v.atributoPamId === 1)?.valor || "N/A"],
          ["Área (m²)", estimacion.valores?.find(v => v.atributoPamId === 2)?.valor || "N/A"],
          ["Generación DAR", this.convertirBooleano(estimacion.valores?.find(v => v.atributoPamId === 3)?.valor)],
          ["Cobertura", this.convertirBooleano(estimacion.valores?.find(v => v.atributoPamId === 4)?.valor)],
          ["Tipo de cierre", estimacion.valores?.find(v => v.atributoPamId === 5)?.valor || "N/A"],
          ["Tipo de cobertura", estimacion.valores?.find(v => v.atributoPamId === 6)?.valor || "N/A"],
          ["Distancia (Km)", estimacion.valores?.find(v => v.atributoPamId === 7)?.valor || "N/A"]
        ];

        doc.autoTable({
          startY: startY + 35,
          head: [tableColumnsCaracteristicas],
          body: tableRowsCaracteristicas,
          theme: "grid",
          styles: { fontSize: 10 },
          headStyles: { fillColor: [0, 102, 204] },
          alternateRowStyles: { fillColor: [240, 240, 240] }
        });

        // Sección de Estimación de Costo de Cierre
        startY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.setFillColor(255, 165, 0); // Naranja
        doc.rect(10, startY, 190, 10, "F");
        doc.text("Estimación de Costo de Cierre", 12, startY + 7);

        const tableColumnsCostoCierre = ["Descripción", "Valor"];
        const tableRowsCostoCierre = [
          ["Costo Directo", this.formatNumero(estimacion.costoEstimado?.costoDirecto)],
          ["Gastos Generales", this.formatNumero(estimacion.costoEstimado?.gastosGenerales)],
          ["Utilidad", this.formatNumero(estimacion.costoEstimado?.utilidades)],
          ["Subtotal", this.formatNumero(estimacion.costoEstimado?.subTotal)]
        ];

        doc.autoTable({
          startY: startY + 12,
          head: [tableColumnsCostoCierre],
          body: tableRowsCostoCierre,
          theme: "grid",
          styles: { fontSize: 10 },
          headStyles: { fillColor: [255, 165, 0] },
          alternateRowStyles: { fillColor: [240, 240, 240] }
        });

        // Sección de Otros
        startY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.setFillColor(34, 139, 34); // Verde
        doc.rect(10, startY, 190, 10, "F");
        doc.text("Otros", 12, startY + 7);

        const tableColumnsOtros = ["Descripción", "Valor"];
        const tableRowsOtros = [
          ["IGV", this.formatNumero(estimacion.costoEstimado?.igv)],
          ["Subtotal Obra", this.formatNumero(estimacion.costoEstimado?.subTotalObras)],
          ["Expediente Técnico", this.formatNumero(estimacion.costoEstimado?.expedienteTecnico)],
          ["Supervisión", this.formatNumero(estimacion.costoEstimado?.supervision)],
          ["Gestión de Proyectos", this.formatNumero(estimacion.costoEstimado?.gestionProyecto)],
          ["Capacitación", this.formatNumero(estimacion.costoEstimado?.capacitacion)],
          ["Contingencias", this.formatNumero(estimacion.costoEstimado?.contingencias)]
        ];

        doc.autoTable({
          startY: startY + 12,
          head: [tableColumnsOtros],
          body: tableRowsOtros,
          theme: "grid",
          styles: { fontSize: 10 },
          headStyles: { fillColor: [34, 139, 34] },
          alternateRowStyles: { fillColor: [240, 240, 240] }
        });

        // 🛠️ Verificar si finalY existe antes de usarlo
        if (doc.lastAutoTable && doc.lastAutoTable.finalY) {
          startY = doc.lastAutoTable.finalY + 10;
        } else {
          startY += 30; // Un espacio predeterminado si no existe finalY
        }

        // 🔹 Sección de "Total Estimado" con fondo amarillo
        doc.setFillColor(255, 255, 0);
        doc.rect(10, startY, 90, 8, "F");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(
          `Total Estimado: ${this.formatNumero(estimacion.costoEstimado?.totalEstimado)}`,
          12,
          startY + 5
        );

        // Acumular el costo total por proyecto
        const proyectoName = estimacion.proyecto.name;
        if (!totalCostoProyectos[proyectoName]) {
          totalCostoProyectos[proyectoName] = 0;
        }
        totalCostoProyectos[proyectoName] += Number(estimacion.costoEstimado?.totalEstimado) || 0;

        startY += 20; // Espaciado extra antes del siguiente bloque
      });

      // Agregar una nueva página para el costo total por proyecto
      Object.keys(totalCostoProyectos).forEach((proyectoName) => {
        doc.addPage();
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(`Costo Total del Proyecto: ${proyectoName}`, 10, 20);
        doc.setFontSize(14);
        doc.text(`Total: S/ ${totalCostoProyectos[proyectoName].toFixed(2)}`, 10, 30);
      });

      // Convertir el PDF a Blob y abrirlo en una nueva ventana
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl);
    },
    downloadResumenEjecutivo() {
      const doc = new jsPDF("p", "mm", "a4");

      // 📌 Ajustar márgenes y reducir el tamaño de la fuente para optimizar espacio
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Resumen Ejecutivo", 10, 10);

      doc.setFontSize(12);
      doc.text(`Proyecto: ${this.paginatedEstimaciones[0]?.proyecto.name || "N/A"}`, 10, 18);

      let startY = 25; // 📌 Margen inicial optimizado

      // 🔹 ORDENAMOS LAS ESTIMACIONES POR CÓDIGO PAM
      const estimacionesOrdenadas = [...this.paginatedEstimaciones].sort((a, b) => a.codPam - b.codPam);

      // Configuración de la tabla con margen ajustado
      const tableColumns = ["Tipo PAM", "ID PAM", "Volumen (m³)", "Área (m²)", "Total Estimado"];
      const tableRows = estimacionesOrdenadas.map(estimacion => [
        estimacion.tipoPam.name,
        estimacion.codPam,
        estimacion.valores?.find(v => v.atributoPamId === 1)?.valor || "N/A",
        estimacion.valores?.find(v => v.atributoPamId === 2)?.valor || "N/A",
        `S/ ${estimacion.costoEstimado?.totalEstimado.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A'}`
      ]);

      doc.autoTable({
        startY: startY,
        head: [tableColumns],
        body: tableRows,
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [41, 128, 185] },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        margin: { top: 25 } // Ajuste del margen superior
      });

      // Convertir el PDF a Blob y abrirlo en una nueva ventana
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl);
    }
    }
    };
    </script>

    <style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

    .top-buttons {
        display: flex;
        justify-content: space-between; /* Separa los botones a los extremos */
        width: 100%;
        padding-bottom: 10px; /* Espacio entre los botones y el título */
    }
    .download-buttons {
    display: flex;
    justify-content: flex-end; /* Alinea los botones a la derecha */
    gap: 10px; /* Espaciado entre botones */
    margin-top: 10px; /* Espaciado con los elementos superiores */
}

.btn-download-pdf,
.btn-download-resumen {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
}

.btn-download-pdf {
    background-color: red;
    color: white;
}

.btn-download-pdf i,
.btn-download-resumen i {
    margin-right: 5px;
}

.btn-download-resumen {
    background-color: blue;
    color: white;
}

    *, html, body {
        margin: 0;
        padding: 0;
    }

    body {
        font-family: 'Poppins', sans-serif;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(to bottom right, #8fc280, #81cc7a, #8fc280);
    }
    .highlight {
    white-space: nowrap;
    }
    .container {
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .design {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: 0; /* Asegúrate de que las plantas estén en el fondo */
    }

    .plant {
        position: absolute;
        width: 420px;
        height: auto;
        opacity: 0.9;
    }

    .plant-1 {
        bottom: -10px;
        left: -20px;
    }

    .btn-back {

    background: none;
    border: none;
    cursor: pointer;
    color: #13863a;
    font-size: 1.5rem;
    transition: transform 0.3s;
    }


    .btn-action {
        padding: 5px;
        margin: 0 2px;
        color: white;
        background-color: #4fd87d;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: transform 0.3s;
    }

    .btn-action:hover {
        transform: scale(1.1);
    }
    .plant-2 {
        top: -50px;
        left: -60px;
    }

    .plant-3 {
        top: -50px;
        left: 180px;
    }

    .plant-4 {
        bottom: -150px;
        left: 200px;
    }

    .plant-5 {
        top: 30px;
        left: 250px;
    }

    .plant-6 {
        bottom: 30px;
        left: 80px;
    }

    .init-box {
        background: rgba(255, 255, 255, 0.9);
        padding: 50px;
        border-radius: 15px;
        box-shadow: 0 0 25px 12px rgb(0 0 0 / 30%);
        z-index: 1; /* Asegúrate de que el init-box esté encima de las plantas */
        width: 92%;
        max-width: 2500px;
    }

    .init {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .init h1.title {
        margin: 20px 0;
        font-size: 3.2rem;
    }

    .init p.subtitle {
        font-size: 1.2rem;
        color: #666;
        margin-bottom: 20px;
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

    .table-container {
        width: 100%;
        margin-top: 20px;
        overflow-y: auto; /* Agregar barra de desplazamiento vertical */
        max-height: 400px; /* Altura máxima de la tabla */
    }

    .table {
        width: 100%;
        border-collapse: collapse;
    }

    .table th, .table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }

    .table th {
        background-color: #f2f2f2;
    }

    .table tr:nth-child(even) {
        background-color: #f9f9f9;
    }

    .table tr:hover {
        background-color: #ddd;
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

    .btn-detail {
        color: blue;
        font-size: 20px;
        cursor: pointer;
    }

    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin-top: 10px;
    }

    .pagination button {
        padding: 5px 10px;
        border: none;
        border-radius: 5px;
        background-color: #007bff;
        color: white;
        cursor: pointer;
    }

    .pagination button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    .detalle-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s, visibility 0.3s;
    }

    .detalle-overlay.show {
        opacity: 1;
        visibility: visible;
    }

    .detalle-box {
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 25px 12px rgb(0 0 0 / 30%);
        z-index: 1001;
        max-width: 800px;
        width: 90%;
    }

    .btn-close {
        position: relative;
        float: right;
        background: none;
        border: none;
        cursor: pointer;
        color: #13863a;
        font-size: 1.5rem;
        transition: transform 0.3s;
    }

    .btn-close:hover {
        transform: scale(1.1);
    }

    .alert-container {
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255, 0, 0, 0.8);
        padding: 10px 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transition: opacity 0.5s ease-in-out;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.5s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
        opacity: 0;
    }
    .cost-item {
        font-size: 1rem;
        color: #333;
        margin-bottom: 10px;
    }

    .total-estimado {
        font-size: 1.2rem;
        font-weight: bold;
        color: #1f4401; /* Color rojo para resaltar */
    }
    .text-lg-font-semibold-mb-4 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
    }
    .error-message {
        color: white;
        font-size: 0.9rem;
    }
    </style>

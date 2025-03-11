<template>
        <div class="container fondo">
       
            <div class="init-box">
            <div class="top-buttons">
                <button @click="goBack" class="btn-back">
                    <i class="fas fa-arrow-left"></i>
                </button>
            </div>
                <div v-if="selectedProyectos.length > 0 || selectedTiposPAM.length > 0" class="download-buttons">
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

             <!-- SEARCH BOX CON SELECCIÓN MÚLTIPLE -->
        <div class="search-box">
          <!-- PROYECTO -->
          <div class="search-field">
            <label>Proyecto</label>
            <multiselect 
              v-model="selectedProyectos" 
              :options="proyectos" 
              :multiple="true"
              placeholder="Seleccione uno o más proyectos"
              label="name"
              track-by="name"
            />
          </div>

          <!-- TIPO DE PAM -->
          <div class="search-field">
            <label>Tipo de PAM</label>
            <multiselect 
              v-model="selectedTiposPAM" 
              :options="tiposPAM" 
              :multiple="true"
              placeholder="Seleccione uno o más tipos de PAM"
              label="name"
              track-by="name"
            />
          </div>

          <!-- ID de PAM -->
          <div class="search-field">
            <label>ID de PAM</label>
            <input type="text" v-model="idPam" placeholder="Ingrese el Identificador PAM" />
          </div>
        </div>

            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr class="encabezados-ultimas">
                            <th>Proyecto</th>
                            <th>Tipo de PAM</th>
                            <th>ID de PAM</th>
                            <th class="highlight">Total Estimado</th>
                            <th>Fecha</th>
                            <th>Usuario</th>
                            <th>Departamento</th>
                            <th>Acción</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="estimacion in paginatedEstimaciones" :key="estimacion.estimacionId">
                            <td>{{ estimacion.proyecto.name }}</td>
                            <td>{{ estimacion.tipoPam.name }}</td>
                            <td>{{ estimacion.codPam }}</td>
                            <td class="highlight">{{ formatNumero(estimacion.costoEstimado?.totalEstimado) || 'N/A' }}</td>
                            <td>{{ formatFecha(estimacion.fechaPam) }}</td>
                            <td>{{ estimacion.usuario.email }}</td>
                            <td>{{ estimacion.usuario.registerArea }}</td>

                            <!-- Botón Eliminar -->
                            <td class="acciones">
                           

                            <button @click="verDetalle(estimacion)" class="btn-actiondetalle">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button @click="eliminarEstimacion(estimacion.estimacionId)" class="btn-actiondelete">
                                <i class="fas fa-trash"></i>
                            </button>

                            <button @click="descargarEstimacionPDF(estimacion)" class="btn-actiondescargar btn-download">
                                <i class="fas fa-file-pdf"></i>
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
                <h2 class="text-lg-font-semibold-mb-4">Costo Estimado del PAM: {{ detalleEstimacion.tipoPam.name }} - {{ detalleEstimacion.codPam }}</h2>
                <div class="grid grid-cols-2 gap-4 costo-estimado-grid">
                <p class="costo-item"><strong>Costo Directo:</strong> {{ formatNumero(detalleCosto.costoDirecto) }}</p>
                <p class="costo-item"><strong>Gastos Generales:</strong> {{ formatNumero(detalleCosto.gastosGenerales) }}</p>
                <p class="costo-item"><strong>Utilidad:</strong> {{ formatNumero(detalleCosto.utilidades) }}</p>
                <p class="costo-item"><strong>Subtotal:</strong> {{ formatNumero(detalleCosto.subTotal) }}</p>
                <p class="costo-item"><strong>IGV:</strong> {{ formatNumero(detalleCosto.igv) }}</p>
                <p class="costo-item"><strong>Subtotal Obra:</strong> {{ formatNumero(detalleCosto.subTotalObras) }}</p>
                <p class="costo-item"><strong>Expediente Técnico:</strong> {{ formatNumero(detalleCosto.expedienteTecnico) }}</p>
                <p class="costo-item"><strong>Supervisión:</strong> {{ formatNumero(detalleCosto.supervision) }}</p>
                <p class="costo-item"><strong>Gestión de Proyectos:</strong> {{ formatNumero(detalleCosto.gestionProyecto) }}</p>
                <p class="costo-item"><strong>Capacitación:</strong> {{ formatNumero(detalleCosto.capacitacion) }}</p>
                <p class="costo-item"><strong>Contingencias:</strong> {{ formatNumero(detalleCosto.contingencias) }}</p>
                </div>
                <div class="total-estimado-container">
    <p class="cost-item total-estimado"><strong>Total Estimado:</strong>  {{ formatNumero(detalleCosto.totalEstimado) }}</p>
    </div>

                </div>
            </div>
            </div>
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
    import Multiselect from "vue-multiselect";

    export default {
    data() {
        return {
        proyecto: "",
        tipoPam: "",
        idPam: "",
        estimaciones: [],
        selectedProyectos: [],
        selectedTiposPAM: [],
        proyectos: [],
        tiposPAM: [],
        detalleVisible: false,
        detalleCosto: {},
        currentPage: 1,
        itemsPerPage: 10,
        detalleEstimacion: {}, 
        error: null,
        };
    },
    components: {
        Multiselect,
    },
    computed: {
        totalPages() {
        return Math.ceil(this.estimaciones.length / this.itemsPerPage);
        },
        paginatedEstimaciones() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredEstimaciones.slice(start, end); 
  },
  filteredEstimaciones() {
    return this.estimaciones.filter((estimacion) => {
      // Asegurar que 'codPam' y 'idPam' no sean undefined antes de comparar
      const codPam = estimacion.codPam ? estimacion.codPam.toLowerCase().trim() : "";
      const idPamFilter = this.idPam ? this.idPam.toLowerCase().trim() : "";

      const coincideProyecto =
        this.selectedProyectos.length === 0 ||
        this.selectedProyectos.some((p) => p.name.toLowerCase() === estimacion.proyecto.name.toLowerCase());

      const coincideTipoPam =
        this.selectedTiposPAM.length === 0 ||
        this.selectedTiposPAM.some((tp) => tp.name.toLowerCase() === estimacion.tipoPam.name.toLowerCase());

      // Usar includes() para permitir coincidencias parciales
      const coincideIdPam = !idPamFilter || codPam.includes(idPamFilter);

      return coincideProyecto && coincideTipoPam && coincideIdPam;
    });
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
    async getEstimaciones() {
        try {
            const estimaciones = await bdService.getEstimaciones();
            console.log("Datos obtenidos:", estimaciones); 

            for (let estimacion of estimaciones) {
            try {
                const usuario = await userService.getAuthUser(estimacion.usuarioId);
                estimacion.usuario = usuario; 
            } catch (error) {
                console.error(`Error obteniendo el usuario para ID ${estimacion.usuarioId}:`, error);
                estimacion.usuario = { email: "Desconocido", area: "No definido" }; 
            }
            }
            this.estimaciones = estimaciones;
        } catch (error) {
            console.error("Error al cargar las estimaciones:", error);
            this.error = "Error al cargar las estimaciones.";
            this.clearErrorAfterTimeout();
        }
        },
        descargarEstimacionPDF(estimacion) {
    const doc = new jsPDF("p", "mm", "a4");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Detalle de Estimación", doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

    // **Encabezado con Proyecto, Tipo de PAM e ID de PAM**
    doc.setFontSize(14);
    doc.text(`Proyecto: ${estimacion.proyecto.name}`, 15, 30);
    doc.text(`Tipo de PAM: ${estimacion.tipoPam.name}`, 15, 40);
    doc.text(`ID de PAM: ${estimacion.codPam}`, 15, 50);

    // **Primera tabla: Información del usuario**
    const tableColumnsUsuario = ["Descripción", "Valor"];
    const tableRowsUsuario = [
        ["Usuario", estimacion.usuario.email || "Desconocido"],
        ["Departamento", estimacion.usuario.registerArea || "No definido"],
        ["Fecha", this.formatFecha(estimacion.fechaPam) || "N/A"]
    ];

    doc.autoTable({
        startY: 60,
        head: [tableColumnsUsuario],
        body: tableRowsUsuario,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [39, 174, 96] },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        margin: { left: 15, right: 15 }
    });

    // **Segunda tabla: Características**
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
        startY: doc.lastAutoTable.finalY + 10,
        head: [tableColumnsCaracteristicas],
        body: tableRowsCaracteristicas,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [46, 204, 113] },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        margin: { left: 15, right: 15 }
    });

    // **Tercera tabla: Desglose del Total Estimado**
    const tableColumnsCostoCierre = ["Estimación de costo de cierre", "Valor"];
    const tableRowsCostoCierre = [
        ["Costo Directo", this.formatNumero(estimacion.costoEstimado?.costoDirecto)],
        ["Gastos Generales", this.formatNumero(estimacion.costoEstimado?.gastosGenerales)],
        ["Utilidad", this.formatNumero(estimacion.costoEstimado?.utilidades)],
        ["Subtotal", this.formatNumero(estimacion.costoEstimado?.subTotal)],
        ["Subtotal Obra", this.formatNumero(estimacion.costoEstimado?.subTotalObras)]
    ];

    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        head: [tableColumnsCostoCierre],
        body: tableRowsCostoCierre,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [39, 174, 96] },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        margin: { left: 15, right: 15 }
    });

    // **Cuarta tabla: Otros costos adicionales**
    const tableColumnsOtros = ["Otros", "Valor"];
    const tableRowsOtros = [
        ["IGV 18%", this.formatNumero(estimacion.costoEstimado?.igv)],
        ["Expediente Técnico 6%", this.formatNumero(estimacion.costoEstimado?.expedienteTecnico)],
        ["Supervisión 15%", this.formatNumero(estimacion.costoEstimado?.supervision)],
        ["Gestión de Proyectos 5%", this.formatNumero(estimacion.costoEstimado?.gestionProyecto)],
        ["Capacitación 1%", this.formatNumero(estimacion.costoEstimado?.capacitacion)],
        ["Contingencias 6%", this.formatNumero(estimacion.costoEstimado?.contingencias)]
    ];

    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        head: [tableColumnsOtros],
        body: tableRowsOtros,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [30, 132, 73] },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        margin: { left: 15, right: 15 }
    });

    // **Total Estimado final**
    doc.setFontSize(19);
    doc.setTextColor(0, 0, 0);
    doc.text(
        `Total Estimado: ${this.formatNumero(estimacion.costoEstimado?.totalEstimado)}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.lastAutoTable.finalY + 15,
        { align: 'right' }
    );

    // **Nota de precisión**
    doc.setFontSize(8);
    doc.text("La información resultante solo debe ser utilizada para fines de cálculo referencial (+/-50% de precisión)", 
        doc.internal.pageSize.getWidth() / 2, doc.lastAutoTable.finalY + 40, { align: 'center' });

    // **Número de página**
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.text(`Página ${pageCount}`, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 10);

    // **Generar el PDF**
    const pdfUrl = doc.output('bloburl');
    window.open(pdfUrl, '_blank');
},

    
        formatNumero(valor) {
    if (valor == null || isNaN(valor)) return 'S/ 0';
    const roundedValue = Math.round(valor);
    return `S/ ${Number(roundedValue).toLocaleString('es-PE')}`;
    },
        async goBack() {
        this.$router.go(-1);
        },
        downloadFilteredPdf() {
    const doc = new jsPDF("p", "mm", "a4");

    doc.setFont("helvetica");
    doc.setFontSize(20);
    doc.text("Estimación de Costos por Proyecto y PAM", doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

    let proyectosCostos = {}; 
    const estimacionesOrdenadas = [...this.paginatedEstimaciones].sort((a, b) => a.codPam - b.codPam);

    estimacionesOrdenadas.forEach((estimacion) => {
        if (!proyectosCostos[estimacion.proyecto.name]) {
            proyectosCostos[estimacion.proyecto.name] = 0;
        }
        proyectosCostos[estimacion.proyecto.name] += Number(estimacion.costoEstimado?.totalEstimado) || 0;
    });

    doc.setFontSize(12);
    doc.setFont("helvetica");
    doc.text("Costo Total por Proyecto", 15, 30);
    doc.setLineWidth(0.2);
    doc.line(15, 32, 80, 32);  // Subrayado
    let startY = 40;
    for (const [proyecto, costo] of Object.entries(proyectosCostos)) {
        doc.setFontSize(10);
        doc.text(`- ${proyecto}: ${this.formatNumero(costo)}`, 15, startY);
        startY += 6; // Modified margin-bottom
    }

    doc.setLineWidth(0.5);
    doc.line(15, startY, doc.internal.pageSize.getWidth() - 15, startY);
    startY += 10;

    const spaceBetweenTables = 3; 

    estimacionesOrdenadas.forEach((estimacion, index) => {
        if (index !== 0) {
            doc.addPage();
            startY = 20;
        }

        doc.setFontSize(10);
        doc.setFont("helvetica");
        doc.text(`Proyecto: ${estimacion.proyecto.name}`, 15, startY);
        doc.text(`Tipo de PAM: ${estimacion.tipoPam.name}`, 15, startY + 8);
        doc.text(`Código PAM: ${estimacion.codPam}`, 15, startY + 16);
        doc.setFont("helvetica", "normal");

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
            startY: startY + 22,
            head: [tableColumnsCaracteristicas],
            body: tableRowsCaracteristicas,
            theme: "grid",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [39, 174, 96] }, 
            alternateRowStyles: { fillColor: [240, 240, 240] },
            margin: { left: 20, right: 15 },
            columnStyles: { 
                0: { cellWidth: 80 },
                1: { cellWidth: 80, halign: "center" }
            }
        });

        const tableColumnsCostoCierre = ["Estimación de costo de cierre", "Valor"];
        const tableRowsCostoCierre = [
            ["Costo Directo", this.formatNumero(estimacion.costoEstimado?.costoDirecto)],
            ["Gastos Generales", this.formatNumero(estimacion.costoEstimado?.gastosGenerales)],
            ["Utilidad", this.formatNumero(estimacion.costoEstimado?.utilidades)],
            ["Subtotal", this.formatNumero(estimacion.costoEstimado?.subTotal)],
            ["Subtotal Obra", this.formatNumero(estimacion.costoEstimado?.subTotalObras)]
        ];

        doc.autoTable({
            startY: doc.lastAutoTable.finalY + spaceBetweenTables,
            head: [tableColumnsCostoCierre],
            body: tableRowsCostoCierre,
            theme: "grid",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [39, 174, 96] },  
            alternateRowStyles: { fillColor: [240, 240, 240] },
            margin: { left: 20, right: 15 },
            columnStyles: { 
                0: { cellWidth: 80 },
                1: { cellWidth: 80, halign: "center" }
            }
        });

        const tableColumnsOtros = ["Otros", "Valor"];
        const tableRowsOtros = [
            ["IGV 18%", this.formatNumero(estimacion.costoEstimado?.igv)],
            ["Expediente Técnico 6%", this.formatNumero(estimacion.costoEstimado?.expedienteTecnico)],
            ["Supervisión 15%", this.formatNumero(estimacion.costoEstimado?.supervision)],
            ["Gestión de Proyectos 5%", this.formatNumero(estimacion.costoEstimado?.gestionProyecto)],
            ["Capacitación 1%", this.formatNumero(estimacion.costoEstimado?.capacitacion)],
            ["Contingencias 6%", this.formatNumero(estimacion.costoEstimado?.contingencias)]
        ];

        doc.autoTable({
            startY: doc.lastAutoTable.finalY + spaceBetweenTables,
            head: [tableColumnsOtros],
            body: tableRowsOtros,
            theme: "grid",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [39, 174, 96] },  
            alternateRowStyles: { fillColor: [240, 240, 240] },
            margin: { left: 20, right: 15 },
            columnStyles: { 
                0: { cellWidth: 80 },
                1: { cellWidth: 80, halign: "center" }
            }
        });

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(
            `Total Estimado: ${this.formatNumero(estimacion.costoEstimado?.totalEstimado)}`,
            doc.internal.pageSize.getWidth() - 30,
            doc.lastAutoTable.finalY + 15,
            { align: 'right' }
            
        );

       



    });
    const pageCount = doc.internal.getNumberOfPages();
for (let i = 1; i <= pageCount; i++) {  
    doc.setPage(i);

    // Espacio mínimo garantizado antes del pie de página
    let footerY = doc.internal.pageSize.getHeight() - 15; // Ajustar margen inferior
    
   

    // Texto de referencia alineado al centro
    doc.setFontSize(8);
    doc.text(
        "La información resultante solo debe ser utilizada para fines de cálculo referencial (+/-50% de precisión)",
        doc.internal.pageSize.getWidth() / 2,
        footerY,
        { align: 'center' }
    );

    // Numeración alineada a la derecha
    doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.getWidth() - 40,  // Más separado del borde derecho
        footerY + 5 // Ajustado para no tocar la línea
    );
}
    const pdfUrl = doc.output('bloburl');
    window.open(pdfUrl, '_blank');
},


downloadResumenEjecutivo() {
    const doc = new jsPDF("p", "mm", "a4");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Estimación de Costos por Proyecto y PAM", doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

    let proyectosAgrupados = {};

    // Agrupar estimaciones por proyecto
    this.paginatedEstimaciones.forEach((estimacion) => {
        if (!proyectosAgrupados[estimacion.proyecto.name]) {
            proyectosAgrupados[estimacion.proyecto.name] = {
                estimaciones: [],
                costoTotal: 0
            };
        }
        proyectosAgrupados[estimacion.proyecto.name].estimaciones.push(estimacion);
        proyectosAgrupados[estimacion.proyecto.name].costoTotal += Number(estimacion.costoEstimado?.totalEstimado) || 0;
    });

    let startY = 30;

    // Iterar sobre los proyectos agrupados
    for (const [proyecto, datos] of Object.entries(proyectosAgrupados)) {
        if (startY > 260) {  // Si estamos muy abajo en la página, crear una nueva
            doc.addPage();
            startY = 20;
        }

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`Proyecto: ${proyecto}`, 15, startY);
        startY += 8;

        // Definir columnas de la tabla
        const tableColumns = ["ID PAM", "Tipo PAM", "Volumen (m³)", "Área (m²)", "Total Estimado"];
        const tableRows = [];

        datos.estimaciones.forEach((estimacion) => {
            tableRows.push([
                estimacion.codPam,
                estimacion.tipoPam.name,
                estimacion.valores?.find(v => v.atributoPamId === 1)?.valor || "N/A",
                estimacion.valores?.find(v => v.atributoPamId === 2)?.valor || "N/A",
                this.formatNumero(estimacion.costoEstimado?.totalEstimado)
            ]);
        });

        // Insertar la tabla en el PDF
        doc.autoTable({
            startY: startY,
            head: [tableColumns],
            body: tableRows,
            theme: "grid",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [39, 174, 96] },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            margin: { left: 15, right: 15 }
        });

        // Agregar el costo total del proyecto al final de la tabla
        startY = doc.lastAutoTable.finalY + 9;
       
        startY += 5;
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`Costo Total del Proyecto: ${this.formatNumero(datos.costoTotal)}`, 15, startY);
        doc.setLineWidth(0.5);
                startY += 5;

        doc.line(15, startY, doc.internal.pageSize.getWidth() - 15, startY); // Línea separadora
        startY += 10;
    }

    // Agregar número de página
    doc.setFontSize(8);
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(
            "La información resultante solo debe ser utilizada para fines de cálculo referencial (+/-50% de precisión)",
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 20,
            { align: 'center' }
        );
        doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10);
    }

       

    // Mostrar el PDF generado
    const pdfUrl = doc.output('bloburl');
    window.open(pdfUrl, '_blank');
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
            this.error = "Error al cargar proyectos y tipos de PAM.";
            this.clearErrorAfterTimeout();
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

            console.log("Datos obtenidos:", response); 

            for (let estimacion of response) {
            try {
                const usuario = await userService.getAuthUser(estimacion.usuarioId);
                estimacion.usuario = usuario; 
            } catch (error) {
                console.error(`Error obteniendo el usuario para ID ${estimacion.usuarioId}:`, error);
                estimacion.usuario = { email: "Desconocido", area: "No definido" }; 
            }
            }

            this.estimaciones = response;
        } catch (error) {
            console.error("Error al buscar estimaciones:", error);
            this.error = "Error al buscar estimaciones.";
            this.clearErrorAfterTimeout();
        }
        },
        clearErrorAfterTimeout() {
            setTimeout(() => {
                this.error = null;
            }, 4000); // 4 segundos
        },
        convertirBooleano(valor) {
        if (valor === true || valor === "true") return "Sí";
        if (valor === false || valor === "false") return "No";
        return valor; 
        },
        obtenerAtributo(valores, atributoId) {
        const atributo = valores.find(v => v.atributoPamId === atributoId);
        if (!atributo) return "N/A";

        if (atributo.valor === true || atributo.valor === false || atributo.valor === "true" || atributo.valor === "false") {
            return this.convertirBooleano(atributo.valor);
        }

        return atributo.valor; 
        },
        verDetalle(estimacion) {
        this.detalleCosto = estimacion.costoEstimado;
        this.detalleVisible = true;
        this.detalleEstimacion = estimacion;

        },
        toggleDetalle() {
        this.detalleVisible = !this.detalleVisible;
        },
        
        editarEstimacion(id) {
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
                this.error = `Error al eliminar la estimación con ID: ${id}`;
                this.clearErrorAfterTimeout();
            });
        }
        },
        descargarPDF(id) {
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
        }
    },
    }
    
    </script>

    <style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
    @import "vue-multiselect/dist/vue-multiselect.min.css";

.search-box {
  display: flex;
  gap: 10px;
}

.search-field {
  flex: 1;
  display: flex;
  flex-direction: column;
}
    .top-buttons {
        display: flex;
        justify-content: space-between; 
        width: 100%;
        padding-bottom: 10px; 
    }
    .download-buttons {
    display: flex;
    justify-content: flex-end; 
    gap: 10px; 
    margin-top: 10px; 
}


.fondo {
  background: url("@/assets/Pag 37 Proyecto Calioc y Chacrapuquio en Junín.jpg") no-repeat center center fixed;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
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

/* Estilo del placeholder (texto dentro del input) */
::v-deep .multiselect__placeholder {
    font-size: 1    4px;
    color: #666;
}

/* Estilo de los elementos seleccionados */
/* Cambiar el tamaño del texto en las opciones de la lista desplegable */
::v-deep .multiselect__option {
    font-size: 13px !important; /* Ajusta el tamaño según tu preferencia */
}

/* Cambiar el tamaño del texto en la opción seleccionada (con fondo verde) */
::v-deep .multiselect__option--highlight {
    font-size: 13px !important; /* Ajusta el tamaño según tu preferencia */
}

/* Cambiar el tamaño del texto de la sugerencia al costado ("Press enter to select") */
::v-deep .multiselect__option span {
    font-size: 13px !important; /* Ajusta el tamaño según tu preferencia */
}

/* Oculta solo el texto de sugerencia "Press enter to select" */
::v-deep .multiselect__option::after {
    content: "" !important; /* Elimina el texto adicional */
    display: none !important; /* Oculta el pseudo-elemento */
}




.btn-download-pdf {
    background-color: rgb(24, 137, 41);
    color: white;
}

.btn-download-pdf i,
.btn-download-resumen i {
    margin-right: 5px;
}

.btn-download-resumen {
    background-color: rgb(17, 82, 42);
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
        z-index: 0; 
    }
    .costo-estimado-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);  
  gap: 16px;
  padding: 16px;
}


.costo-item {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 8px;
  color: #333;
}


.total-estimado-container {
  margin-top: 20px;
  padding: 16px;
  background-color: #f5f5f5; 
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}


.total-estimado {
  font-weight: bold;
  font-size: 16px;
  color: #006400; 
}

.costo-item strong {
  font-weight: bold;
  color: #555;
}

.costo-item {
  border-bottom: 1px solid #ccc;
  padding-bottom: 8px;
}

@media (max-width: 600px) {
  .costo-estimado-grid {
    grid-template-columns: 1fr; 
  }
}
   

    .btn-back {

    background: none;
    border: none;
    cursor: pointer;
    color: #093a19;
    font-size: 1.7rem;
    transition: transform 0.3s;
    }


    .btn-action {
        padding: 5px;
        margin: 0 2px;
        color: white;
        background-color: #548f4e;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: transform 0.3s;
    }
    .btn-actiondetalle {
        padding: 5px;
        margin: 0 2px;
        color: white;
        background-color: #62a1ff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: transform 0.3s;
    }
    .btn-actiondelete {
        padding: 5px;
        margin: 0 2px;
        color: white;
        background-color: #f87c5d;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: transform 0.3s;
    }
    .btn-actiondescargar {
        padding: 5px;
        margin: 0 2px;
        color: white;
        background-color: #548f4e;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: transform 0.3s;
    }

    .btn-action:hover {
        transform: scale(1.1);
    }
 

    .init-box {
        background: rgba(255, 255, 255, 0.9);
        padding: 50px;
        border-radius: 15px;
        box-shadow: 0 0 25px 12px rgb(0 0 0 / 30%);
        z-index: 1; 
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
        overflow-y: auto; 
        max-height: 400px; 
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
        text-align: right !important;

        
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

    .fade-enter, .fade-leave-to {
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
        color: #1f4401; 
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
    .encabezados-ultimas th {
    text-align: center;
}
.acciones {
    display: flex;
    justify-content: center; 
    align-items: center; 
    gap: 5px; 
}

    </style>

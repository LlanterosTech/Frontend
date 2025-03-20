<template>
    <div class="container fondo">
      <div class="init-box">
        <button @click="goBack" class="btn-back">
        <i class="fas fa-arrow-left"></i> 
      </button>
        <div class="init">
          <h1 class="title">Historial de Estimaciones</h1>
          <p class="subtitle">Administra tus estimaciones de manera eficiente.</p>
  
          
          <div class="table-container">
            <h2 class="table-title">
              Últimas Estimaciones
              <button @click="cambiarOrden" class="btn-orden" :key="ordenAscendente">
                <i :class="iconOrden"></i>
              </button>
                        
            </h2>
            
            <table class="table">
              <thead>
                <tr class="encabezados-ultimas">
                  <th>Proyecto</th>
                  <th>Tipo de PAM</th>
                  <th>ID de PAM</th>
                  <th>Fecha</th>
                  <th>Usuario</th>
                  <th>Departamento</th>
                  <th>Total Estimado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="estimacion in ultimasEstimaciones" :key="estimacion.estimacionId">
                  <td>{{ estimacion.proyecto.name }}</td>
                  <td>{{ estimacion.tipoPam.name }}</td>
                  <td>{{ estimacion.codPam }}</td>
                  <td>{{ formatFecha(estimacion.fechaPam) }}</td>
  
                  <td>{{ estimacion.usuario.email }}</td>
                  <td>{{ estimacion.usuario.registerArea }}</td>
                  <td class="text-right">
                    <p class="estimado-ultimas">{{ formatNumero(estimacion.costoEstimado.totalEstimado) }}</p>
                  </td>
                  <td>
                    <button @click="verDetalle(estimacion)" class="btn-action">
                      <i class="fas fa-eye"></i>
                    </button>
                    
                    <button @click="eliminarEstimacion(estimacion.estimacionId)" class="btn-action">
                      <i class="fas fa-trash"></i>
                    </button>
                    <button @click="descargarPDF(estimacion)" class="btn-action btn-pdf">
                    <i class="fas fa-file-pdf"></i>
                  </button>
                    
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="detalleVisible" class="detalle-overlay" :class="{ 'show': detalleVisible }">
            <div class="detalle-box">
              <button @click="toggleDetalle" class="btn-secondary btn-close">
                X
              </button>
              <h2 class="text-lg-font-semibold-mb-4">Costo Estimado del PAM: {{ detalleEstimacion.tipoPam.name }} - {{ detalleEstimacion.codPam }}
              </h2>
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
      </div>
    </div>
  </template>
  
  <script>
  import bdService from "@/main/services/bdservice";
  import userService from "@/main/services/userservice";
  import jsPDF from "jspdf";
  import "jspdf-autotable";
  
  export default {
    data() {
      return {
        ultimasEstimaciones: [],
        ordenAscendente: false,
        detalleVisible: false,
        detalleCosto: {},
        detalleEstimacion: {}
      };
    },
    computed: {
      iconOrden() {
        return this.ordenAscendente ? 'fas fa-caret-up' : 'fas fa-caret-down';
      }
    },
    methods: {
        
        async goBack() {
      this.$router.go(-1);
    },
  
    descargarPDF(estimacion) {
    const doc = new jsPDF("p", "mm", "a4");

    // **Cargar el logo de AMSAC con proporciones correctas**
    const logo = new Image();
    logo.src = require("@/assets/cropped-logo-amsac.png"); 

    logo.onload = () => {
        // **Agregar el logo a la izquierda**
        const logoWidth = 25;
        const logoHeight = 18;
        const logoX = 15; 
        const logoY = 10; 

        doc.addImage(logo, "PNG", logoX, logoY, logoWidth, logoHeight);

        // **Ajustar título (centrado y alineado con el logo)**
        const titleX = doc.internal.pageSize.getWidth() / 2;
        const titleY = 20;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(18);
        doc.text("Detalle de Estimación", titleX, titleY, { align: 'center' });

        // **Encabezado con Proyecto, Tipo de PAM e ID**
        doc.setFontSize(12);
        doc.setFont("helvetica");
        const headerY = 40;
        doc.text(`Proyecto: ${estimacion.proyecto.name}`, 15, headerY);
        doc.text(`Tipo de PAM: ${estimacion.tipoPam.name}`, 15, headerY + 8);
        doc.text(`ID de PAM: ${estimacion.codPam}`, 15, headerY + 16);

        let startY = headerY + 20;

        // **Tabla 1: Información del usuario**
        const tableColumnsUsuario = ["Descripción", "Valor"];
        const tableRowsUsuario = [
            ["Usuario", estimacion.usuario.email || "Desconocido"],
            ["Departamento", estimacion.usuario.registerArea || "No definido"],
            ["Fecha", this.formatFecha(estimacion.fechaPam) || "N/A"]
        ];

        doc.autoTable({
            startY,
            head: [tableColumnsUsuario],
            body: tableRowsUsuario,
            theme: "grid",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [39, 174, 96] },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            margin: { left: 15, right: 15 }
        });

        startY = doc.lastAutoTable.finalY + 10;

        // **Tabla 2: Características**
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
            startY,
            head: [tableColumnsCaracteristicas],
            body: tableRowsCaracteristicas,
            theme: "grid",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [46, 204, 113] },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            margin: { left: 15, right: 15 }
        });

        startY = doc.lastAutoTable.finalY + 10;

        // **Tabla 3: Desglose del Total Estimado**
        const tableColumnsCostoCierre = ["Estimación de costo de cierre", "Valor"];
        const tableRowsCostoCierre = [
            ["Costo Directo", this.formatNumero(estimacion.costoEstimado?.costoDirecto)],
            ["Gastos Generales", this.formatNumero(estimacion.costoEstimado?.gastosGenerales)],
            ["Utilidad", this.formatNumero(estimacion.costoEstimado?.utilidades)],
            ["Subtotal", this.formatNumero(estimacion.costoEstimado?.subTotal)],
            ["Subtotal Obra", this.formatNumero(estimacion.costoEstimado?.subTotalObras)]
        ];

        doc.autoTable({
            startY,
            head: [tableColumnsCostoCierre],
            body: tableRowsCostoCierre,
            theme: "grid",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [39, 174, 96] },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            margin: { left: 15, right: 15 }
        });

        startY = doc.lastAutoTable.finalY + 10;

        // **Tabla 4: Otros costos adicionales**
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
            startY,
            head: [tableColumnsOtros],
            body: tableRowsOtros,
            theme: "grid",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [30, 132, 73] },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            margin: { left: 15, right: 15 }
        });

        startY = doc.lastAutoTable.finalY + 15;

        // **Total Estimado final (alineado a la derecha)**
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(
            `Total Estimado: ${this.formatNumero(estimacion.costoEstimado?.totalEstimado)}`,
            doc.internal.pageSize.getWidth() - 20,
            startY,
            { align: 'right' }
        );

        // **Nota de precisión bien alineada**
        const precisionNoteY = startY + 10;
        doc.setFontSize(8);
        doc.text(
            "La información resultante solo debe ser utilizada para fines de cálculo referencial (+/-50% de precisión)",
            doc.internal.pageSize.getWidth() / 2,
            precisionNoteY,
            { align: 'center' }
        );

        // **Número de páginas**
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(
                `Página ${i} de ${pageCount}`,
                doc.internal.pageSize.getWidth() - 20,
                doc.internal.pageSize.getHeight() - 10
            );
        }

        // **Generar y mostrar el PDF**
        const pdfUrl = doc.output('bloburl');
        window.open(pdfUrl, '_blank');
    };
},

      async cargarEstimaciones() {
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
          this.ultimasEstimaciones = estimaciones.slice(-5);
        } catch (error) {
          console.error("Error al cargar las estimaciones:", error);
        }
      },
  
  
      cambiarOrden() {
        this.ordenAscendente = !this.ordenAscendente; 
        this.ultimasEstimaciones.reverse(); 
        this.$forceUpdate();
      },
      convertirBooleano(valor) {
        if (valor === true || valor === "true") return "Sí";
        if (valor === false || valor === "false") return "No";
        return valor; 
        },
      formatNumero(valor) {
        if (valor == null || isNaN(valor)) return 'S/ 0';
        const roundedValue = Math.round(valor);
        return `S/ ${Number(roundedValue).toLocaleString('es-PE')}`;
      },
      crearEstimacion() {
        this.$router.push("/nuevaestimacion");
      },
      buscarEstimaciones() {
        this.$router.push("/buscar-estimacion");
      },
      formatFecha(fecha) {
        const date = new Date(fecha);
        const dia = date.getDate().toString().padStart(2, '0');
        const mes = (date.getMonth() + 1).toString().padStart(2, '0');
        const anio = date.getFullYear();
        return `${dia}/${mes}/${anio}`;
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
          this.ultimasEstimaciones = this.ultimasEstimaciones.filter(estimacion => estimacion.estimacionId !== id);
          console.log(`Estimación con ID: ${id} eliminada exitosamente.`);
          })
          .catch(error => {
          console.error(`Error al eliminar la estimación con ID: ${id}`, error);
          });
        }
      },
      
    },
    mounted() {
      this.cargarEstimaciones();
    }
    
  };
  </script>
  
  <style scoped>
  
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
  
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
  
  .container {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  
  
  .fondo {
    background: url("@/assets/Pag 37 Proyecto Calioc y Chacrapuquio en Junín.jpg") no-repeat center center fixed;
    background-size: 100%; /* Reduce el tamaño al 80% del contenedor */
    background-position: bottom center; /* Ajusta la posición para que no se pierda la alineación */
    background-attachment: fixed;
  }
  
  .btn-back {
  background: none;
  border: none;
  cursor: pointer;
  color: #13863a;
  font-size: 1.5rem;
  transition: transform 0.3s;
  position: absolute;

}



.btn-back:hover {
  transform: scale(1.1);
}
  
  .init-box {
    background: rgba(255, 255, 255, 0.9);
    padding: 50px;
    border-radius: 15px;
    box-shadow: 0 0 25px 12px rgb(0 0 0 / 30%);
    z-index: 1; 
    width: 80%;
    max-width: 1500px;
  }
  
  .init {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .init h1.title {
    margin: 20px 0;
    font-size: 3.075rem;
  }
  
  .init p.subtitle {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 20px;
  }
  
  .buttons {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .btn-primary {
    padding: 14px 40px;
    color: white;
    font-size: 1.4rem;
    background: #74c905;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    transition: transform 0.3s;
  }
  
  .btn-primary:hover {
    transform: scale(1.1);
  }
  
  .btn-secondary {
    padding: 14px 40px;
    color: white;
    font-size: 1.4rem;
    background: #74c905;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    transition: transform 0.3s;
  }
  
  .btn-secondary:hover {
    transform: scale(1.1);
  }
  
  .btn-orden {
    padding: 0;
    color: #4fd87d; 
    font-size: 1.4rem;
    border: none;
    background: none; 
    cursor: pointer;
    transition: transform 0.3s;
  }
  
  .btn-orden:hover {
    transform: scale(1.1);
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
  .btn-action:hover {
    transform: scale(1.1);
  }
  
  .table-container {
    width: 100%;
    margin-top: 20px;
  }
  
  .table-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.7375rem;
    margin-bottom: 10px;
  }
  
  .table {
    width: 100%;
    border-collapse: collapse;
    text-align: center;
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
  .estimado-ultimas {
      text-align: right;
  }
  .encabezados-ultimas {
    text-align: center;
  
  }
  </style>
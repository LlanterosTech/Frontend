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
          <tr v-for="estimacion in estimaciones" :key="estimacion.id">
            <td>{{ estimacion.proyecto }}</td>
            <td>{{ estimacion.tipoPam }}</td>
            <td>{{ estimacion.idPam }}</td>
            <td>{{ estimacion.volumen }}</td>
            <td>{{ estimacion.area }}</td>
            <td>{{ estimacion.generacionDar }}</td>
            <td>{{ estimacion.cobertura }}</td>
            <td>{{ estimacion.tipoCierre }}</td>
            <td>{{ estimacion.tipoCobertura }}</td>
            <td>{{ estimacion.distancia }}</td>
            <td class="highlight">{{ estimacion.valorTotal }}</td>
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
        estimaciones: []
      };
    },
    methods: {
      async buscarEstimacion() {
        try {
          if (this.proyecto && this.tipoPam) {
            this.estimaciones = await bdService.getEstimacionesByProyectoAndTipoPam(this.proyecto, this.tipoPam);
          } else if (this.tipoPam) {
            this.estimaciones = await bdService.getEstimacionesByTipoPamId(this.tipoPam);
          } else if (this.proyecto) {
            this.estimaciones = await bdService.getEstimacionesByProyectoId(this.proyecto);
          } else {
            alert("Ingrese al menos un criterio de búsqueda.");
          }
        } catch (error) {
          console.error("Error al buscar estimaciones:", error);
          alert("Error al buscar estimaciones.");
        }
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
  
<template>
  <div class="settings-view">
    <h1>⚙️ Configuración</h1>

    <form @submit.prevent="saveSettings">
      <div class="form-group">
        <label for="username">Nombre de usuario</label>
        <input id="username" v-model="settings.username" type="text" placeholder="Tu nombre" />
      </div>

      <div class="form-group">
        <label for="email">Correo electrónico</label>
        <input id="email" v-model="settings.email" type="email" placeholder="correo@ejemplo.com" />
      </div>

      <div class="form-group">
        <label for="language">Idioma</label>
        <select id="language" v-model="settings.language">
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </div>

      <div class="form-group toggle">
        <label>Notificaciones</label>
        <input type="checkbox" v-model="settings.notifications" />
        <span>{{ settings.notifications ? 'Activadas' : 'Desactivadas' }}</span>
      </div>

      <button type="submit" class="btn-save">Guardar Cambios</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "SettingsView",
  data() {
    return {
      settings: {
        username: "",
        email: "",
        language: "es",
        notifications: true,
      },
    };
  },
  methods: {
    saveSettings() {
      console.log("Configuración guardada:", this.settings);
      alert("✅ Configuración guardada correctamente.");
    },
  },
};
</script>

<style scoped>
.settings-view {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: #f5fdf5;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  font-family: 'Arial', sans-serif;
}

.settings-view h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2f5d34;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select {
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.form-group.toggle {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.btn-save {
  background: #4caf50;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: background 0.3s;
}

.btn-save:hover {
  background: #3e8e41;
}
</style>
>
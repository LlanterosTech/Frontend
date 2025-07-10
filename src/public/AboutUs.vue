<template>
  <div class="background-layer"></div>
  <div class="my-plants-view content-layer">
  <div class="about-us">
    <section class="hero">
      <h1>Acerca de Nosotros</h1>
      <p>Conectamos personas con sus plantas a través de tecnología e información personalizada.</p>
    </section>

    <section class="mission-section">
      <div class="mission-text">
        <h2>Nuestra Misión</h2>
        <p>
          Ayudamos a los principiantes en el mundo de las plantas a identificarlas y cuidarlas de manera
          fácil, intuitiva y divertida. Nuestro objetivo es fomentar un estilo de vida más verde y consciente,
          abordando al mismo tiempo los desafíos del monitoreo y la optimización del crecimiento de sus plantas,
          y asegurando que estén libres de plagas y enfermedades.
        </p>
      </div>
      <img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6" alt="Plantas felices" class="mission-img" />
    </section>

    <section class="values-section">
      <h2>🌱 Nuestros Valores</h2>
      <ul>
        <li><strong>Sostenibilidad:</strong> Cuidamos el planeta desde casa.</li>
        <li><strong>Innovación:</strong> Tecnología al servicio de la naturaleza.</li>
        <li><strong>Educación:</strong> Compartimos conocimiento accesible para todos.</li>
        <li><strong>Comunidad:</strong> Crecemos juntos, como un jardín.</li>
      </ul>
    </section>
  </div>
  </div>
</template>

<script>
export default {
  name: "AboutUs",
};
</script>

<style scoped>
.about-us {
  font-family: 'Arial', sans-serif;
  background: white;
  padding: 2rem;
  color: #2f4f2f;
}

.hero {
  text-align: center;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 2.5rem;
  color: #388e3c;
}

.hero p {
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
}

.mission-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 3rem;
}

.mission-text {
  flex: 1;
  padding-right: 1rem;
}

.mission-img {
  flex: 1;
  max-width: 350px;
  max-height: 220px;
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  object-fit: cover;
}

.values-section {
  background: #e0f2e9;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 3rem;
}

.values-section h2 {
  margin-bottom: 1rem;
}

.values-section ul {
  list-style: none;
  padding-left: 0;
}

.values-section li {
  margin-bottom: 0.8rem;
  font-size: 1.1rem;
}

.team-section {
  text-align: center;
}

.team-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

.team-card {
  background: white;
  padding: 1rem;
  border-radius: 10px;
  width: 200px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.team-card img {
  width: 100%;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.background-layer {
  background-color: #e6f3e6;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 50px;
  height: 100vh;
  width: 100vw;
  z-index: 0;
}

.content-layer {
  position: relative;
  z-index: 1;
}
</style>

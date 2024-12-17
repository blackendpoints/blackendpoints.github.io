<template>
  <section class="intro-section">
    <div class="intro-content">
      <h2>Why Choose Us?</h2>
      <p>At BlackEndpoints, we’re committed to fostering connections and empowering communities. Our platform simplifies the process of discovering and supporting Black-owned businesses, providing a seamless experience that drives meaningful engagement and growth.</p>
    </div>
  </section>
</template>

<style scoped>
.intro-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  padding: 2rem;
}

.intro-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: black;
}

p {
  font-size: 1.2rem;
  line-height: 1.8;
  color: #333;
}

@media (max-width: 768px) {
  .intro-section {
    padding: 1rem;
  }

  h2 {
    font-size: 2rem;
  }

  p {
    font-size: 1rem;
  }
}
</style>
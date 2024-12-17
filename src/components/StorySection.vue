<template>
  <section class="story-section">
    <div class="story-content">
      <h2>The Journey</h2>
      <p>BlackEndpoints began with a vision to transform how communities connect with Black-owned businesses. Our journey started with the recognition of a critical need: a centralized platform to empower individuals and foster economic growth within Black communities. We are building a foundation to become a go-to resource, striving to bridge gaps and create meaningful connections that inspire growth and opportunity.</p>
    </div>
  </section>
</template>

<style scoped>
.story-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  padding: 2rem;
}

.story-content {
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
  .story-section {
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
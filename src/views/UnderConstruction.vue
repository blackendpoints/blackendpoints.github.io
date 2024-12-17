<template>
  <section class="under-construction">
    <div class="content">
      <h1>Under Construction</h1>
      <p>Our app is currently being developed. We're working hard to bring you an amazing experience.</p>
      <p class="coming-soon">Coming Soon</p>
    </div>
  </section>
</template>

<style scoped>
.under-construction {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
  color: white;
  padding: 2rem;
}

.content {
  text-align: center;
  max-width: 800px;
}

h1 {
  font-size: 4rem;
  margin-bottom: 2rem;
}

p {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #cccccc;
}

.coming-soon {
  font-size: 2rem;
  margin-top: 3rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;
  }

  p {
    font-size: 1.2rem;
  }

  .coming-soon {
    font-size: 1.5rem;
    margin-top: 2rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  h1 {
    font-size: 3rem;
  }
}
</style>
<template>
  <header class="about-hero">
    <div class="hero-content">
      <h1>Our Story</h1>
      <p class="subtitle">From a Vision of Connection to a Platform Empowering Black-Owned Business Networks</p>
      <div class="scroll-indicator" @click="scrollToNext">
        <span class="arrow"></span>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  methods: {
    scrollToNext() {
      const nextSection = document.querySelector('.story-section')
      nextSection?.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
</script>

<style scoped>
.about-hero {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
  color: white;
  position: relative;
}

.hero-content {
  text-align: center;
  padding: 2rem;
}

h1 {
  font-size: 4.5rem;
  margin-bottom: 1.5rem;
  letter-spacing: -1px;
}

.subtitle {
  font-size: 1.8rem;
  color: #cccccc;
  max-width: 600px;
  margin: 0 auto;
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  animation: bounce 2s infinite;
}

.arrow {
  display: block;
  width: 20px;
  height: 20px;
  border-right: 3px solid white;
  border-bottom: 3px solid white;
  transform: rotate(45deg);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) rotate(45deg);
  }
  40% {
    transform: translateY(-10px) rotate(45deg);
  }
  60% {
    transform: translateY(-5px) rotate(45deg);
  }
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  h1 {
    font-size: 3.5rem;
  }

  .subtitle {
    font-size: 1.5rem;
  }
}
</style>
<template>
  <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled }">
    <BrandLogo />
    <div class="nav-links">
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/about" class="nav-link">About Us</router-link>
      <router-link to="/app" class="nav-link">App</router-link>
    </div>
  </nav>
</template>

<script>
import BrandLogo from './BrandLogo.vue';

export default {
  components: {
    BrandLogo
  },
  data() {
    return {
      isScrolled: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  unmounted() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 50
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: transparent;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.navbar-scrolled {
  background-color: black;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  transition: opacity 0.3s;
}

.nav-link:hover {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    text-align: center;
    background-color: black;
  }

  .nav-links {
    gap: 1rem;
    flex-direction: column;
    width: 100%;
  }

  .nav-link {
    display: block;
    padding: 0.5rem;
  }
}
</style>
<template>
  <div class="directory">
    <h1>Redirecting to Application...</h1>
  </div>
</template>

<script>
export default {
  mounted() {
    window.location.href = 'https://www.google.com'
  }
}
</script>

<style scoped>
.directory {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: #666;
  padding: 1rem;
  text-align: center;
}

@media (max-width: 768px) {
  .directory {
    font-size: 1.2rem;
  }
}
</style>
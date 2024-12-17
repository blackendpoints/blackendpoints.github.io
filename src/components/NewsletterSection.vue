<template>
  <section class="newsletter-section">
    <div class="newsletter-content">
      <h2>Stay Updated</h2>
      <p>Subscribe to our newsletter for the latest updates and features.</p>
      <NewsletterForm />
    </div>
  </section>
</template>

<script>
import NewsletterForm from './NewsletterForm.vue'

export default {
  components: {
    NewsletterForm
  }
}
</script>

<style scoped>
.newsletter-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
  color: white;
  padding: 2rem;
}

.newsletter-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #cccccc;
}

@media (max-width: 768px) {
  .newsletter-section {
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
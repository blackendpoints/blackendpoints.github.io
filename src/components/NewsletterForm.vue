<template>
  <form @submit.prevent="handleSubmit" class="newsletter-form">
    <input 
      type="email" 
      v-model="email" 
      placeholder="Enter your email"
      required
      class="email-input"
    >
    <button type="submit" class="subscribe-button">Subscribe</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      email: ''
    }
  },
  methods: {
    handleSubmit() {
      alert('Thank you for subscribing!')
      this.email = ''
    }
  }
}
</script>

<style scoped>
.newsletter-form {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  gap: 1rem;
}

.email-input {
  flex: 1;
  padding: 1rem;
  border: 2px solid white;
  border-radius: 4px;
  font-size: 1rem;
  background: transparent;
  color: white;
}

.email-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.email-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.8);
}

.subscribe-button {
  padding: 1rem 2rem;
  background-color: transparent;
  color: white;
  border: 2px solid white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.subscribe-button:hover {
  background-color: white;
  color: black;
}

@media (max-width: 768px) {
  .newsletter-form {
    flex-direction: column;
    padding: 0 1rem;
  }

  .email-input,
  .subscribe-button {
    width: 100%;
  }
}
</style>
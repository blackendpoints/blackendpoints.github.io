<template>
  <div class="home">
    <HeroSection />
    <IntroSection />
    <NewsletterSection />
  </div>
</template>

<script>
import HeroSection from '../components/HeroSection.vue'
import IntroSection from '../components/IntroSection.vue'
import NewsletterSection from '../components/NewsletterSection.vue'

export default {
  components: {
    HeroSection,
    IntroSection,
    NewsletterSection
  }
}
</script>

<style scoped>
.home {
  scroll-behavior: smooth;
  overflow-x: hidden;
}
</style>
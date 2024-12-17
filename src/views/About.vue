<template>
  <div class="about">
    <AboutHero />
    <StorySection />
    <TeamSection />
  </div>
</template>

<script>
import AboutHero from '../components/AboutHero.vue'
import StorySection from '../components/StorySection.vue'
import TeamSection from '../components/TeamSection.vue'

export default {
  components: {
    AboutHero,
    StorySection,
    TeamSection
  }
}
</script>

<style scoped>
.about {
  scroll-behavior: smooth;
  overflow-x: hidden;
}
</style>
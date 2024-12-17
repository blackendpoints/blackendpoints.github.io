<template>
  <div class="team-grid">
    <TeamMember
      v-for="member in members"
      :key="member.name"
      v-bind="member"
    />
  </div>
</template>

<script>
import TeamMember from './TeamMember.vue'

export default {
  components: {
    TeamMember
  },
  props: {
    members: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
  justify-items: center;
  padding: 1rem;
}

@media (max-width: 768px) {
  .team-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (min-width: 769px) and (max-width: 1200px) {
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1201px) {
  .team-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}</style>
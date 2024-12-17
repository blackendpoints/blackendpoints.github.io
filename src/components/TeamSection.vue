<template>
  <section class="section section-dark">
    <div class="section-content">
      <h2 class="section-title">Meet Our Team</h2>
      <TeamGrid :members="teamMembers" />
    </div>
  </section>
</template>

<script>
import TeamGrid from './team/TeamGrid.vue'
import Jay from '../assets/img/Jay.png'
import Briana from '../assets/img/Briana.jpg'
import Alex from '../assets/img/Alex.jpg'
import Pat from '../assets/img/Pat.jpg'
import Esther from '../assets/img/Esther.jpg'

export default {
  components: {
    TeamGrid
  },
  data() {
    return {
      teamMembers: [
        {
          name: 'Jay',
          role: 'Founder & CEO',
          //description: 'Short Bio',
          image: Jay
        },
        {
          name: 'Briana',
          role: 'Founder & CTO',
          //description: 'Short Bio',
          image: Briana
        },
        {
          name: 'Alex',
          role: 'Founder & User Experience Lead',
          //description: 'Short Bio',
          image: Alex
        },
        {
          name: 'Patrick',
          role: 'Founder & Technical Lead',
          //description: 'Short Bio',
          image: Pat
        },
        {
          name: 'Esther',
          role: 'Founder & Creative Director',
          //description: 'Short Bio',
          image: Esther
        }
      ]
    }
  }
}
</script>
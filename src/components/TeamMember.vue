<template>
  <div class="team-member">
    <div class="member-image">
      <img :src="image" :alt="name">
    </div>
    <div class="member-info">
      <h3>{{ name }}</h3>
      <p class="role">{{ role }}</p>
      <p class="description">{{ description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.team-member {
  background-color: #111;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.team-member:hover {
  transform: translateY(-5px);
}

.member-image {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
}

.member-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.team-member:hover .member-image img {
  transform: scale(1.05);
}

.member-info {
  padding: 1.5rem;
  text-align: left;
}

h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: white;
}

.role {
  color: #cccccc;
  font-style: italic;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.description {
  color: #999;
  font-size: 0.95rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .member-info {
    padding: 1rem;
  }

  h3 {
    font-size: 1.25rem;
  }
}
</style>
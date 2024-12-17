<template>
  <router-link to="/" class="brand-link">
    <img src="/logo.png" alt="BlackEndpoints Logo" class="brand-logo" />
    <span class="brand-name">BlackEndpoints</span>
  </router-link>
</template>

<style scoped>
.brand-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--nav-text);
}

.brand-logo {
  width: 32px;
  height: 32px;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  .brand-link {
    justify-content: center;
  }
}
</style>
<script setup>
import { RouterLink } from 'vue-router'
import { ExternalLink } from '@lucide/vue'

defineProps({
  animateCard: {
    type: Function,
    required: true,
  },
  projects: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div class="project-grid">
    <RouterLink
      v-for="project in projects"
      :key="project.slug"
      :to="`/projects/${project.slug}`"
      class="project-card"
      @mouseenter="animateCard($event, true)"
      @mouseleave="animateCard($event, false)"
    >
      <div class="card-header-row">
        <h3 class="project-card-title">{{ project.title }}</h3>
        <ExternalLink class="mt-1 app-icon text-[#b4befe]" />
      </div>
      <p class="project-card-body">{{ project.body }}</p>
    </RouterLink>
  </div>
</template>

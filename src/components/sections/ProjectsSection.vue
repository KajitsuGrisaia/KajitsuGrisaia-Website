<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useWindowSize } from '@vueuse/core'
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

const { width } = useWindowSize()
const coinCount = computed(() => Math.max(9, Math.ceil(width.value / 40)))
</script>

<template>
  <div aria-hidden="true" class="project-coin-row project-coin-row-top">
    <img
      v-for="coinIndex in coinCount"
      :key="`top-${coinIndex}`"
      src="/assets/mario-coin-transparent.gif"
      alt=""
      class="project-coin"
    />
  </div>

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

  <div aria-hidden="true" class="project-coin-row project-coin-row-bottom">
    <img
      v-for="coinIndex in coinCount"
      :key="`bottom-${coinIndex}`"
      src="/assets/mario-coin-transparent.gif"
      alt=""
      class="project-coin"
    />
  </div>
</template>

<script setup>
defineProps({
  animateCard: {
    type: Function,
    required: true,
  },
  techStack: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div class="tech-stack-grid">
    <article
      v-for="group in techStack"
      :key="group.label"
      class="tech-card"
      @mouseenter="animateCard($event, true)"
      @mouseleave="animateCard($event, false)"
    >
      <h3 class="tech-card-title">{{ group.label }}</h3>
      <div class="tech-chip-list">
        <span v-for="item in group.items" :key="item" class="tech-chip">
          {{ item }}
        </span>
      </div>
    </article>
  </div>
</template>

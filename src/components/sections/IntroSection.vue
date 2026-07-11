<script setup>
import { ExternalLink, Mail } from '@lucide/vue'

defineProps({
  animateHeroButton: {
    type: Function,
    required: true,
  },
  navCopy: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['navigate'])
</script>

<template>
  <div class="hero-actions">
    <div class="hero-button-row">
      <button
        class="button-primary"
        @mouseenter="animateHeroButton($event, true)"
        @mouseleave="animateHeroButton($event, false)"
        @focus="animateHeroButton($event, true)"
        @blur="animateHeroButton($event, false)"
        @click="emit('navigate', 'projects', $event)"
      >
        {{ navCopy.projects }}
        <ExternalLink class="app-icon" />
      </button>
      <button
        class="button-secondary"
        @mouseenter="animateHeroButton($event, true)"
        @mouseleave="animateHeroButton($event, false)"
        @focus="animateHeroButton($event, true)"
        @blur="animateHeroButton($event, false)"
        @click="emit('navigate', 'contact', $event)"
      >
        {{ navCopy.contact }}
        <Mail class="app-icon" />
      </button>
    </div>

    <a
      href="https://github.com/KajitsuGrisaia"
      target="_blank"
      rel="noreferrer"
      class="profile-card profile-card-mobile group"
      aria-label="Open KajitsuGrisaia on GitHub"
    >
      <img
        src="/assets/profile-circle-source.png"
        alt="KajitsuGrisaia profile portrait"
        class="profile-image"
      />
    </a>
  </div>
</template>

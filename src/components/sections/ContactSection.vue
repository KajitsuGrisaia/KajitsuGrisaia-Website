<script setup>
import { ExternalLink, Mail } from '@lucide/vue'
import BrandIcon from '../BrandIcon.vue'

defineProps({
  animateCard: {
    type: Function,
    required: true,
  },
  contactLinks: {
    type: Array,
    required: true,
  },
  hireLink: {
    type: Object,
    required: true,
  },
  supportLink: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['open-email'])
</script>

<template>
  <div class="contact-grid">
    <a
      v-for="link in contactLinks"
      :key="link.label"
      :href="link.href"
      :target="link.type === 'email' ? undefined : '_blank'"
      :rel="link.type === 'email' ? undefined : 'noreferrer'"
      class="contact-card"
      @mouseenter="animateCard($event, true)"
      @mouseleave="animateCard($event, false)"
      @click="link.type === 'email' ? emit('open-email', $event) : undefined"
    >
      <BrandIcon
        v-if="
          link.type === 'github' ||
          link.type === 'discord' ||
          link.type === 'x' ||
          link.type === 'reddit' ||
          link.type === 'youtube'
        "
        :name="link.type"
        class="brand-icon"
      />
      <Mail v-else class="brand-icon" />
      <span class="contact-card-label">{{ link.label }}</span>
      <span class="contact-card-detail">{{ link.detail }}</span>
    </a>
  </div>

  <a
    :href="hireLink.href"
    :target="hireLink.href === '#' ? undefined : '_blank'"
    :rel="hireLink.href === '#' ? undefined : 'noreferrer'"
    class="support-card"
    @click="hireLink.href === '#' ? $event.preventDefault() : undefined"
    @mouseenter="animateCard($event, true)"
    @mouseleave="animateCard($event, false)"
  >
    <span class="support-card-content">
      <img src="/assets/fiverr-icon.png" alt="" class="support-card-icon" />
      <span class="support-card-text">
        <span class="support-card-label">{{ hireLink.label }}</span>
        <span class="support-card-detail">{{ hireLink.detail }}</span>
      </span>
    </span>
    <ExternalLink class="app-icon shrink-0 text-[#b4befe]" />
  </a>

  <a
    :href="supportLink.href"
    target="_blank"
    rel="noreferrer"
    class="support-card"
    @mouseenter="animateCard($event, true)"
    @mouseleave="animateCard($event, false)"
  >
    <span class="support-card-content">
      <BrandIcon :name="supportLink.type" class="support-card-icon" />
      <span class="support-card-text">
        <span class="support-card-label">{{ supportLink.label }}</span>
        <span class="support-card-detail">{{ supportLink.detail }}</span>
      </span>
    </span>
    <ExternalLink class="app-icon shrink-0 text-[#b4befe]" />
  </a>
</template>

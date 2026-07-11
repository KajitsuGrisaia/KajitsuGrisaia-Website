<script setup>
import { computed } from 'vue'
import {
  siDiscord,
  siGithub,
  siReddit,
  siX,
  siYoutube,
} from 'simple-icons/icons'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

const icons = {
  github: siGithub,
  discord: siDiscord,
  x: siX,
  reddit: siReddit,
  youtube: siYoutube,
}

const icon = computed(() => icons[props.name])
</script>

<template>
  <svg v-if="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path :d="icon.path" />
  </svg>
</template>

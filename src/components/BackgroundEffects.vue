<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

const surface = ref(null)
const ripples = ref([])
let animationFrame
let rippleId = 0
let rippleTimers = []

function updateSpotlight(event) {
  if (!surface.value) return

  if (animationFrame) cancelAnimationFrame(animationFrame)

  animationFrame = requestAnimationFrame(() => {
    surface.value.style.setProperty('--spotlight-x', `${event.clientX}px`)
    surface.value.style.setProperty('--spotlight-y', `${event.clientY}px`)
  })
}

function pulseSpotlight(event) {
  const id = rippleId
  rippleId += 1
  ripples.value = [...ripples.value, { id, x: event.clientX, y: event.clientY }]

  const timer = setTimeout(() => {
    ripples.value = ripples.value.filter((ripple) => ripple.id !== id)
  }, 620)

  rippleTimers.push(timer)
}

onMounted(() => {
  window.addEventListener('pointermove', updateSpotlight, { passive: true })
  window.addEventListener('pointerdown', pulseSpotlight, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('pointermove', updateSpotlight)
  window.removeEventListener('pointerdown', pulseSpotlight)
  if (animationFrame) cancelAnimationFrame(animationFrame)
  rippleTimers.forEach((timer) => clearTimeout(timer))
})
</script>

<template>
  <div
    ref="surface"
    class="effects-surface"
    :class="{ 'motion-disabled': disabled }"
    aria-hidden="true"
  >
    <div class="background-spotlight" />
    <span
      v-for="ripple in ripples"
      :key="ripple.id"
      class="click-ripple"
      :style="{ left: `${ripple.x}px`, top: `${ripple.y}px` }"
    />
  </div>
</template>

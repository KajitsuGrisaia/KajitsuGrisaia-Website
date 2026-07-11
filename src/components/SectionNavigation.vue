<script setup>
import { onBeforeUpdate, onMounted, onUnmounted, ref } from 'vue'
import { Music2, Pause } from '@lucide/vue'
import { gsap } from 'gsap'

const props = defineProps({
  activeSection: {
    type: String,
    required: true,
  },
  isMusicPlaying: {
    type: Boolean,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  sections: {
    type: Array,
    required: true,
  },
  volumeBars: {
    type: Array,
    required: true,
  },
  volumeLevel: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['navigate', 'set-volume', 'toggle-music'])

const navItems = ref([])
const activePreviewIndex = ref(null)
const isNavigationAutoHidden = ref(false)

const INACTIVITY_DELAY = 5000
const activityEvents = [
  'pointermove',
  'pointerdown',
  'keydown',
  'scroll',
  'touchstart',
]

let inactivityTimer
let suppressedPreviewIndex = null
let previewCloseTimers = []

function setNavItem(element) {
  if (element && !navItems.value.includes(element)) navItems.value.push(element)
}

function mobileSectionLabel(section) {
  if (section.id === 'introduction') return 'Intro'
  if (section.id === 'stack') return props.language === 'es' ? 'Tech' : 'Stack'
  return section.label
}

function clearPreviewCloseTimers() {
  previewCloseTimers.forEach((timer) => clearTimeout(timer))
  previewCloseTimers = []
}

function hidePreviews() {
  gsap.killTweensOf(navItems.value)
  activePreviewIndex.value = null

  gsap.to(navItems.value, {
    scale: 1,
    duration: 0.16,
    ease: 'power2.out',
  })
}

function suppressPreviewAfterNavigation(index) {
  suppressedPreviewIndex = index
  hidePreviews()
  clearPreviewCloseTimers()
  previewCloseTimers = [120, 360, 900].map((delay) =>
    setTimeout(() => {
      hidePreviews()
      if (delay === 900) suppressedPreviewIndex = null
    }, delay),
  )
}

function navigate(section, index, event) {
  suppressPreviewAfterNavigation(index)
  emit('navigate', section.id, event)
}

function animatePreview(index, isEntering) {
  if (isEntering && suppressedPreviewIndex === index) {
    hidePreviews()
    return
  }

  const item = navItems.value[index]

  if (!item) return

  if (isEntering) {
    navItems.value.forEach((navItem, navIndex) => {
      if (navIndex === index) return
      gsap.to(navItem, { scale: 1, duration: 0.14, ease: 'power2.out' })
    })
  }

  activePreviewIndex.value = isEntering ? index : null

  gsap.to(item, {
    scale: isEntering ? 1.25 : 1,
    duration: 0.22,
    ease: 'power3.out',
  })
}

function closePreviewOnMouseLeave(index) {
  if (suppressedPreviewIndex === index) suppressedPreviewIndex = null
  animatePreview(index, false)
}

function clearInactivityTimer() {
  window.clearTimeout(inactivityTimer)
  inactivityTimer = null
}

function scheduleNavigationHide() {
  clearInactivityTimer()

  inactivityTimer = window.setTimeout(() => {
    isNavigationAutoHidden.value = true
    hidePreviews()
  }, INACTIVITY_DELAY)
}

function revealNavigation() {
  isNavigationAutoHidden.value = false
  scheduleNavigationHide()
}

onBeforeUpdate(() => {
  navItems.value = []
})

onMounted(() => {
  activityEvents.forEach((eventName) => {
    window.addEventListener(eventName, revealNavigation, { passive: true })
  })

  revealNavigation()
})

onUnmounted(() => {
  clearInactivityTimer()
  clearPreviewCloseTimers()

  activityEvents.forEach((eventName) => {
    window.removeEventListener(eventName, revealNavigation)
  })
})
</script>

<template>
  <nav
    class="desktop-section-nav"
    :class="isNavigationAutoHidden ? 'section-nav-auto-hidden' : ''"
  >
    <button
      v-for="(section, index) in sections"
      :key="section.id"
      :ref="setNavItem"
      type="button"
      class="desktop-section-nav-button group"
      :class="
        activeSection === section.id
          ? 'desktop-section-nav-button-active'
          : 'desktop-section-nav-button-idle'
      "
      :aria-label="`Go to ${section.label}`"
      @pointerenter="animatePreview(index, true)"
      @pointerleave="closePreviewOnMouseLeave(index)"
      @mouseenter="animatePreview(index, true)"
      @mouseleave="closePreviewOnMouseLeave(index)"
      @focus="animatePreview(index, true)"
      @blur="animatePreview(index, false)"
      @click="navigate(section, index, $event)"
    >
      <span
        class="section-nav-dot"
        :class="
          activeSection === section.id
            ? 'section-nav-dot-active'
            : 'section-nav-dot-idle'
        "
      />

      <span
        class="section-nav-preview"
        :class="
          activePreviewIndex === index
            ? 'section-nav-preview-open'
            : 'section-nav-preview-closed'
        "
      >
        <span class="section-nav-preview-title">{{ section.label }}</span>
        <span class="section-nav-preview-body">{{ section.preview }}</span>
      </span>
    </button>

    <div class="section-nav-divider" />

    <div class="group relative">
      <button
        type="button"
        class="desktop-music-button"
        :class="isMusicPlaying ? 'music-button-active' : 'music-button-idle'"
        :aria-label="isMusicPlaying ? 'Pause music' : 'Play music'"
        @click="emit('toggle-music')"
      >
        <Pause v-if="isMusicPlaying" class="h-3.5 w-3.5" />
        <Music2 v-else class="h-3.5 w-3.5" />
      </button>

      <div class="desktop-volume-popover">
        <button
          v-for="bar in volumeBars"
          :key="bar"
          type="button"
          class="desktop-volume-bar"
          :class="bar <= volumeLevel ? 'volume-bar-active' : 'volume-bar-idle'"
          :style="{ height: `${bar * 7 + 6}px` }"
          :aria-label="`Set volume to ${bar}`"
          @click="emit('set-volume', bar)"
        />
      </div>
    </div>
  </nav>

  <nav
    class="mobile-section-nav"
    :class="isNavigationAutoHidden ? 'section-nav-auto-hidden' : ''"
  >
    <div class="mobile-section-nav-list">
      <button
        v-for="(section, index) in sections"
        :key="section.id"
        type="button"
        class="mobile-section-nav-button"
        :class="
          activeSection === section.id
            ? 'mobile-section-nav-button-active'
            : 'mobile-section-nav-button-idle'
        "
        @click="navigate(section, index, $event)"
      >
        <span
          class="mobile-section-nav-ring"
          :class="
            activeSection === section.id
              ? 'mobile-section-nav-ring-active'
              : 'mobile-section-nav-ring-idle'
          "
        >
          <span
            class="section-nav-dot"
            :class="
              activeSection === section.id
                ? 'volume-bar-active'
                : 'bg-[#6c7086]'
            "
          />
        </span>
        <span class="mobile-section-nav-label">{{
          mobileSectionLabel(section)
        }}</span>
      </button>
    </div>

    <div class="mobile-music-panel">
      <button
        type="button"
        class="mobile-music-button"
        :class="
          isMusicPlaying
            ? 'language-toggle-button-active'
            : 'language-toggle-button-idle'
        "
        :aria-label="isMusicPlaying ? 'Pause music' : 'Play music'"
        @click="emit('toggle-music')"
      >
        <Pause v-if="isMusicPlaying" class="h-4 w-4" />
        <Music2 v-else class="h-4 w-4" />
      </button>
      <div class="mobile-volume-bars">
        <button
          v-for="bar in volumeBars"
          :key="bar"
          type="button"
          class="mobile-volume-bar"
          :class="bar <= volumeLevel ? 'volume-bar-active' : 'bg-[#45475a]'"
          :style="{ height: `${bar * 4 + 6}px` }"
          :aria-label="`Set volume to ${bar}`"
          @click="emit('set-volume', bar)"
        />
      </div>
    </div>
  </nav>
</template>

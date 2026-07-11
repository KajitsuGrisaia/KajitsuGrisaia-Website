<script setup>
import { computed, onMounted, onUnmounted, reactive } from 'vue'
import { useWindowSize } from '@vueuse/core'

const props = defineProps({
  contentClass: {
    type: String,
    required: true,
  },
  section: {
    type: Object,
    required: true,
  },
})

const characterState = reactive({
  hollow: false,
  hollowKey: 0,
  marioFly: false,
  marioFlyKey: 0,
  marioWalk: false,
  marioWalkKey: 0,
  megaman: false,
  megamanKey: 0,
})

const timers = []
const { width } = useWindowSize()

const coinCount = computed(() => Math.max(9, Math.ceil(width.value / 40)))

function randomWait() {
  return 3000 + Math.random() * 2000
}

function schedule(callback, delay = randomWait()) {
  const timer = window.setTimeout(() => {
    const index = timers.indexOf(timer)
    if (index !== -1) timers.splice(index, 1)
    callback()
  }, delay)

  timers.push(timer)
}

function showCharacter(name) {
  characterState[`${name}Key`] += 1
  characterState[name] = true
}

function scheduleCharacter(name) {
  characterState[name] = false
  schedule(() => showCharacter(name))
}

function scheduleMarioWalk() {
  characterState.marioFly = false
  schedule(() => showCharacter('marioWalk'))
}

function scheduleMarioFly() {
  characterState.marioWalk = false
  schedule(() => showCharacter('marioFly'))
}

onMounted(() => {
  if (props.section.id === 'contact') {
    schedule(() => showCharacter('megaman'))
  }

  if (props.section.id === 'stack') {
    schedule(() => showCharacter('hollow'))
  }

  if (props.section.id === 'introduction') {
    schedule(() => showCharacter('marioFly'))
  }
})

onUnmounted(() => {
  timers.forEach((timer) => window.clearTimeout(timer))
})
</script>

<template>
  <section :id="section.id" class="page-surface">
    <img
      v-if="section.id === 'introduction'"
      src="/assets/process-spring-email.png"
      alt=""
      aria-hidden="true"
      class="section-background-image section-background-image-introduction"
    />
    <img
      v-if="section.id === 'projects'"
      src="/assets/process-particle-field.png"
      alt=""
      aria-hidden="true"
      class="section-background-image section-background-image-projects"
    />
    <img
      v-if="section.id === 'stack'"
      src="/assets/process-vue-register.png"
      alt=""
      aria-hidden="true"
      class="section-background-image section-background-image-stack"
    />
    <img
      v-if="section.id === 'contact'"
      src="/assets/process-footer-css.png"
      alt=""
      aria-hidden="true"
      class="section-background-image section-background-image-contact"
    />
    <img
      v-if="section.id === 'contact' && characterState.megaman"
      :key="characterState.megamanKey"
      src="/assets/megaman-x-run-transparent.gif"
      alt=""
      aria-hidden="true"
      class="section-runner section-runner-contact"
      @animationend="scheduleCharacter('megaman')"
    />
    <div
      v-if="section.id === 'projects'"
      aria-hidden="true"
      class="project-coin-row project-coin-row-top"
    >
      <img
        v-for="coinIndex in coinCount"
        :key="`top-${coinIndex}`"
        src="/assets/mario-coin-transparent.gif"
        alt=""
        class="project-coin"
      />
    </div>
    <div
      v-if="section.id === 'projects'"
      aria-hidden="true"
      class="project-coin-row project-coin-row-bottom"
    >
      <img
        v-for="coinIndex in coinCount"
        :key="`bottom-${coinIndex}`"
        src="/assets/mario-coin-transparent.gif"
        alt=""
        class="project-coin"
      />
    </div>
    <img
      v-if="section.id === 'stack' && characterState.hollow"
      :key="characterState.hollowKey"
      src="/assets/hollow-knight-transparent.gif"
      alt=""
      aria-hidden="true"
      class="section-runner section-runner-stack"
      @animationend="scheduleCharacter('hollow')"
    />
    <img
      v-if="section.id === 'introduction' && characterState.marioFly"
      :key="characterState.marioFlyKey"
      src="/assets/mario-world-fly.gif"
      alt=""
      aria-hidden="true"
      class="intro-sprite intro-sprite-fly"
      @animationend="scheduleMarioWalk"
    />
    <img
      v-if="section.id === 'introduction' && characterState.marioWalk"
      :key="characterState.marioWalkKey"
      src="/assets/mario-world-walking.gif"
      alt=""
      aria-hidden="true"
      class="intro-sprite intro-sprite-walk"
      @animationend="scheduleMarioFly"
    />
    <a
      v-if="section.id === 'introduction'"
      href="https://github.com/KajitsuGrisaia"
      target="_blank"
      rel="noreferrer"
      class="profile-card profile-card-desktop group"
      aria-label="Open KajitsuGrisaia on GitHub"
    >
      <img
        src="/assets/profile-circle-source.png"
        alt="KajitsuGrisaia profile portrait"
        class="profile-image"
      />
    </a>

    <div class="section-content" :class="contentClass">
      <p class="section-eyebrow">
        {{ section.eyebrow }}
      </p>
      <h1 v-if="section.id === 'introduction'" class="section-title">
        {{ section.title }}
      </h1>
      <h2 v-else class="section-title">
        {{ section.title }}
      </h2>
      <p class="section-body">
        {{ section.body }}
      </p>

      <slot />
    </div>
  </section>
</template>

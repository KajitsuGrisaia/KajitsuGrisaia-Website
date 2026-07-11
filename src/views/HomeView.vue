<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useEventListener, usePreferredReducedMotion } from '@vueuse/core'
import { animate } from 'motion'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import BackgroundEffects from '../components/BackgroundEffects.vue'
import ContactFormModal from '../components/ContactFormModal.vue'
import LanguageToggle from '../components/LanguageToggle.vue'
import ParticleField from '../components/ParticleField.vue'
import SectionNavigation from '../components/SectionNavigation.vue'
import ContactSection from '../components/sections/ContactSection.vue'
import IntroSection from '../components/sections/IntroSection.vue'
import ProjectsSection from '../components/sections/ProjectsSection.vue'
import SectionFrame from '../components/sections/SectionFrame.vue'
import TechStackSection from '../components/sections/TechStackSection.vue'
import { usePortfolioStore } from '../stores/portfolio'

const portfolio = usePortfolioStore()
const {
  activeSection,
  contactLinks,
  language,
  navCopy,
  projects,
  sections,
  supportLink,
  techStack,
} = storeToRefs(portfolio)
const preferredMotion = usePreferredReducedMotion()

const audioElement = ref(null)
const isMusicPlaying = ref(false)
const volumeLevel = ref(3)
const isEmailFormOpen = ref(false)
const volumeBars = [1, 2, 3, 4]

let lenis
let sectionAnimationObserver
let scrollAnimationFrame

function updateActiveSectionFromScroll() {
  const viewportMarker = window.scrollY + window.innerHeight * 0.5
  let currentSection = sections.value[0].id

  sections.value.forEach((section) => {
    const element = document.getElementById(section.id)
    if (element && element.offsetTop <= viewportMarker)
      currentSection = section.id
  })

  portfolio.setActiveSection(currentSection)
}

function handleScroll() {
  if (scrollAnimationFrame) return

  scrollAnimationFrame = requestAnimationFrame(() => {
    updateActiveSectionFromScroll()
    scrollAnimationFrame = null
  })
}

function scrollToSection(id, event) {
  portfolio.setActiveSection(id)
  event?.currentTarget?.blur()

  if (lenis && preferredMotion.value !== 'reduce') {
    lenis.scrollTo(`#${id}`, { offset: 0 })
    return
  }

  document.getElementById(id)?.scrollIntoView({
    behavior: preferredMotion.value === 'reduce' ? 'auto' : 'smooth',
    block: 'start',
  })
}

function animateCard(event, isEntering) {
  if (preferredMotion.value === 'reduce') return

  animate(
    event.currentTarget,
    {
      transform: isEntering ? 'translateY(-6px)' : 'translateY(0)',
      borderColor: isEntering ? '#b4befe' : '#313244',
    },
    { duration: 0.22, easing: 'ease-out' },
  )
}

function animateHeroButton(event, isEntering) {
  if (preferredMotion.value === 'reduce') return

  animate(
    event.currentTarget,
    {
      transform: isEntering ? 'translateY(-4px)' : 'translateY(0)',
      boxShadow: isEntering
        ? '0 18px 36px rgb(0 0 0 / 0.28)'
        : '0 0 0 rgb(0 0 0 / 0)',
    },
    { duration: 0.22, easing: 'ease-out' },
  )
}

function applyVolume(level) {
  volumeLevel.value = level

  if (audioElement.value) {
    audioElement.value.volume = level / volumeBars.length
  }
}

async function toggleMusic() {
  if (!audioElement.value) return

  audioElement.value.volume = volumeLevel.value / volumeBars.length

  if (audioElement.value.paused) {
    try {
      await audioElement.value.play()
      isMusicPlaying.value = true
    } catch {
      isMusicPlaying.value = false
    }
    return
  }

  audioElement.value.pause()
  isMusicPlaying.value = false
}

function openEmailForm(event) {
  event?.preventDefault()
  isEmailFormOpen.value = true
}

function closeEmailForm() {
  isEmailFormOpen.value = false
}

function sectionContentClass(sectionId) {
  if (sectionId === 'stack') return 'section-content-stack'
  if (sectionId === 'introduction') return 'section-content-introduction'
  return 'section-content-default'
}

function animatePageContent() {
  if (preferredMotion.value === 'reduce') return

  gsap.fromTo(
    '.section-content > *',
    { autoAlpha: 0, y: 32 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.55,
      ease: 'power3.out',
      stagger: 0.06,
    },
  )
}

watch(language, async () => {
  await nextTick()
  animatePageContent()
})

onMounted(async () => {
  await nextTick()
  applyVolume(volumeLevel.value)

  if (preferredMotion.value !== 'reduce') {
    lenis = new Lenis({ lerp: 0.08, smoothWheel: true })

    function raf(time) {
      lenis?.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    gsap.from('.page-surface', {
      autoAlpha: 0,
      duration: 0.7,
      ease: 'power3.out',
    })
  }

  updateActiveSectionFromScroll()
  useEventListener(window, 'scroll', handleScroll, { passive: true })

  sectionAnimationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return

        if (preferredMotion.value !== 'reduce') {
          gsap.fromTo(
            entry.target.querySelectorAll('.section-content > *'),
            { autoAlpha: 0, y: 32 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              stagger: 0.1,
            },
          )
        }

        sectionAnimationObserver.unobserve(entry.target)
      })
    },
    { threshold: 0.35 },
  )

  sections.value.forEach((section) => {
    const element = document.getElementById(section.id)
    if (element) sectionAnimationObserver.observe(element)
  })
})

onUnmounted(() => {
  sectionAnimationObserver?.disconnect()
  lenis?.destroy()
  audioElement.value?.pause()

  if (scrollAnimationFrame) cancelAnimationFrame(scrollAnimationFrame)
})
</script>

<template>
  <main class="site-shell">
    <audio
      ref="audioElement"
      src="/assets/background-music.mp3"
      loop
      preload="metadata"
      @pause="isMusicPlaying = false"
      @play="isMusicPlaying = true"
    />
    <ParticleField :disabled="preferredMotion === 'reduce'" />
    <BackgroundEffects :disabled="preferredMotion === 'reduce'" />

    <LanguageToggle
      :language="language"
      @set-language="portfolio.setLanguage"
    />
    <SectionNavigation
      :active-section="activeSection"
      :is-music-playing="isMusicPlaying"
      :language="language"
      :sections="sections"
      :volume-bars="volumeBars"
      :volume-level="volumeLevel"
      @navigate="scrollToSection"
      @set-volume="applyVolume"
      @toggle-music="toggleMusic"
    />

    <SectionFrame
      v-for="section in sections"
      :key="section.id"
      :content-class="sectionContentClass(section.id)"
      :section="section"
    >
      <IntroSection
        v-if="section.id === 'introduction'"
        :animate-hero-button="animateHeroButton"
        :nav-copy="navCopy"
        @navigate="scrollToSection"
      />
      <ProjectsSection
        v-else-if="section.id === 'projects'"
        :animate-card="animateCard"
        :projects="projects"
      />
      <TechStackSection
        v-else-if="section.id === 'stack'"
        :animate-card="animateCard"
        :tech-stack="techStack"
      />
      <ContactSection
        v-else-if="section.id === 'contact'"
        :animate-card="animateCard"
        :contact-links="contactLinks"
        :support-link="supportLink"
        @open-email="openEmailForm"
      />
    </SectionFrame>

    <ContactFormModal
      :language="language"
      :open="isEmailFormOpen"
      @close="closeEmailForm"
    />
  </main>
</template>

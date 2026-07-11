<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ArrowLeft, ExternalLink } from '@lucide/vue'
import { animate } from 'motion'
import { usePortfolioStore } from '../stores/portfolio'

const route = useRoute()
const portfolio = usePortfolioStore()

const project = computed(
  () =>
    portfolio.projects.find((item) => item.slug === route.params.slug) ||
    portfolio.projects[0],
)

const labels = computed(() =>
  portfolio.language === 'es'
    ? {
        back: 'Volver',
        detail: 'Detalle del Proyecto',
        github: 'Ver GitHub',
      }
    : {
        back: 'Back',
        detail: 'Project Detail',
        github: 'View GitHub',
      },
)

onMounted(() => {
  animate(
    '.project-panel',
    { opacity: [0, 1], transform: ['translateY(18px)', 'translateY(0)'] },
    { duration: 0.45 },
  )
})
</script>

<template>
  <main class="project-detail-page">
    <RouterLink to="/" class="project-back-link">
      <ArrowLeft class="app-icon" />
      {{ labels.back }}
    </RouterLink>

    <section class="project-panel">
      <p class="project-detail-eyebrow">{{ labels.detail }}</p>
      <h1 class="project-detail-title">{{ project.title }}</h1>
      <p class="project-detail-body">{{ project.body }}</p>
      <a
        href="https://github.com/KajitsuGrisaia"
        target="_blank"
        rel="noreferrer"
        class="project-detail-link"
      >
        {{ labels.github }}
        <ExternalLink class="app-icon" />
      </a>
    </section>
  </main>
</template>

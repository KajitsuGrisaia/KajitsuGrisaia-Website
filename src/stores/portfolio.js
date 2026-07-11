import { defineStore } from 'pinia'
import { localizedPortfolio } from '../data/portfolio'

const spanishSpeakingRegions = new Set([
  'AR',
  'BO',
  'CL',
  'CO',
  'CR',
  'CU',
  'DO',
  'EC',
  'ES',
  'GQ',
  'GT',
  'HN',
  'MX',
  'NI',
  'PA',
  'PE',
  'PR',
  'PY',
  'SV',
  'UY',
  'VE',
])

function detectPreferredLanguage() {
  if (typeof window === 'undefined') return 'en'

  const savedLanguage = window.localStorage.getItem('portfolio-language')
  if (savedLanguage === 'en' || savedLanguage === 'es') return savedLanguage

  const browserLanguages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language]

  const shouldUseSpanish = browserLanguages.some((locale) => {
    try {
      const parsedLocale = new Intl.Locale(locale)
      return (
        parsedLocale.language === 'es' ||
        spanishSpeakingRegions.has(parsedLocale.region)
      )
    } catch {
      return locale.toLowerCase().startsWith('es')
    }
  })

  return shouldUseSpanish ? 'es' : 'en'
}

export const usePortfolioStore = defineStore('portfolio', {
  state: () => ({
    activeSection: 'introduction',
    language: detectPreferredLanguage(),
  }),
  getters: {
    content: (state) => localizedPortfolio[state.language],
    sections() {
      return this.content.sections
    },
    projects() {
      return this.content.projects
    },
    techStack() {
      return this.content.techStack
    },
    contactLinks() {
      return this.content.contactLinks
    },
    supportLink() {
      return this.content.supportLink
    },
    navCopy() {
      return this.content.nav
    },
  },
  actions: {
    setActiveSection(sectionId) {
      this.activeSection = sectionId
    },
    setLanguage(language) {
      this.language = language
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('portfolio-language', language)
      }
    },
  },
})

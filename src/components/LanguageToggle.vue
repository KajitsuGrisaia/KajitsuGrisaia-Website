<script setup>
defineProps({
  language: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['set-language'])
</script>

<template>
  <div class="language-toggle">
    <button
      type="button"
      class="language-toggle-button"
      :class="
        language === 'en'
          ? 'language-toggle-button-active'
          : 'language-toggle-button-idle'
      "
      @click="emit('set-language', 'en')"
    >
      EN
    </button>
    <button
      type="button"
      class="language-toggle-button"
      :class="
        language === 'es'
          ? 'language-toggle-button-active'
          : 'language-toggle-button-idle'
      "
      @click="emit('set-language', 'es')"
    >
      ES
    </button>
  </div>
</template>

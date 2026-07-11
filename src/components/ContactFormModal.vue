<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  language: {
    type: String,
    required: true,
  },
  open: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close'])

const maxEmailMessageLength = 5000
const status = ref('')
const error = ref('')
const isSending = ref(false)
const openedAt = ref(Date.now())
const form = ref({
  from: '',
  subject: '',
  message: '',
  website: '',
  humanVerified: false,
})

const copy = computed(() =>
  props.language === 'es'
    ? {
        eyebrow: 'Contácteme',
        title: 'Envíame un correo',
        close: 'Cerrar',
        email: 'Tu correo',
        emailPlaceholder: 'tu@ejemplo.com',
        subject: 'Asunto',
        subjectPlaceholder: 'Consulta sobre proyecto',
        message: 'Mensaje',
        messagePlaceholder: 'Escribe tu mensaje...',
        helper: 'Enviado directamente desde el sitio web.',
        botCheck: 'Confirmo que no soy un bot.',
        botCheckError: 'Confirma que no eres un bot antes de enviar el correo.',
        send: 'Enviar correo',
        sending: 'Enviando...',
        success: 'Correo enviado correctamente.',
      }
    : {
        eyebrow: 'Contact me',
        title: 'Send an Email',
        close: 'Close',
        email: 'Your email',
        emailPlaceholder: 'you@example.com',
        subject: 'Subject',
        subjectPlaceholder: 'Project inquiry',
        message: 'Message',
        messagePlaceholder: 'Write your message...',
        helper: 'Sent directly through the website.',
        botCheck: 'I confirm I am not a bot.',
        botCheckError: 'Confirm you are not a bot before sending the email.',
        send: 'Send Email',
        sending: 'Sending...',
        success: 'Email sent successfully.',
      },
)

function close() {
  emit('close')
}

function resetForm() {
  form.value = {
    from: '',
    subject: '',
    message: '',
    website: '',
    humanVerified: false,
  }
  openedAt.value = Date.now()
}

async function submit() {
  status.value = ''
  error.value = ''

  if (!form.value.humanVerified) {
    error.value = copy.value.botCheckError
    return
  }

  isSending.value = true

  try {
    const payload = {
      ...form.value,
      humanElapsedMs: Date.now() - openedAt.value,
    }

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send email.')
    }

    status.value = copy.value.success
    resetForm()
  } catch (submitError) {
    error.value = submitError.message || 'Failed to send email.'
  } finally {
    isSending.value = false
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    status.value = ''
    error.value = ''
    openedAt.value = Date.now()
  },
)
</script>

<template>
  <div
    v-if="open"
    class="modal-backdrop"
    role="dialog"
    aria-modal="true"
    aria-labelledby="email-form-title"
    @click.self="close"
  >
    <form class="contact-form" @submit.prevent="submit">
      <div class="modal-header">
        <div>
          <p class="modal-eyebrow">{{ copy.eyebrow }}</p>
          <h2 id="email-form-title" class="modal-title">{{ copy.title }}</h2>
        </div>
        <button type="button" class="modal-close-button" @click="close">
          {{ copy.close }}
        </button>
      </div>

      <label class="form-label form-label-first" for="visitor-email">{{
        copy.email
      }}</label>
      <input
        id="visitor-email"
        v-model="form.from"
        type="email"
        required
        :placeholder="copy.emailPlaceholder"
        class="form-control"
      />

      <label class="form-label form-label-spaced" for="visitor-subject">{{
        copy.subject
      }}</label>
      <input
        id="visitor-subject"
        v-model="form.subject"
        type="text"
        required
        maxlength="140"
        :placeholder="copy.subjectPlaceholder"
        class="form-control"
      />

      <label class="form-label form-label-spaced" for="visitor-message">{{
        copy.message
      }}</label>
      <textarea
        id="visitor-message"
        v-model="form.message"
        required
        :maxlength="maxEmailMessageLength"
        rows="8"
        :placeholder="copy.messagePlaceholder"
        class="form-control form-textarea"
      />
      <div class="form-helper-row">
        <span>{{ copy.helper }}</span>
        <span>{{ form.message.length }} / {{ maxEmailMessageLength }}</span>
      </div>

      <input
        v-model="form.website"
        type="text"
        name="website"
        tabindex="-1"
        autocomplete="off"
        class="honeypot-field"
        aria-hidden="true"
      />

      <label class="bot-check">
        <input
          v-model="form.humanVerified"
          type="checkbox"
          class="bot-check-input"
          required
        />
        <span>{{ copy.botCheck }}</span>
      </label>

      <p v-if="status" class="form-status form-status-success">
        {{ status }}
      </p>
      <p v-if="error" class="form-status form-status-error">
        {{ error }}
      </p>

      <button type="submit" class="form-submit-button" :disabled="isSending">
        {{ isSending ? copy.sending : copy.send }}
      </button>
    </form>
  </div>
</template>

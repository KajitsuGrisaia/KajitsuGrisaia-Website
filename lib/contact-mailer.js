import nodemailer from 'nodemailer'

const maxMessageLength = 5000
const minimumHumanDelayMs = 1500
const maximumHumanDelayMs = 2 * 60 * 60 * 1000
const recipient = process.env.CONTACT_TO || 'grisaiakajitsu98@gmail.com'

export const contactEmailError =
  'Email service is not configured yet or failed to send.'

function requiredEnv(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

function createTransporter() {
  return nodemailer.createTransport({
    host: requiredEnv('SMTP_HOST'),
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: requiredEnv('SMTP_USER'),
      pass: requiredEnv('SMTP_PASS'),
    },
  })
}

export function parseContactPayload(body) {
  const payload = {
    from: String(body?.from || '').trim(),
    subject: String(body?.subject || '').trim(),
    message: String(body?.message || '').trim(),
    humanElapsedMs: Number(body?.humanElapsedMs || 0),
    humanVerified: body?.humanVerified === true,
    website: String(body?.website || '').trim(),
  }

  if (payload.website) {
    return {
      error: 'Message rejected.',
      payload,
      status: 400,
    }
  }

  if (!payload.from || !payload.subject || !payload.message) {
    return {
      error: 'Email, subject, and message are required.',
      payload,
      status: 400,
    }
  }

  if (payload.message.length > maxMessageLength) {
    return {
      error: `Message must be ${maxMessageLength} characters or fewer.`,
      payload,
      status: 400,
    }
  }

  if (!payload.humanVerified) {
    return {
      error: 'Please confirm you are not a bot.',
      payload,
      status: 400,
    }
  }

  if (
    payload.humanElapsedMs < minimumHumanDelayMs ||
    payload.humanElapsedMs > maximumHumanDelayMs
  ) {
    return {
      error: 'Please try submitting the form again.',
      payload,
      status: 400,
    }
  }

  return { payload }
}

export async function sendContactEmail({ from, subject, message }) {
  const transporter = createTransporter()

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: recipient,
    replyTo: from,
    subject: `[Portfolio] ${subject}`,
    text: `From: ${from}\n\n${message}`,
  })
}

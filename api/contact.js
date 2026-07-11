import {
  contactEmailError,
  parseContactPayload,
  sendContactEmail,
} from '../lib/contact-mailer.js'

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ error: 'Method not allowed.' })
  }

  const { error, payload, status } = parseContactPayload(request.body)

  if (error) return response.status(status).json({ error })

  try {
    await sendContactEmail(payload)

    return response.json({ ok: true })
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: contactEmailError })
  }
}

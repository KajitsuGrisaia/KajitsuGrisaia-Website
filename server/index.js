import 'dotenv/config'
import express from 'express'
import {
  contactEmailError,
  parseContactPayload,
  sendContactEmail,
} from '../lib/contact-mailer.js'

const app = express()
const port = Number(process.env.PORT || 3001)

app.use(express.json({ limit: '32kb' }))

app.post('/api/contact', async (request, response) => {
  const { error, payload, status } = parseContactPayload(request.body)

  if (error) return response.status(status).json({ error })

  try {
    await sendContactEmail(payload)

    return response.json({ ok: true })
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: contactEmailError })
  }
})

app.listen(port, () => {
  console.log(`Contact API listening on http://localhost:${port}`)
})

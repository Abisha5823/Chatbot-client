import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.post('/api/chat', async (req, res) => {
  try {
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'KI Bharath Solar Chatbot'
        },
        body: JSON.stringify(req.body)
      }
    )

    const data = await response.json()

    res.status(response.status).json(data)
  } catch (err) {
    console.error(err)

    res.status(500).json({
      error: err.message
    })
  }
})

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
export default async function handler(req, res) {
  console.log('API KEY EXISTS:', !!process.env.OPENROUTER_API_KEY)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://yourdomain.com',
          'X-Title': 'KI Bharath Solar Chatbot'
        },
        body: JSON.stringify(req.body)
      }
    )

    const data = await response.json()

    return res.status(response.status).json(data)
  } catch (err) {
    return res.status(500).json({
      error: err.message
    })
  }
}
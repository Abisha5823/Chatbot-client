import { retrieveContext, detectLanguage, detectSolarCalcIntent, calculateSolar, extractBillAmount, detectLeadIntent } from '../rag/retrieval.js'
import { companyData } from '../rag/retrieval.js'


// ✅ OpenRouter - free tier, no quota issues
// Uses google/gemma-2-9b-it:free (always free on OpenRouter)
const MODEL = 'openai/gpt-oss-20b:free'


const SYSTEM_PROMPT = `You are SolarBot, the official AI assistant for KI Bharath Solar Energies – a trusted solar company in Tamil Nadu, India.

CORE RULES:
1. ONLY answer questions related to solar energy, KI Bharath Solar services, products, pricing, and consultations
2. If asked about unrelated topics, politely redirect to solar topics
3. Be conversational, warm, and helpful like a knowledgeable friend
4. Understand spelling mistakes and unclear questions intelligently
5. Ask clarifying follow-up questions when needed
6. Keep responses concise (3-6 sentences max unless calculations needed)
7. Always end with a helpful next step or question

LANGUAGE:
- If the user writes in Tamil, respond ENTIRELY in Tamil
- If the user writes in English, respond in English

TONE: Friendly, professional, solution-focused. Not robotic.

ALWAYS USE THE PROVIDED COMPANY DATA. Do not invent prices or details.`

export async function sendMessage(messages, userMessage) {
  

  const lang = detectLanguage(userMessage)
  const ragContext = retrieveContext(userMessage)
  const billAmount = extractBillAmount(userMessage)
  const hasSolarCalc = detectSolarCalcIntent(userMessage)
  const hasLeadIntent = detectLeadIntent(userMessage)

  let calcBlock = ''
  if (hasSolarCalc && billAmount) {
    const calc = calculateSolar(billAmount)
    calcBlock = `
SOLAR CALCULATION FOR USER (bill: Rs.${billAmount}):
- Monthly units: ~${calc.units}
- System size: ${calc.kw} kW
- Total cost: Rs.${calc.cost}
- After subsidy: Rs.${calc.netCost}
- Monthly savings: Rs.${calc.monthlySavings}
- Payback: ${calc.paybackYears} years
Use these exact numbers in your response.`
  }

  const fullSystemPrompt = `${SYSTEM_PROMPT}

--- COMPANY DATA ---
${ragContext}
${calcBlock}

Respond in: ${lang === 'tamil' ? 'Tamil' : 'English'}
${hasLeadIntent ? 'User is interested in solar. After answering, ask for their name and location for a free consultation.' : ''}`

  // Build conversation history (OpenRouter uses OpenAI-compatible format)
  const history = messages.slice(-6).map(m => ({
    role: m.role === 'user' ? 'user' : 'assistant',
    content: m.content
  }))

  let response
  try {
    response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: fullSystemPrompt },
          ...history,
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    })
  } catch (networkErr) {
    throw new Error(`Network error: ${networkErr.message}`)
  }

  if (!response.ok) {
    const errText = await response.text()
    let parsed = {}
    try { parsed = JSON.parse(errText) } catch {}
    const msg = parsed?.error?.message || errText
    console.error('[OpenRouter] Error ' + response.status + ':', msg)

    if (response.status === 401) throw new Error('INVALID_KEY')
    if (response.status === 429) throw new Error('QUOTA_EXHAUSTED')
    throw new Error('API_ERROR_' + response.status + ': ' + msg)
  }

  const data = await response.json()
  console.log('[OpenRouter] Response:', data)

  const text = data.choices?.[0]?.message?.content || 'Sorry, please try again.'

  return {
    text,
    lang,
    hasCalc: !!(hasSolarCalc && billAmount),
    calcData: (hasSolarCalc && billAmount) ? calculateSolar(billAmount) : null,
    hasLeadIntent
  }
}

export { detectLanguage, detectSolarCalcIntent, calculateSolar, extractBillAmount, detectLeadIntent, companyData }
import { useState, useCallback, useRef } from 'react'
import { sendMessage } from '../utils/gemini.js'
import { saveLead, getNextLeadQuestion, LEAD_STEPS, generateLeadWhatsAppMessage } from '../utils/leads.js'
import { detectLeadIntent, detectLanguage } from '../rag/retrieval.js'

const INITIAL_MESSAGE = {
  id: 1,
  role: 'assistant',
  content: "👋 Hello! I'm **SolarBot** from *KI Bharath Solar Energies*.\n\nI can help you with:\n• Solar system pricing & calculations\n• Products & services\n• Subsidy information\n• Free consultation booking\n\nHow can I help you today? 🌞",
  timestamp: new Date()
}

export function useChat() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState(null)

  const [collectingLead, setCollectingLead] = useState(false)
  const [leadStep, setLeadStep] = useState(0)
  const [leadData, setLeadData] = useState({})
  const [lang, setLang] = useState('english')

  const messageIdRef = useRef(2)

  const addMessage = useCallback((role, content, extra = {}) => {
    const msg = {
      id: messageIdRef.current++,
      role,
      content,
      timestamp: new Date(),
      ...extra
    }
    setMessages(prev => [...prev, msg])
    return msg
  }, [])

  const sendUserMessage = useCallback(async (text) => {
    if (!text.trim() || isTyping) return

    setError(null)
    addMessage('user', text)
    setIsTyping(true)

    const detectedLang = detectLanguage(text)
    setLang(detectedLang)

    try {
      // Handle lead collection flow
      if (collectingLead) {
        const steps = LEAD_STEPS
        const currentStep = steps[leadStep]
        const newLeadData = { ...leadData, [currentStep]: text }
        setLeadData(newLeadData)

        const nextStepIdx = leadStep + 1
        const nextStep = steps[nextStepIdx]

        if (nextStep && nextStep !== 'done') {
          setLeadStep(nextStepIdx)
          const q = getNextLeadQuestion(nextStep, detectedLang)
          addMessage('assistant', q)
        } else {
          setCollectingLead(false)
          setLeadStep(0)
          const lead = saveLead(newLeadData)
          const waLink = generateLeadWhatsAppMessage(lead)

          const thankMsg = detectedLang === 'tamil'
            ? `நன்றி ${newLeadData.name || ''}! உங்கள் விவரங்கள் பதிவு செய்யப்பட்டன. எங்கள் குழு விரைவில் தொடர்பு கொள்ளும்.\n\n[WhatsApp-ல் தொடர்பு கொள்ள இங்கே அழுத்துங்கள்](${waLink})`
            : `Thank you ${newLeadData.name || ''}! 🎉 Your details have been recorded. Our team will contact you shortly.\n\n📱 [Click here to WhatsApp us directly](${waLink})`

          addMessage('assistant', thankMsg, { isLead: true, leadData: lead, waLink })
        }
        setIsTyping(false)
        return
      }

      // Normal AI response
      const response = await sendMessage(messages, text)
      addMessage('assistant', response.text, {
        hasCalc: response.hasCalc,
        calcData: response.calcData
      })

      // Trigger lead collection if intent detected
      if (response.hasLeadIntent && !collectingLead) {
        setTimeout(() => {
          const q = getNextLeadQuestion('name', response.lang)
          addMessage('assistant', q)
          setCollectingLead(true)
          setLeadStep(0)
        }, 800)
      }

    } catch (e) {
      console.error('[useChat] Error:', e.message)

      // User-friendly error messages
      let userMsg = '⚠️ Something went wrong. Please try again.'
      let errorBanner = 'Connection error. Please try again.'

      if (e.message === 'QUOTA_EXHAUSTED') {
        userMsg = '⚠️ The AI is temporarily rate-limited (free tier quota). Please wait 1 minute and try again, or contact us directly:\n\n📞 **+91 9791744224**\n💬 [WhatsApp Us](https://wa.me/919791744224)'
        errorBanner = '⏳ Rate limit hit — wait 1 min or WhatsApp us directly.'
      } else if (e.message?.includes('API key')) {
        userMsg = '⚠️ API key issue. Please check your `.env` file.'
        errorBanner = 'API key error.'
      } else if (e.message?.includes('Network') || e.message?.includes('fetch')) {
        userMsg = '⚠️ Network error. Please check your internet connection.'
        errorBanner = 'Network error.'
      }

      setError(errorBanner)
      addMessage('assistant', userMsg)
    } finally {
      setIsTyping(false)
    }
  }, [messages, isTyping, addMessage, collectingLead, leadStep, leadData, lang])

  const startLeadCollection = useCallback(() => {
    if (!collectingLead) {
      const q = getNextLeadQuestion('name', lang)
      addMessage('assistant', q)
      setCollectingLead(true)
      setLeadStep(0)
      setLeadData({})
    }
  }, [collectingLead, lang, addMessage])

  const clearChat = useCallback(() => {
    setMessages([INITIAL_MESSAGE])
    setCollectingLead(false)
    setLeadStep(0)
    setLeadData({})
    setError(null)
  }, [])

  return {
    messages,
    isTyping,
    error,
    sendUserMessage,
    startLeadCollection,
    clearChat,
    collectingLead,
    lang
  }
}
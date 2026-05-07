// Lead storage and integration utilities

const LEADS_KEY = 'ki_bharath_leads'
const GOOGLE_SHEET_URL = import.meta.env.VITE_GOOGLE_SHEET_URL || ''
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '9791744224'

export function saveLead(lead) {
  const leads = getLeads()
  const newLead = {
    ...lead,
    id: Date.now(),
    timestamp: new Date().toISOString(),
    status: 'new'
  }
  leads.unshift(newLead)
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads))
  
  // Fire async integrations
  sendToGoogleSheets(newLead).catch(() => {})
  
  return newLead
}

export function getLeads() {
  try {
    return JSON.parse(localStorage.getItem(LEADS_KEY) || '[]')
  } catch {
    return []
  }
}

export function updateLeadStatus(id, status) {
  const leads = getLeads()
  const idx = leads.findIndex(l => l.id === id)
  if (idx !== -1) {
    leads[idx].status = status
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads))
  }
}

async function sendToGoogleSheets(lead) {
  if (!GOOGLE_SHEET_URL) return
  try {
    await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: lead.name || '',
        phone: lead.phone || '',
        location: lead.location || '',
        ebBill: lead.ebBill || '',
        type: lead.type || '',
        timestamp: lead.timestamp
      })
    })
  } catch (e) {
    console.warn('Google Sheets submission failed:', e)
  }
}

export function generateWhatsAppLink(lead) {
  const message = encodeURIComponent(
    `🌞 *New Solar Enquiry from KI Bharath Solar Bot*\n\n` +
    `👤 Name: ${lead.name || 'Not provided'}\n` +
    `📱 Phone: ${lead.phone || 'Not provided'}\n` +
    `📍 Location: ${lead.location || 'Not provided'}\n` +
    `💡 EB Bill: ₹${lead.ebBill || 'Not provided'}\n` +
    `🏠 Type: ${lead.type || 'Not provided'}\n\n` +
    `Please call me for solar consultation.`
  )
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
}

export function generateLeadWhatsAppMessage(lead) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi! I'm ${lead.name || 'interested in solar'} from ${lead.location || 'Tamil Nadu'}. ` +
    `My monthly EB bill is ₹${lead.ebBill || '?'}. Please contact me for a solar consultation.`
  )}`
}

// Lead collection state machine
export const LEAD_STEPS = ['name', 'phone', 'location', 'ebBill', 'type', 'done']

export function getNextLeadQuestion(step, lang = 'english') {
  const questions = {
    english: {
      name: "Great! To arrange a *free consultation*, may I have your name?",
      phone: "Thanks! What's your phone number? (We'll call at a convenient time)",
      location: "Which city/area are you from? (Thoothukudi, Madurai, Tirunelveli, etc.)",
      ebBill: "What is your approximate monthly electricity (EB) bill amount? (e.g. ₹2000)",
      type: "Is this for your Home, Shop/Office, or Industry?",
      done: null
    },
    tamil: {
      name: "நன்று! *இலவச ஆலோசனை* ஏற்பாடு செய்ய உங்கள் பெயர் என்ன?",
      phone: "நன்றி! உங்கள் தொலைபேசி எண் என்ன?",
      location: "நீங்கள் எந்த நகரம் / பகுதியில் இருக்கிறீர்கள்?",
      ebBill: "உங்கள் மாதாந்திர மின்சார பில் தோராயமாக எவ்வளவு? (உதா: ₹2000)",
      type: "இது உங்கள் வீட்டிற்கா, கடைக்கா, அல்லது தொழிற்சாலைக்கா?",
      done: null
    }
  }
  return questions[lang]?.[step] || null
}
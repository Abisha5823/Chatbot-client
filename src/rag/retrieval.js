import companyData from './data.json'

/**
 * Keyword-based RAG retrieval.
 * Searches FAQs, services, products, and company info.
 * Returns relevant context string to inject into AI prompt.
 */

function tokenize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\u0B80-\u0BFF\s]/g, '').split(/\s+/)
}

function score(tokens, keywords) {
  return keywords.reduce((acc, kw) => acc + (tokens.some(t => t.includes(kw.toLowerCase())) ? 1 : 0), 0)
}

export function retrieveContext(userMessage) {
  const tokens = tokenize(userMessage)
  const results = []

  // Match FAQs
  for (const faq of companyData.faqs) {
    const s = score(tokens, faq.keywords)
    if (s > 0) results.push({ type: 'faq', data: faq, score: s })
  }

  // Match services
  for (const svc of companyData.services) {
    const s = score(tokens, svc.keywords)
    if (s > 0) results.push({ type: 'service', data: svc, score: s })
  }

  // Match products
  for (const [key, product] of Object.entries(companyData.products)) {
    const s = score(tokens, product.keywords)
    if (s > 0) results.push({ type: 'product', category: key, data: product, score: s })
  }

  // Sort by score descending, take top 3
  results.sort((a, b) => b.score - a.score)
  const top = results.slice(0, 3)

  // Always include company basics
  const companyContext = `
COMPANY: ${companyData.company.name}
Phone: ${companyData.company.phone} | WhatsApp: ${companyData.company.whatsapp}
Email: ${companyData.company.email}
Areas served: ${companyData.company.serviceAreas.join(', ')}
Experience: ${companyData.company.experience}, ${companyData.company.installations} installations
`

  const retrieved = top.map(r => {
    if (r.type === 'faq') return `Q: ${r.data.question}\nA: ${r.data.answer}`
    if (r.type === 'service') return `SERVICE - ${r.data.name}: ${r.data.description || 'Available'}`
    if (r.type === 'product') return `PRODUCT (${r.category}): Brands: ${r.data.brands.join(', ')} | Price: ${r.data.priceRange}`
    return ''
  }).join('\n\n')

  return companyContext + '\n' + (retrieved || '')
}

export function detectLanguage(text) {
  // Tamil unicode range: \u0B80-\u0BFF
  const tamilChars = (text.match(/[\u0B80-\u0BFF]/g) || []).length
  return tamilChars > 2 ? 'tamil' : 'english'
}

export function detectSolarCalcIntent(text) {
  const lower = text.toLowerCase()
  const billKeywords = ['eb bill', 'electricity bill', 'bill amount', 'monthly bill', 'unit', 'units', '₹', 'rs ', 'rupee']
  return billKeywords.some(k => lower.includes(k))
}

export function calculateSolar(billAmount) {
  const { unitsPerRupee, kWPerUnits, costPerKw } = companyData.calculations
  const units = billAmount / unitsPerRupee
  const kw = Math.max(1, Math.ceil(units / kWPerUnits * 10) / 10)
  const cost = Math.round(kw * costPerKw)
  const subsidyMax = kw <= 3 ? 78000 : 78000 + (kw - 3) * 10000
  const netCost = cost - Math.min(subsidyMax, cost * 0.4)
  const monthlySavings = Math.round(billAmount * 0.85)
  const paybackYears = (netCost / (monthlySavings * 12)).toFixed(1)

  return {
    kw: kw.toFixed(1),
    units: Math.round(units),
    cost: cost.toLocaleString('en-IN'),
    netCost: Math.round(netCost).toLocaleString('en-IN'),
    subsidyMax: subsidyMax.toLocaleString('en-IN'),
    monthlySavings: monthlySavings.toLocaleString('en-IN'),
    paybackYears
  }
}

export function detectLeadIntent(text) {
  const lower = text.toLowerCase()
  const intentKeywords = [
    'interested', 'want solar', 'get quote', 'enquiry', 'inquiry', 'book',
    'contact', 'call me', 'price quote', 'need solar', 'install solar',
    'விலை', 'தொடர்பு', 'வேண்டும்', 'தேவை'
  ]
  return intentKeywords.some(k => lower.includes(k))
}

export function extractBillAmount(text) {
  const patterns = [
    /₹\s*(\d[\d,]*)/,
    /rs\.?\s*(\d[\d,]*)/i,
    /(\d[\d,]+)\s*rupee/i,
    /bill\s*(?:is|of|around|about)?\s*₹?\s*(\d[\d,]+)/i,
    /(\d{3,5})\s*(?:bill|per month|monthly)/i,
  ]
  for (const p of patterns) {
    const m = text.match(p)
    if (m) return parseInt(m[1].replace(/,/g, ''))
  }
  return null
}

export { companyData }
# ☀️ KI Bharath Solar – AI Chatbot

A production-ready AI solar assistant chatbot built with React, Tailwind CSS, Framer Motion, and Google Gemini API.

## ✨ Features

| Feature | Details |
|---|---|
| 🤖 AI Chat | Gemini 1.5 Flash with RAG (company data) |
| 🌐 Languages | Tamil + English auto-detect |
| ⚡ Solar Calculator | EB bill → system size → cost → savings |
| 📋 Lead Collection | Conversational lead capture flow |
| 📊 Admin Dashboard | Lead management at `/admin` |
| 🎙️ Voice Input/Output | Web Speech API (Tamil + English) |
| 📱 WhatsApp Integration | Auto-fill message with lead info |
| 🪟 Embeddable Widget | Floating bubble for any website |
| 🏛️ Google Sheets | Free lead sync via Apps Script |

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
```bash
cp .env.example .env
```

Edit `.env` and add your **Gemini API key**:
```
VITE_GEMINI_API_KEY=your_key_here
```

Get a free key at: https://aistudio.google.com/app/apikey

### 3. Run locally
```bash
npm run dev
```

Open: http://localhost:5173

---

## 📁 Project Structure

```
solar-chatbot/
├── src/
│   ├── components/
│   │   ├── ChatUI.jsx          # Main chat container
│   │   ├── ChatBubble.jsx      # Message bubbles (user + bot)
│   │   ├── ChatHeader.jsx      # Header with actions
│   │   ├── ChatInput.jsx       # Input bar with voice
│   │   ├── FloatingWidget.jsx  # Embeddable bubble
│   │   ├── QuickReplies.jsx    # Suggestion pills
│   │   ├── TypingIndicator.jsx # Animated dots
│   │   └── VoiceButton.jsx     # Mic button
│   ├── hooks/
│   │   └── useChat.js          # Chat state + lead flow
│   ├── pages/
│   │   ├── ChatPage.jsx        # Standalone chat page
│   │   ├── AdminDashboard.jsx  # Lead management
│   │   └── WidgetEmbed.jsx     # Widget-only page
│   ├── rag/
│   │   ├── data.json           # Company knowledge base
│   │   └── retrieval.js        # RAG search + calculations
│   └── utils/
│       ├── gemini.js           # AI API integration
│       ├── leads.js            # Lead storage + integrations
│       └── voice.js            # Speech-to-text + TTS
├── google-apps-script.js       # For Google Sheets integration
├── vercel.json                 # Vercel deployment config
└── .env.example                # Environment variables template
```

---

## 🌐 Deploy to Vercel (Free)

### Option A: Vercel CLI
```bash
npm install -g vercel
vercel
# Follow prompts, set VITE_GEMINI_API_KEY in environment variables
```

### Option B: GitHub + Vercel Dashboard
1. Push code to GitHub
2. Go to vercel.com → Import project
3. Add environment variable: `VITE_GEMINI_API_KEY`
4. Deploy!

---

## 📊 Google Sheets Lead Sync (Optional)

1. Create a new Google Spreadsheet
2. Go to **Extensions → Apps Script**
3. Paste contents of `google-apps-script.js`
4. Click **Deploy → New deployment → Web App**
5. Set access to **"Anyone"**
6. Copy the Web App URL
7. Add to `.env`: `VITE_GOOGLE_SHEET_URL=https://script.google.com/...`

---

## 🪟 Embed as Widget on Any Website

Add this to any HTML page to show the floating chat bubble:

```html
<!-- Option 1: iframe embed -->
<iframe 
  src="https://your-domain.vercel.app/widget"
  style="position:fixed;bottom:0;right:0;width:420px;height:650px;border:none;z-index:9999"
></iframe>
```

---

## 🔧 Customization

### Update company data
Edit `src/rag/data.json` to update:
- Company name, phone, email
- Products and pricing
- Services list
- FAQ answers
- Branch locations

### Change AI model
In `src/utils/gemini.js`, update the model name:
```js
model: "gemini-1.5-flash"   // Fast, free tier
model: "gemini-1.5-pro"     // More capable, lower free quota
```

### Add more languages
In `src/rag/retrieval.js`, update `detectLanguage()` for Hindi, Telugu, etc.

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_GEMINI_API_KEY` | ✅ Yes | Google Gemini API key |
| `VITE_GOOGLE_SHEET_URL` | ❌ Optional | Apps Script Web App URL |
| `VITE_WHATSAPP_NUMBER` | ❌ Optional | WhatsApp number with country code |
| `VITE_EMAILJS_*` | ❌ Optional | EmailJS credentials |

---

## 📞 Support

**KI Bharath Solar Energies**  
Phone: +91 98765 43210  
Email: kibharathsolar@gmail.com  
Address: No. 12/45, Palayamkottai Road, Thoothukudi – 628002
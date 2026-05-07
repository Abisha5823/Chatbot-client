import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { startVoiceRecognition, stopSpeaking, isSpeechSupported } from '../utils/voice.js'

export default function VoiceButton({ onResult, lang = 'english', disabled }) {
  const [listening, setListening] = useState(false)
  const [unsupported, setUnsupported] = useState(false)
  const recognitionRef = useRef(null)

  const handleToggle = () => {
    if (!isSpeechSupported()) {
      setUnsupported(true)
      setTimeout(() => setUnsupported(false), 3000)
      return
    }

    if (listening) {
      recognitionRef.current?.stop()
      stopSpeaking()
      setListening(false)
      return
    }

    const speechLang = lang === 'tamil' ? 'ta-IN' : 'en-IN'
    setListening(true)

    recognitionRef.current = startVoiceRecognition(
      (transcript) => {
        setListening(false)
        onResult(transcript)
      },
      (err) => {
        setListening(false)
        console.warn('Voice error:', err)
      },
      speechLang
    )
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleToggle}
        disabled={disabled}
        className={`
          relative w-10 h-10 rounded-full flex items-center justify-center transition-all
          ${listening
            ? 'bg-red-500 text-white shadow-lg shadow-red-200'
            : 'bg-gray-100 text-gray-500 hover:bg-brand-50 hover:text-brand-600'
          }
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        `}
        title={listening ? 'Stop listening' : 'Voice input'}
      >
        {/* Pulse rings when listening */}
        <AnimatePresence>
          {listening && (
            <>
              {[1, 2].map(i => (
                <motion.span
                  key={i}
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full bg-red-400"
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Icon */}
        {listening ? (
          <motion.svg
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 relative z-10"
          >
            <rect x="6" y="4" width="4" height="16" rx="2"/>
            <rect x="14" y="4" width="4" height="16" rx="2"/>
          </motion.svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z"/>
          </svg>
        )}
      </motion.button>

      {/* Unsupported tooltip */}
      <AnimatePresence>
        {unsupported && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-3 py-1.5 whitespace-nowrap"
          >
            Voice not supported
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
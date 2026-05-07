import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import VoiceButton from './VoiceButton.jsx'

export default function ChatInput({ onSend, disabled, lang }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  const handleSubmit = () => {
    const text = value.trim()
    if (!text || disabled) return
    onSend(text)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleInput = (e) => {
    setValue(e.target.value)
    // Auto-resize
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = Math.min(el.scrollHeight, 120) + 'px'
    }
  }

  const hasValue = value.trim().length > 0

  return (
    <div className="px-3 py-3 border-t border-white/40 bg-white/40 backdrop-blur-sm">
      <div className="flex items-end gap-2">
        <VoiceButton
          onResult={(text) => { setValue(text); setTimeout(handleSubmit, 100) }}
          lang={lang}
          disabled={disabled}
        />

        {/* Input field */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={1}
            placeholder={lang === 'tamil' ? 'உங்கள் கேள்வியை தமிழில் கேளுங்கள்...' : 'Ask about solar, pricing, subsidy...'}
            className="w-full resize-none bg-white/80 border border-white/60 rounded-2xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-300 transition-all shadow-sm leading-relaxed"
            style={{ minHeight: '42px', maxHeight: '120px' }}
          />
        </div>

        {/* Send button */}
        <motion.button
          whileHover={{ scale: hasValue ? 1.08 : 1 }}
          whileTap={{ scale: hasValue ? 0.92 : 1 }}
          onClick={handleSubmit}
          disabled={!hasValue || disabled}
          className={`
            w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0
            ${hasValue && !disabled
              ? 'bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-200'
              : 'bg-gray-100 text-gray-300'
            }
          `}
        >
          <AnimatePresence mode="wait">
            {disabled ? (
              <motion.span key="loading" className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <motion.svg
                key="send"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <p className="text-center text-[10px] text-gray-400 mt-2">
        Powered by KI Bharath Solar Energies · Tamil & English supported
      </p>
    </div>
  )
}
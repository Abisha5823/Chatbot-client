import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from '../hooks/useChat.js'
import ChatBubble from './ChatBubble.jsx'
import ChatHeader from './ChatHeader.jsx'
import ChatInput from './ChatInput.jsx'
import TypingIndicator from './TypingIndicator.jsx'
import QuickReplies from './QuickReplies.jsx'
import { speak } from '../utils/voice.js'

export default function ChatUI({ isWidget = false }) {
  const { messages, isTyping, error, sendUserMessage, startLeadCollection, clearChat, lang } = useChat()
  const bottomRef = useRef(null)
  const prevMsgCount = useRef(messages.length)

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // TTS for new bot messages
  useEffect(() => {
    if (messages.length > prevMsgCount.current) {
      const last = messages[messages.length - 1]
      if (last?.role === 'assistant') {
        const ttsLang = lang === 'tamil' ? 'ta-IN' : 'en-IN'
        speak(last.content, ttsLang)
      }
    }
    prevMsgCount.current = messages.length
  }, [messages, lang])

  const showQuickReplies = messages.length <= 1 && !isTyping

  return (
    <motion.div
      initial={{ opacity: 0, y: isWidget ? 20 : 0, scale: isWidget ? 0.95 : 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`
        flex flex-col overflow-hidden
        ${isWidget
          ? 'w-[380px] h-[600px] rounded-3xl shadow-glow'
          : 'w-full h-full rounded-3xl shadow-glow'
        }
        glass
      `}
    >
      {/* Header */}
      <ChatHeader onClear={clearChat} isWidget={isWidget} />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <ChatBubble key={msg.id} message={msg} />
          ))}

          {isTyping && <TypingIndicator key="typing" />}
        </AnimatePresence>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto w-fit bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-2 mb-2 text-center"
            >
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Quick CTA bar */}
      <AnimatePresence>
        {!isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 py-1.5 flex justify-center gap-2"
          >
            <button
              onClick={startLeadCollection}
              className="text-xs font-semibold px-4 py-1.5 rounded-full bg-gradient-to-r from-solar-400 to-solar-500 text-white shadow-sm hover:shadow-md transition-shadow"
            >
              📋 Get Free Quote
            </button>
            <a
              href="tel:+91 9791744224"
              className="text-xs font-semibold px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100 transition-colors"
            >
              📞 Call Now
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick reply pills */}
      <AnimatePresence>
        {showQuickReplies && <QuickReplies visible onSelect={sendUserMessage} />}
      </AnimatePresence>

      {/* Input */}
      <ChatInput onSend={sendUserMessage} disabled={isTyping} lang={lang} />
    </motion.div>
  )
}
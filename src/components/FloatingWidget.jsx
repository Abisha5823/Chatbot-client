import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChatUI from './ChatUI.jsx'

export default function FloatingWidget() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.9 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className="origin-bottom-right"
          >
            <ChatUI isWidget />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble trigger */}
      <div className="relative">
        {/* Glow rings */}
        {!open && (
          <>
            <span className="absolute inset-0 rounded-full bg-brand-400 animate-ping opacity-30" />
            <span className="absolute inset-[-4px] rounded-full bg-brand-300/20 animate-pulse" />
          </>
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setOpen(v => !v)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-solar-500 text-white shadow-glow-solar flex items-center justify-center transition-all"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.svg
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </motion.svg>
            ) : (
              <motion.span
                key="chat"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="text-2xl"
              >
                ☀️
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Welcome tooltip */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ delay: 1.5, duration: 0.4 }}
            className="absolute bottom-16 right-0 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-xl whitespace-nowrap shadow-lg pointer-events-none"
          >
            💬 Chat with Solar Expert!
            <span className="absolute -bottom-1 right-5 w-2 h-2 bg-gray-900 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
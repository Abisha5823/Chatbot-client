import { motion } from 'framer-motion'

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      className="flex items-end gap-2.5 mb-3"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-solar-500 flex items-center justify-center flex-shrink-0 shadow-md">
        <span className="text-sm">🤖</span>
      </div>
      <div className="glass px-4 py-3.5 rounded-2xl rounded-bl-sm border border-white/80 shadow-sm">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 rounded-full bg-brand-400 block"
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
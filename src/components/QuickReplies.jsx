import { motion } from 'framer-motion'

const SUGGESTIONS = [
  { label: '💰 Solar cost?', text: 'What is the cost of solar installation?' },
  { label: '🌞 My EB bill is ₹2000', text: 'My monthly EB bill is ₹2000, what system do I need?' },
  { label: '🏛️ Subsidy info', text: 'Is there government subsidy for solar?' },
  { label: '📞 Free consultation', text: 'I am interested in solar, please contact me' },
  { label: '⚡ Power cut?', text: 'Will solar work during power cuts?' },
  { label: '🔋 Battery backup', text: 'Tell me about battery backup systems' },
]

export default function QuickReplies({ onSelect, visible }) {
  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar"
    >
      {SUGGESTIONS.map((s, i) => (
        <motion.button
          key={s.text}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(s.text)}
          className="flex-shrink-0 text-xs font-medium px-3.5 py-2 rounded-full glass border border-white/60 text-gray-700 hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50/50 transition-all shadow-sm whitespace-nowrap"
        >
          {s.label}
        </motion.button>
      ))}
    </motion.div>
  )
}
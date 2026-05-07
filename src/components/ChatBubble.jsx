import { motion } from 'framer-motion'

function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener" class="underline text-brand-500 hover:text-brand-700 font-medium">$1</a>')
    .replace(/^• /gm, '&nbsp;• ')
    .replace(/\n/g, '<br/>')
}

function CalcCard({ calcData }) {
  if (!calcData) return null
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-3 bg-gradient-to-br from-solar-50 to-brand-50 border border-solar-200 rounded-2xl p-4 text-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🌞</span>
        <span className="font-display font-bold text-solar-600 text-base">Solar Calculation</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'System Size', value: `${calcData.kw} kW`, icon: '⚡' },
          { label: 'Monthly Units', value: `~${calcData.units}`, icon: '📊' },
          { label: 'Total Cost', value: `₹${calcData.cost}`, icon: '💰' },
          { label: 'After Subsidy', value: `₹${calcData.netCost}`, icon: '🎁' },
          { label: 'Monthly Savings', value: `₹${calcData.monthlySavings}`, icon: '📈' },
          { label: 'Payback Period', value: `${calcData.paybackYears} yrs`, icon: '⏱️' },
        ].map(item => (
          <div key={item.label} className="bg-white/80 rounded-xl p-2.5 border border-white">
            <div className="text-xs text-gray-500 mb-0.5">{item.icon} {item.label}</div>
            <div className="font-bold text-gray-800 text-sm">{item.value}</div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', damping: 22, stiffness: 300 }}
      className={`flex items-end gap-2.5 mb-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-solar-500 flex items-center justify-center flex-shrink-0 shadow-md mb-1">
          <span className="text-sm">🤖</span>
        </div>
      )}

      <div className={`max-w-[78%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Bubble */}
        <div
          className={`
            px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
            ${isUser
              ? 'bg-gradient-to-br from-brand-600 to-brand-700 text-white rounded-br-sm'
              : 'glass text-gray-800 rounded-bl-sm border border-white/80'
            }
          `}
        >
          {isUser ? (
            <span>{message.content}</span>
          ) : (
            <span
              dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }}
              className="prose-sm"
            />
          )}
        </div>

        {/* Solar calculation card */}
        {!isUser && message.hasCalc && message.calcData && (
          <CalcCard calcData={message.calcData} />
        )}

        {/* WhatsApp CTA for leads */}
        {!isUser && message.waLink && (
          <motion.a
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            href={message.waLink}
            target="_blank"
            rel="noopener"
            className="mt-2 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-md transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M5.166 0C2.313 0 0 2.313 0 5.166v13.668C0 21.687 2.313 24 5.166 24h13.668C21.687 24 24 21.687 24 18.834V5.166C24 2.313 21.687 0 18.834 0H5.166z" opacity="0"/>
            </svg>
            Chat on WhatsApp
          </motion.a>
        )}

        {/* Timestamp */}
        <span className={`text-[10px] text-gray-400 mt-1 ${isUser ? 'text-right' : ''}`}>
          {message.timestamp?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  )
}
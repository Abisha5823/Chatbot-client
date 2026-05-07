import { motion } from 'framer-motion'
import ChatUI from '../components/ChatUI.jsx'
import FloatingWidget from '../components/FloatingWidget.jsx'
import { Link } from 'react-router-dom'

// Decorative background blobs
function Blob({ className }) {
  return <div className={`absolute rounded-full blur-3xl opacity-30 pointer-events-none ${className}`} />
}

export default function ChatPage() {
  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden flex flex-col">
      {/* Background decoration */}
      <Blob className="w-96 h-96 bg-brand-400 -top-20 -left-20" />
      <Blob className="w-80 h-80 bg-solar-400 top-1/2 -right-10" />
      <Blob className="w-64 h-64 bg-purple-400 bottom-10 left-1/3" />

      {/* Nav */}
      <nav className="relative z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-solar-500 flex items-center justify-center shadow-md">
            <span className="text-base">☀️</span>
          </div>
          <div>
            <span className="font-display font-bold text-gray-900 text-sm">KI Bharath Solar</span>
            <span className="hidden sm:inline text-xs text-gray-500 ml-1">Energies</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="tel:+919876543210" className="text-xs font-medium text-brand-600 hover:underline hidden sm:block">
            📞 +91 9791744224
          </a>
          
        </div>
      </nav>

      {/* Main content: 2-col on desktop, centered on mobile */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-4 gap-12">
        {/* Left: hero text (desktop only) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex flex-col gap-6 max-w-sm"
        >
          <div className="inline-flex items-center gap-2 bg-white/60 border border-white/60 px-4 py-2 rounded-full text-xs font-semibold text-brand-700 shadow-sm w-fit">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            AI Solar Assistant · Online 24/7
          </div>
          <h1 className="font-display text-5xl font-extrabold text-gray-900 leading-tight">
            Go Solar.<br />
            <span className="text-gradient">Save More.</span><br />
            Ask Anything.
          </h1>
          <p className="text-gray-600 text-base leading-relaxed">
            Get instant answers on solar pricing, subsidies, and calculations. 
            Available in <strong>Tamil & English</strong>.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: '💰', label: '₹60K/kW', sub: 'Starting Price' },
              { icon: '🏛️', label: '₹78K', sub: 'Subsidy Available' },
              { icon: '⚡', label: '500+', sub: 'Installations' },
            ].map(s => (
              <div key={s.label} className="glass rounded-2xl p-3 text-center border border-white/60">
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="font-bold text-gray-900 text-sm">{s.label}</div>
                <div className="text-[11px] text-gray-500">{s.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Chat UI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-[420px] h-[calc(100vh-140px)] max-h-[680px]"
        >
          <ChatUI />
        </motion.div>
      </div>

      {/* Floating widget demo (bottom right on desktop) */}
      <div className="hidden xl:block">
        <FloatingWidget />
      </div>
    </div>
  )
}
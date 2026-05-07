import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getLeads, updateLeadStatus, generateWhatsAppLink } from '../utils/leads.js'

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  converted: 'bg-green-100 text-green-700',
  lost: 'bg-gray-100 text-gray-500',
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLeads(getLeads())
  }, [])

  const refresh = () => setLeads(getLeads())

  const handleStatus = (id, status) => {
    updateLeadStatus(id, status)
    refresh()
  }

  const filtered = leads.filter(l => {
    const matchFilter = filter === 'all' || l.status === filter
    const matchSearch = !search || [l.name, l.phone, l.location].some(f =>
      f?.toLowerCase().includes(search.toLowerCase())
    )
    return matchFilter && matchSearch
  })

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    converted: leads.filter(l => l.status === 'converted').length,
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-solar-500 flex items-center justify-center">
            <span className="text-base">☀️</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-gray-900 text-base leading-tight">Lead Dashboard</h1>
            <p className="text-xs text-gray-500">KI Bharath Solar Energies</p>
          </div>
        </div>
        <Link to="/" className="text-sm font-medium text-brand-600 hover:underline">
          ← Back to Chat
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Leads', value: stats.total, icon: '👥', color: 'bg-brand-50 text-brand-700' },
            { label: 'New', value: stats.new, icon: '🔵', color: 'bg-blue-50 text-blue-700' },
            { label: 'Contacted', value: stats.contacted, icon: '📞', color: 'bg-yellow-50 text-yellow-700' },
            { label: 'Converted', value: stats.converted, icon: '✅', color: 'bg-green-50 text-green-700' },
          ].map(s => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl p-4 ${s.color} border border-current/10`}
            >
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-display font-bold">{s.value}</div>
              <div className="text-xs font-medium opacity-75">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <input
            type="text"
            placeholder="Search by name, phone, location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-200 bg-white"
          />
          <div className="flex gap-2">
            {['all', 'new', 'contacted', 'converted', 'lost'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors capitalize ${
                  filter === s ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">📋</div>
            <p className="font-medium">No leads yet</p>
            <p className="text-sm mt-1">Leads collected from the chatbot will appear here</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                    {['#', 'Name', 'Phone', 'Location', 'EB Bill', 'Type', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead, idx) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">{idx + 1}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{lead.name || '—'}</td>
                      <td className="px-4 py-3 text-gray-700 font-mono">{lead.phone || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{lead.location || '—'}</td>
                      <td className="px-4 py-3 font-semibold text-solar-600">{lead.ebBill ? `₹${lead.ebBill}` : '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{lead.type || '—'}</td>
                      <td className="px-4 py-3">
                        <select
                          value={lead.status}
                          onChange={e => handleStatus(lead.id, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 outline-none cursor-pointer ${STATUS_COLORS[lead.status] || STATUS_COLORS.new}`}
                        >
                          {['new', 'contacted', 'converted', 'lost'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(lead.timestamp).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={generateWhatsAppLink(lead)}
                          target="_blank"
                          rel="noopener"
                          className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          WhatsApp
                        </a>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {filtered.map((lead, idx) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.04 }}
                  className="p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{lead.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-500 font-mono">{lead.phone || '—'}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[lead.status]}`}>
                      {lead.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                    <span>📍 {lead.location || '—'}</span>
                    <span>💡 ₹{lead.ebBill || '—'}</span>
                    <span>🏠 {lead.type || '—'}</span>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={lead.status}
                      onChange={e => handleStatus(lead.id, e.target.value)}
                      className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none"
                    >
                      {['new', 'contacted', 'converted', 'lost'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <a
                      href={generateWhatsAppLink(lead)}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-1 bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                    >
                      📱 WA
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {leads.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-4">
            Showing {filtered.length} of {leads.length} leads · Data stored locally
          </p>
        )}
      </div>
    </div>
  )
}
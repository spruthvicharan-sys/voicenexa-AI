import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function SessionCard({ session, onClick }) {
  const date = new Date(session.updated_at)
  const msgCount = session.message_count

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      onClick={onClick}
      className="glass-card rounded-2xl p-5 border border-slate-100 hover:border-blue-200 cursor-pointer transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-navy">
              {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="text-xs text-slate-400">
              {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
        <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-2.5 py-1 rounded-lg">
          {msgCount} msg{msgCount !== 1 ? 's' : ''}
        </span>
      </div>
      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{session.preview}</p>
      <div className="mt-3 flex items-center gap-1 text-blue-500 text-xs font-medium">
        View conversation
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
    </motion.div>
  )
}

function SessionDetail({ session, onClose }) {
  const messages = session.messages || []

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="glass-card rounded-3xl border border-blue-100 overflow-hidden flex flex-col h-full"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-blue-50 flex items-center justify-between flex-shrink-0">
        <div>
          <div className="font-semibold text-navy text-sm">
            {new Date(session.updated_at).toLocaleDateString(undefined, {
              weekday: 'long', month: 'long', day: 'numeric'
            })}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">{messages.length} messages</div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">No messages in this session</div>
        ) : messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
              msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gradient-to-br from-blue-500 to-blue-700 text-white'
            }`}>
              {msg.role === 'user' ? 'U' : 'N'}
            </div>
            <div className={`max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-tr-sm'
                : 'bg-white border border-blue-100 text-navy rounded-tl-sm'
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSession, setSelectedSession] = useState(null)
  const [loadingSession, setLoadingSession] = useState(false)

  useEffect(() => {
    fetchSessions()
  }, [])

  async function fetchSessions() {
    try {
      setLoading(true)
      const { data } = await axios.get(`${API_URL}/api/sessions`)
      setSessions(data.sessions || [])
    } catch {
      setError('Could not load sessions. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  async function openSession(sessionId) {
    try {
      setLoadingSession(true)
      const { data } = await axios.get(`${API_URL}/api/sessions/${sessionId}`)
      setSelectedSession(data)
    } catch {
      setError('Could not load session details.')
    } finally {
      setLoadingSession(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-700 text-navy">Conversation History</h1>
            <p className="text-slate-400 text-sm mt-1">Review your past sessions with Nexa</p>
          </div>
          <button
            onClick={fetchSessions}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Refresh
          </button>
        </motion.div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4 text-sm text-rose-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h3 className="font-display text-xl font-700 text-navy mb-2">No conversations yet</h3>
            <p className="text-slate-400 text-sm">Start a voice session to see your history here</p>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Session list */}
            <div className={`${selectedSession ? 'lg:col-span-2' : 'lg:col-span-5'}`}>
              <div className={`${selectedSession ? 'grid grid-cols-1' : 'grid sm:grid-cols-2 lg:grid-cols-3'} gap-5`}>
                {sessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onClick={() => openSession(session.id)}
                  />
                ))}
              </div>
            </div>

            {/* Session detail */}
            <AnimatePresence>
              {selectedSession && (
                <div className="lg:col-span-3" style={{ height: '70vh' }}>
                  {loadingSession ? (
                    <div className="h-full rounded-3xl bg-slate-100 animate-pulse" />
                  ) : (
                    <SessionDetail
                      session={selectedSession}
                      onClose={() => setSelectedSession(null)}
                    />
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

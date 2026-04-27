import React, { useState, useCallback, Suspense, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import VoiceOrb from '../components/VoiceOrb'
import WaveformVisualizer from '../components/WaveformVisualizer'
import ChatPanel from '../components/ChatPanel'
import { useVoiceSession } from '../hooks/useVoiceSession'
import { useSettings } from '../hooks/useSettings'

export default function AssistantPage() {
  const [messages, setMessages] = useState([])
  const [audioUnlocked, setAudioUnlocked] = useState(false)
  const audioContextRef = useRef(null)
  const { settings } = useSettings()

  const unlockAudio = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }
      if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume()
      const buffer = audioContextRef.current.createBuffer(1, 1, 22050)
      const source = audioContextRef.current.createBufferSource()
      source.buffer = buffer
      source.connect(audioContextRef.current.destination)
      source.start(0)
      setAudioUnlocked(true)
    } catch { setAudioUnlocked(true) }
  }, [])

  const handleMessage = useCallback((msg) => {
    setMessages(prev => [...prev, msg])
  }, [])

  const {
    voiceState,
    isConnected,
    isListeningMode,
    error,
    wakeWordDetected,
    analyser,
    connect,
    disconnect,
    toggleContinuousMode,
  } = useVoiceSession({ settings, onMessage: handleMessage })

  const stateConfig = {
    idle:      { label: 'Ready to listen',  color: 'text-slate-400',  dot: 'bg-slate-300',                ring: 'border-slate-200' },
    listening: { label: 'Listening...',      color: 'text-blue-600',   dot: 'bg-blue-500 animate-pulse',   ring: 'border-blue-400' },
    thinking:  { label: 'Thinking...',       color: 'text-purple-600', dot: 'bg-purple-500',               ring: 'border-purple-400' },
    speaking:  { label: 'Speaking...',       color: 'text-sky-600',    dot: 'bg-sky-500 animate-pulse',    ring: 'border-sky-400' },
  }
  const stateInfo = stateConfig[voiceState] || stateConfig.idle

  return (
    <div className="min-h-screen bg-hero-gradient pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Audio unlock banner */}
        <AnimatePresence>
          {!audioUnlocked && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <button
                onClick={unlockAudio}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-lg transition-all duration-200 hover:scale-[1.01]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
                👆 Click here first to enable voice audio
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {audioUnlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-emerald-700">Audio enabled — Nexa will speak back to you!</span>
          </motion.div>
        )}

        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl font-700 text-navy">Live Assistant</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time voice conversation with Nexa</p>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4 flex items-start gap-3"
            >
              <svg className="text-rose-500 flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <div>
                <div className="text-sm font-semibold text-rose-700">Error</div>
                <div className="text-sm text-rose-600 mt-0.5">{error}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-5 gap-6 items-start">
          {/* Left: Voice interface */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-3xl p-8 flex flex-col items-center gap-6 border border-blue-100"
            >
              {/* Status bar */}
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-300'}`} />
                  <span className="text-xs text-slate-400">{isConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${stateInfo.dot}`} />
                  <span className={`text-xs font-medium ${stateInfo.color}`}>{stateInfo.label}</span>
                </div>
              </div>

              {/* 3D Orb */}
              <Suspense fallback={<div className="w-52 h-52 rounded-full bg-blue-50 animate-pulse" />}>
                <VoiceOrb voiceState={voiceState} size={220} />
              </Suspense>

              {/* Waveform */}
              <div className="w-full">
                <WaveformVisualizer
                  analyser={analyser}
                  isActive={voiceState === 'listening'}
                  state={voiceState}
                  barCount={32}
                />
              </div>

              {/* BIG START/STOP BUTTON */}
              <div className="w-full flex flex-col items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={async () => {
                    if (!audioUnlocked) { alert('Please click the blue banner first to enable audio!'); return }
                    if (!isConnected) await connect()
                    toggleContinuousMode()
                  }}
                  className={`w-full py-5 rounded-2xl font-display font-700 text-lg transition-all duration-300 shadow-lg ${
                    isListeningMode
                      ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
                  }`}
                >
                  {isListeningMode ? (
                    <span className="flex items-center justify-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
                      Stop Listening
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                        <line x1="12" y1="19" x2="12" y2="23"/>
                        <line x1="8" y1="23" x2="16" y2="23"/>
                      </svg>
                      Start Talking to Nexa
                    </span>
                  )}
                </motion.button>

                {isListeningMode && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-center text-slate-400"
                  >
                    Just speak naturally — Nexa detects your voice automatically
                  </motion.p>
                )}
              </div>

              {/* Disconnect */}
              {isConnected && (
                <button
                  onClick={disconnect}
                  className="w-full text-sm font-medium py-2.5 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 transition-all duration-200"
                >
                  Disconnect Session
                </button>
              )}
            </motion.div>

            {/* Wake word hint */}
            {isListeningMode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-2xl px-5 py-4 border border-blue-50 text-center"
              >
                <AnimatePresence mode="wait">
                  {wakeWordDetected ? (
                    <motion.div
                      key="detected"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                      <span className="text-sm font-semibold text-blue-600">Wake word detected!</span>
                    </motion.div>
                  ) : (
                    <motion.p key="hint" className="text-xs text-slate-400">
                      Say <strong className="text-blue-500">"Hey Nexa"</strong> or just start speaking
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Right: Chat panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3 glass-card rounded-3xl border border-blue-100 overflow-hidden"
            style={{ height: '75vh' }}
          >
            <ChatPanel
              messages={messages}
              isThinking={voiceState === 'thinking'}
              wakeWordDetected={wakeWordDetected}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

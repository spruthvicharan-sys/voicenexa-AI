import React from 'react'
import { motion } from 'framer-motion'

const stateIcons = {
  idle: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  ),
  listening: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="2"/>
      <line x1="8" y1="23" x2="16" y2="23" stroke="white" strokeWidth="2"/>
    </svg>
  ),
  thinking: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
    </svg>
  ),
  speaking: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
    </svg>
  ),
}

const stateLabels = {
  idle: 'Tap to speak',
  listening: 'Listening…',
  thinking: 'Thinking…',
  speaking: 'Speaking…',
}

export default function MicButton({ voiceState = 'idle', onClick, disabled = false }) {
  const isActive = voiceState !== 'idle'

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Pulse rings behind button */}
      <div className="relative">
        {voiceState === 'listening' && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full bg-blue-400/20"
              animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-blue-400/15"
              animate={{ scale: [1, 2.2], opacity: [0.3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
            />
          </>
        )}
        {voiceState === 'speaking' && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.3) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeOut' }}
          />
        )}

        <motion.button
          whileHover={!disabled ? { scale: 1.06 } : {}}
          whileTap={!disabled ? { scale: 0.94 } : {}}
          onClick={onClick}
          disabled={disabled}
          className={`relative w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          } mic-${voiceState}`}
        >
          {voiceState === 'thinking' ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            >
              {stateIcons[voiceState]}
            </motion.div>
          ) : (
            stateIcons[voiceState] || stateIcons.idle
          )}
        </motion.button>
      </div>

      {/* State label */}
      <motion.span
        key={voiceState}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-sm font-medium tracking-wide ${
          voiceState === 'listening' ? 'text-blue-600' :
          voiceState === 'thinking'  ? 'text-purple-600' :
          voiceState === 'speaking'  ? 'text-sky-600' :
          'text-slate-400'
        }`}
      >
        {stateLabels[voiceState]}
      </motion.span>
    </div>
  )
}

import React from 'react'
import { motion } from 'framer-motion'

const steps = [
  {
    id: 'stt',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
      </svg>
    ),
    label: 'User Voice',
    title: 'Voice Capture',
    desc: 'Web Audio API captures microphone input in real-time with noise suppression.',
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
  },
  {
    id: 'whisper',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    label: 'Whisper STT',
    title: 'Speech to Text',
    desc: 'OpenAI Whisper model transcribes audio to text with high accuracy.',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-700',
  },
  {
    id: 'claude',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    label: 'Claude LLM',
    title: 'AI Intelligence',
    desc: 'Claude processes the query with full conversation memory and generates a natural response.',
    color: 'from-orange-400 to-rose-500',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
  },
  {
    id: 'elevenlabs',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
      </svg>
    ),
    label: 'ElevenLabs TTS',
    title: 'Voice Synthesis',
    desc: 'ElevenLabs converts the response into lifelike speech with natural prosody.',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
  },
  {
    id: 'output',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
      </svg>
    ),
    label: 'Audio Reply',
    title: 'Audio Playback',
    desc: 'The synthesized voice response plays back in real-time through the browser.',
    color: 'from-sky-500 to-blue-600',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    text: 'text-sky-700',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
}

export default function PipelineFlow({ compact = false }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className={`flex ${compact ? 'flex-row flex-wrap justify-center' : 'flex-col md:flex-row'} items-center gap-0`}
    >
      {steps.map((step, i) => (
        <React.Fragment key={step.id}>
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(37,99,235,0.15)' }}
            className={`glass-card rounded-2xl p-5 transition-all duration-300 ${
              compact ? 'w-36' : 'w-full md:w-44'
            } flex-shrink-0`}
          >
            <div className={`w-10 h-10 rounded-xl ${step.bg} ${step.text} flex items-center justify-center mb-3`}>
              {step.icon}
            </div>
            <div className={`text-xs font-semibold uppercase tracking-wider ${step.text} mb-1`}>
              {step.label}
            </div>
            <div className="text-sm font-bold text-navy mb-1">{step.title}</div>
            {!compact && (
              <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
            )}
          </motion.div>

          {/* Arrow connector */}
          {i < steps.length - 1 && (
            <motion.div
              variants={cardVariants}
              className="flex items-center justify-center mx-1 flex-shrink-0"
            >
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="flex items-center"
              >
                <div className="w-6 h-0.5 bg-gradient-to-r from-blue-300 to-blue-500" />
                <div className="w-0 h-0 border-l-8 border-t-4 border-b-4 border-l-blue-500 border-t-transparent border-b-transparent" />
              </motion.div>
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </motion.div>
  )
}

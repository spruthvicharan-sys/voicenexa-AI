import React from 'react'
import { motion } from 'framer-motion'
import PipelineFlow from '../components/PipelineFlow'

const stages = [
  {
    num: '01',
    title: 'Voice Capture',
    tech: 'Web Audio API',
    color: 'blue',
    description: 'The browser captures microphone audio using the Web Audio API with echo cancellation and noise suppression enabled. Audio is recorded as WebM chunks via MediaRecorder.',
    details: ['16kHz mono sampling', 'Echo cancellation', 'Noise suppression', 'Real-time waveform visualization'],
  },
  {
    num: '02',
    title: 'WebSocket Streaming',
    tech: 'FastAPI WebSockets',
    color: 'sky',
    description: 'Audio chunks stream via a persistent WebSocket connection to the FastAPI backend. The connection is established per session with a unique session ID for isolated memory.',
    details: ['Binary audio frames', 'Bi-directional messaging', 'JSON status updates', 'Session-scoped connections'],
  },
  {
    num: '03',
    title: 'Speech-to-Text',
    tech: 'OpenAI Whisper',
    color: 'violet',
    description: "Whisper's neural network transcribes the audio stream into text. The model handles multiple accents, background noise, and varying speech speeds with high accuracy.",
    details: ['Whisper base/small model', 'Language: English', 'Wake word detection', '~0.3s transcription time'],
  },
  {
    num: '04',
    title: 'AI Response Generation',
    tech: 'Claude (Anthropic)',
    color: 'orange',
    description: "Claude processes the transcribed text with full conversation history to generate a contextually aware, natural-language response optimized for voice output.",
    details: ['Multi-turn memory (10 turns)', 'Claude claude-sonnet-4-20250514 model', 'Voice-optimized prompting', '~0.8s generation time'],
  },
  {
    num: '05',
    title: 'Voice Synthesis',
    tech: 'ElevenLabs',
    color: 'emerald',
    description: 'The text response is converted to lifelike speech using ElevenLabs. Voice style and speed are configurable per user preference.',
    details: ['Multiple voice models', 'Adjustable speed (0.5–2x)', 'MP3 audio output', '~0.5s synthesis time'],
  },
  {
    num: '06',
    title: 'Audio Playback',
    tech: 'Web Audio API',
    color: 'teal',
    description: 'The generated MP3 audio is returned over the WebSocket as base64, decoded in the browser, and played back instantly. The UI transitions to "Speaking" state.',
    details: ['Base64 audio transfer', 'Browser native decode', 'Auto-play with user gesture', 'Visual speaking state'],
  },
]

const colorMap = {
  blue:   { badge: 'bg-blue-100 text-blue-700',   border: 'border-blue-200',   num: 'text-blue-300' },
  sky:    { badge: 'bg-sky-100 text-sky-700',     border: 'border-sky-200',    num: 'text-sky-300' },
  violet: { badge: 'bg-violet-100 text-violet-700', border: 'border-violet-200', num: 'text-violet-300' },
  orange: { badge: 'bg-orange-100 text-orange-700', border: 'border-orange-200', num: 'text-orange-300' },
  emerald:{ badge: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200', num: 'text-emerald-300' },
  teal:   { badge: 'bg-teal-100 text-teal-700',   border: 'border-teal-200',   num: 'text-teal-300' },
}

export default function PipelinePage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Architecture</span>
          <h1 className="font-display text-4xl sm:text-5xl font-700 text-navy mt-2 mb-4">
            Voice Pipeline
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Six-stage real-time pipeline from spoken word to AI voice response in under two seconds.
          </p>
        </motion.div>

        {/* Flow diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 border border-blue-100 mb-16 overflow-x-auto"
        >
          <PipelineFlow compact={false} />
        </motion.div>

        {/* Latency bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 border border-blue-100 mb-16"
        >
          <h3 className="font-display font-700 text-navy mb-5">Estimated Latency Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: 'Voice Capture',    ms: 100,  pct: 5,  color: 'bg-blue-500' },
              { label: 'Whisper STT',       ms: 300,  pct: 18, color: 'bg-violet-500' },
              { label: 'Claude Response',   ms: 800,  pct: 47, color: 'bg-orange-500' },
              { label: 'ElevenLabs TTS',    ms: 500,  pct: 30, color: 'bg-emerald-500' },
            ].map((item, i) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-600 font-medium">{item.label}</span>
                  <span className="text-slate-400 font-mono">~{item.ms}ms</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                    className={`h-full ${item.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <span className="text-sm font-display font-700 gradient-text">Total ≈ 1.7s</span>
            </div>
          </div>
        </motion.div>

        {/* Stage detail cards */}
        <h2 className="font-display text-2xl font-700 text-navy mb-8">Stage Details</h2>
        <div className="space-y-5">
          {stages.map((stage, i) => {
            const c = colorMap[stage.color] || colorMap.blue
            return (
              <motion.div
                key={stage.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`glass-card rounded-2xl p-6 border ${c.border} flex gap-6`}
              >
                <div className={`font-display text-5xl font-800 ${c.num} leading-none flex-shrink-0 w-16`}>
                  {stage.num}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display text-lg font-700 text-navy">{stage.title}</h3>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${c.badge}`}>
                      {stage.tech}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{stage.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {stage.details.map(d => (
                      <span key={d} className="text-xs bg-slate-50 border border-slate-200 text-slate-500 px-3 py-1 rounded-lg">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

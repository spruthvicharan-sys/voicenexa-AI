import React, { Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import VoiceOrb from '../components/VoiceOrb'
import PipelineFlow from '../components/PipelineFlow'
import FeatureCard from '../components/FeatureCard'

const features = [
  {
    color: 'blue',
    title: 'Wake Word Detection',
    description: 'Say "Hey Nexa" to activate hands-free. Seamlessly starts listening without pressing any button.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>,
  },
  {
    color: 'violet',
    title: 'Real-Time Streaming',
    description: 'WebSocket-powered pipeline delivers transcription and AI responses with sub-second latency.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  },
  {
    color: 'emerald',
    title: 'Multi-Turn Memory',
    description: 'Remembers the last 10 conversation turns so every reply is contextually aware and coherent.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  },
  {
    color: 'orange',
    title: 'Whisper Transcription',
    description: "OpenAI's Whisper model delivers accurate speech-to-text across accents, speeds, and noise levels.",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  },
  {
    color: 'blue',
    title: 'Claude Intelligence',
    description: "Powered by Anthropic's Claude for nuanced, helpful, and natural conversational responses.",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  },
  {
    color: 'sky',
    title: 'ElevenLabs Voice',
    description: 'Hyper-realistic voice synthesis from ElevenLabs produces responses indistinguishable from a real person.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>,
  },
  {
    color: 'rose',
    title: 'Low-Latency Pipeline',
    description: 'Optimized FastAPI backend processes voice through all three AI stages in under two seconds.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  },
  {
    color: 'emerald',
    title: 'Conversation History',
    description: 'Every session is saved with a searchable log of messages so you can revisit past conversations.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  },
]

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen pt-24 pb-16 flex items-center bg-hero-gradient overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-blue-50/60 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-200/20 rounded-full blur-2xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text side */}
            <div className="relative z-10">
              

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display text-5xl sm:text-6xl lg:text-7xl font-800 leading-[1.05] tracking-tight text-navy mb-6"
              >
                Voice
                <span className="gradient-text">nexa</span>
                {' '}AI
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-2xl sm:text-3xl font-display font-500 text-slate-500 mb-4 leading-tight"
              >
                Speak. Think. Respond —<br />
                <span className="text-blue-600">in Real Time.</span>
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-base text-slate-500 leading-relaxed mb-10 max-w-lg"
              >
                Real-time voice conversations powered by the world's best AI stack.
                Say "Hey Nexa" and experience the future of voice interfaces.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/assistant" className="btn-primary">
                  Start Voice Session
                </Link>
                <Link to="/pipeline" className="btn-secondary">
                  View Pipeline
                </Link>
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-12 flex gap-8"
              >
                {[
                  { value: '<2s', label: 'Response latency' },
                  { value: '99%', label: 'Accuracy' },
                  { value: '10+', label: 'Voice styles' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="text-2xl font-display font-700 gradient-text">{stat.value}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Orb side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="flex justify-center items-center relative"
            >
              <Suspense fallback={<div className="w-80 h-80 rounded-full bg-blue-50 animate-pulse" />}>
                <VoiceOrb voiceState="idle" size={460} />
              </Suspense>

              {/* Floating labels around orb */}
              
              
              
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Pipeline Preview ─────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">
              How it works
            </span>
            <h2 className="font-display text-4xl font-700 text-navy mt-2 mb-4">
              The Voice Pipeline
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Every spoken word travels through a three-stage AI pipeline in under two seconds.
            </p>
          </motion.div>
          <div className="overflow-x-auto pb-4">
            <PipelineFlow />
          </div>
        </div>
      </section>

      {/* ── Features Grid ────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-white to-blue-50/40">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">
              Everything you need
            </span>
            <h2 className="font-display text-4xl font-700 text-navy mt-2 mb-4">
              Built for real conversations
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Voicenexa combines the best AI models with a seamless real-time pipeline.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-12 sm:p-16 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white blur-2xl" />
            </div>
            <div className="relative z-10">
              <h2 className="font-display text-4xl sm:text-5xl font-700 text-white mb-4">
                Ready to talk?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-lg mx-auto">
                Start your first voice session now. No setup required — just allow microphone access and say hello.
              </p>
              <Link
                to="/assistant"
                className="inline-block bg-white text-blue-700 font-semibold px-10 py-4 rounded-2xl text-base hover:bg-blue-50 transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl"
              >
                Launch Assistant →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 2C8 2 4 5 4 9C4 11.2 5.8 13 8 13C10.2 13 12 11.2 12 9C12 5 8 2 8 2Z" fill="white"/>
              </svg>
            </div>
            <span className="text-sm font-display font-600 text-navy">Voicenexa AI</span>
          </div>
          <p className="text-xs text-slate-400">
            Built with Whisper · Claude · ElevenLabs · FastAPI · React
          </p>
        </div>
      </footer>
    </div>
  )
}

import React from 'react'
import { motion } from 'framer-motion'
import { useSettings } from '../hooks/useSettings'

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
      <div>
        <div className="text-sm font-semibold text-navy">{label}</div>
        {description && <div className="text-xs text-slate-400 mt-0.5">{description}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
          checked ? 'bg-blue-600' : 'bg-slate-200'
        }`}
      >
        <motion.div
          animate={{ x: checked ? 24 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
        />
      </button>
    </div>
  )
}

function Slider({ value, onChange, label, description, min = 0.5, max = 2, step = 0.1, format }) {
  return (
    <div className="py-4 border-b border-slate-100 last:border-0">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-semibold text-navy">{label}</div>
          {description && <div className="text-xs text-slate-400 mt-0.5">{description}</div>}
        </div>
        <span className="text-sm font-mono text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 bg-blue-100 rounded-full appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1.5">
        <span>Slower</span><span>Faster</span>
      </div>
    </div>
  )
}

function Select({ value, onChange, label, description, options }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
      <div>
        <div className="text-sm font-semibold text-navy">{label}</div>
        {description && <div className="text-xs text-slate-400 mt-0.5">{description}</div>}
      </div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="text-sm bg-blue-50 border border-blue-200 text-blue-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

function Card({ title, description, icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 border border-slate-100"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="font-display font-700 text-navy text-base">{title}</h3>
          {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
        </div>
      </div>
      {children}
    </motion.div>
  )
}

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings()
  const update = (key, val) => updateSettings({ ...settings, [key]: val })

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="font-display text-4xl font-700 text-navy">Settings</h1>
          <p className="text-slate-400 mt-2">Customize your Voicenexa experience</p>
        </motion.div>

        <div className="space-y-5">

          {/* Voice Output */}
          <Card
            title="Voice Output"
            description="Control how Nexa speaks to you"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
            }
          >
            <Slider
              label="Voice Speed"
              description="How fast Nexa speaks"
              value={settings.voiceSpeed}
              onChange={v => update('voiceSpeed', v)}
              format={v => `${v}x`}
            />
            <Select
              label="Voice Style"
              description="Choose Nexa's voice"
              value={settings.voiceStyle}
              onChange={v => update('voiceStyle', v)}
              options={[
                { value: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel — Calm & Natural' },
                { value: 'nPczCjzI2devNBz1zQrb', label: 'Brian — Deep & Resonant' },
                { value: 'EXAVITQu4vr4xnSDxMaL', label: 'Bella — Soft & Warm' },
                { value: 'ErXwobaYiN019PkySvjV', label: 'Antoni — Friendly' },
                { value: 'cgSgspJ2msm6clMCkdW9', label: 'Jessica — Bright & Playful' },
                { value: 'onwK4e9ZLuTAKqWW03F9', label: 'Daniel — British & Formal' },
              ]}
            />
            <Toggle
              label="Auto Play Responses"
              description="Automatically play Nexa's voice replies"
              checked={settings.autoplay}
              onChange={v => update('autoplay', v)}
            />
          </Card>

          {/* Listening */}
          <Card
            title="Listening"
            description="Control how Nexa listens to you"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
              </svg>
            }
          >
            <Toggle
              label="Wake Word Detection"
              description={`Say "Hey Nexa" to activate hands-free`}
              checked={settings.wakeWordEnabled}
              onChange={v => update('wakeWordEnabled', v)}
            />
          </Card>

          {/* Memory */}
          <Card
            title="Conversation Memory"
            description="Control how Nexa remembers your conversations"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
            }
          >
            <Toggle
              label="Remember Conversation"
              description="Keep last 10 messages for context"
              checked={settings.memoryEnabled}
              onChange={v => update('memoryEnabled', v)}
            />
          </Card>

          {/* About */}
          <Card
            title="About Voicenexa AI"
            description="Powered by the best AI stack"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            }
          >
            <div className="flex flex-wrap gap-2 pt-2">
              {[
                { label: 'Whisper', desc: 'Speech to Text' },
                { label: 'Groq', desc: 'AI Intelligence' },
                { label: 'ElevenLabs', desc: 'Voice Synthesis' },
                { label: 'FastAPI', desc: 'Backend' },
                { label: 'React', desc: 'Frontend' },
              ].map(tech => (
                <div key={tech.label} className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 text-center">
                  <div className="text-xs font-semibold text-blue-700">{tech.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{tech.desc}</div>
                </div>
              ))}
            </div>
          </Card>

        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-slate-400 mt-8"
        >
          Settings are saved automatically
        </motion.p>

      </div>
    </div>
  )
}

import React from 'react'
import { motion } from 'framer-motion'

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-blue-50 last:border-0">
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

function Slider({ value, onChange, label, min = 0.5, max = 2, step = 0.1, format }) {
  return (
    <div className="py-4 border-b border-blue-50 last:border-0">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-navy">{label}</div>
        <span className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 bg-blue-100 rounded-full appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

function Select({ value, onChange, label, options }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-blue-50 last:border-0">
      <div className="text-sm font-semibold text-navy">{label}</div>
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

export default function SettingsPanel({ settings, onChange }) {
  const update = (key, val) => onChange({ ...settings, [key]: val })

  return (
    <div className="space-y-6">
      {/* Voice Settings */}
      <div className="glass-card rounded-2xl p-6 border border-slate-100">
        <h3 className="font-display font-700 text-navy mb-1">Voice Settings</h3>
        <p className="text-xs text-slate-400 mb-4">Control voice output behavior</p>
        <Slider
          label="Voice Speed"
          value={settings.voiceSpeed}
          onChange={v => update('voiceSpeed', v)}
          min={0.5} max={2} step={0.1}
          format={v => `${v}x`}
        />
        <Select
          label="Voice Style"
          value={settings.voiceStyle}
          onChange={v => update('voiceStyle', v)}
          options={[
            { value: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel (Calm)' },
            { value: 'AZnzlk1XvdvUeBnXmlld', label: 'Domi (Strong)' },
            { value: 'EXAVITQu4vr4xnSDxMaL', label: 'Bella (Soft)' },
            { value: 'ErXwobaYiN019PkySvjV', label: 'Antoni (Warm)' },
            { value: 'MF3mGyEYCl7XYWbV9V6O', label: 'Elli (Bright)' },
          ]}
        />
      </div>

      {/* Features */}
      <div className="glass-card rounded-2xl p-6 border border-slate-100">
        <h3 className="font-display font-700 text-navy mb-1">Features</h3>
        <p className="text-xs text-slate-400 mb-4">Toggle assistant capabilities</p>
        <Toggle
          label="Wake Word Detection"
          description='Activate by saying "Hey Nexa"'
          checked={settings.wakeWordEnabled}
          onChange={v => update('wakeWordEnabled', v)}
        />
        <Toggle
          label="Conversation Memory"
          description="Remember previous messages in this session"
          checked={settings.memoryEnabled}
          onChange={v => update('memoryEnabled', v)}
        />
        <Toggle
          label="Audio Autoplay"
          description="Automatically play AI voice responses"
          checked={settings.autoplay}
          onChange={v => update('autoplay', v)}
        />
      </div>
    </div>
  )
}

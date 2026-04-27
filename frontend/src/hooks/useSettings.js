import { useState, useEffect } from 'react'

const DEFAULT_SETTINGS = {
  voiceSpeed: 1.0,
  voiceStyle: '21m00Tcm4TlvDq8ikWAM',
  wakeWordEnabled: true,
  memoryEnabled: true,
  autoplay: true,
}

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('voicenexa_settings')
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
    } catch {
      return DEFAULT_SETTINGS
    }
  })

  const updateSettings = (newSettings) => {
    setSettings(newSettings)
    try {
      localStorage.setItem('voicenexa_settings', JSON.stringify(newSettings))
    } catch {}
  }

  return { settings, updateSettings }
}

import { useState, useRef, useCallback, useEffect } from 'react'

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const SILENCE_THRESHOLD = 15      // volume level below which = silence
const SILENCE_DURATION  = 1500    // ms of silence before auto-stop
const MIN_SPEECH_DURATION = 300   // ms minimum to count as speech

export function useVoiceSession({ settings, onMessage }) {
  const [voiceState,       setVoiceState]       = useState('idle')
  const [isConnected,      setIsConnected]       = useState(false)
  const [error,            setError]             = useState(null)
  const [wakeWordDetected, setWakeWordDetected]  = useState(false)
  const [isListeningMode,  setIsListeningMode]   = useState(false) // continuous mode on/off

  const wsRef              = useRef(null)
  const mediaRecorderRef   = useRef(null)
  const audioChunksRef     = useRef([])
  const audioContextRef    = useRef(null)
  const analyserRef        = useRef(null)
  const sessionIdRef       = useRef(null)
  const streamRef          = useRef(null)
  const isRecordingRef     = useRef(false)
  const silenceTimerRef    = useRef(null)
  const speechStartRef     = useRef(null)
  const vadIntervalRef     = useRef(null)
  const autoplayRef        = useRef(settings?.autoplay ?? true)
  const audioQueueRef      = useRef([])
  const isPlayingRef       = useRef(false)
  const isListeningModeRef = useRef(false)

  useEffect(() => { autoplayRef.current = settings?.autoplay ?? true }, [settings?.autoplay])
  useEffect(() => { isListeningModeRef.current = isListeningMode }, [isListeningMode])

  // ── Connect WebSocket ──────────────────────────────────────────────────────
  const connect = useCallback(async () => {
    try {
      setError(null)
      const res = await fetch(`${API_URL}/api/sessions`, { method: 'POST' })
      const { session_id } = await res.json()
      sessionIdRef.current = session_id

      const ws = new WebSocket(`${WS_URL}/ws/voice/${session_id}`)
      wsRef.current = ws

      ws.onopen = () => {
        setIsConnected(true)
        setError(null)
        const ping = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'ping' }))
        }, 25000)
        ws._pingInterval = ping
      }

      ws.onclose = () => {
        setIsConnected(false)
        setVoiceState('idle')
        setIsListeningMode(false)
      }

      ws.onerror = () => setError('Connection failed. Make sure the backend is running.')

      ws.onmessage = (event) => {
        try { handleWsMessage(JSON.parse(event.data)) } catch {}
      }
    } catch (e) {
      setError('Could not connect to backend: ' + e.message)
    }
  }, [])

  const handleWsMessage = useCallback((msg) => {
    switch (msg.type) {
      case 'status':
        setVoiceState(msg.state)
        // Resume listening after AI finishes speaking
        if (msg.state === 'idle' && isListeningModeRef.current) {
          setTimeout(() => {
            if (isListeningModeRef.current) startVAD()
          }, 500)
        }
        break
      case 'transcript':
        if (msg.wake_word) {
          setWakeWordDetected(true)
          setTimeout(() => setWakeWordDetected(false), 3000)
        }
        if (msg.text) {
          onMessage?.({ role: 'user', content: msg.text, timestamp: Date.now(), id: `u-${Date.now()}` })
        }
        break
      case 'response':
        if (msg.text) {
          onMessage?.({ role: 'assistant', content: msg.text, timestamp: Date.now(), id: `a-${Date.now()}` })
        }
        break
      case 'audio':
        if (autoplayRef.current) {
          audioQueueRef.current.push(msg.audio_base64)
          playNextInQueue()
        }
        break
      case 'error':
        setError(msg.message)
        setVoiceState('idle')
        break
    }
  }, [onMessage])

  // ── Audio playback queue ───────────────────────────────────────────────────
  const playNextInQueue = useCallback(() => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0) return
    isPlayingRef.current = true
    const base64Audio = audioQueueRef.current.shift()
    try {
      const bytes = atob(base64Audio)
      const arr = new Uint8Array(bytes.length)
      for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
      const blob = new Blob([arr], { type: 'audio/mpeg' })
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audio.onended = () => { URL.revokeObjectURL(url); isPlayingRef.current = false; playNextInQueue() }
      audio.onerror = () => { URL.revokeObjectURL(url); isPlayingRef.current = false; playNextInQueue() }
      audio.play().catch(() => {
        isPlayingRef.current = false
        document.addEventListener('click', () => audio.play().catch(() => {}), { once: true })
      })
    } catch { isPlayingRef.current = false }
  }, [])

  // ── Setup microphone stream (once) ────────────────────────────────────────
  const setupMicrophone = useCallback(async () => {
    if (streamRef.current) return true
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 }
      })
      streamRef.current = stream

      const ctx = new AudioContext()
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 512
      source.connect(analyser)
      audioContextRef.current = ctx
      analyserRef.current = analyser
      return true
    } catch (e) {
      if (e.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone permissions.')
      } else {
        setError('Could not access microphone: ' + e.message)
      }
      return false
    }
  }, [])

  // ── Start recording a single utterance ────────────────────────────────────
  const startRecording = useCallback(() => {
    if (isRecordingRef.current || !streamRef.current) return
    isRecordingRef.current = true
    speechStartRef.current = Date.now()

    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm'
      : MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : ''

    const recorder = new MediaRecorder(streamRef.current, mimeType ? { mimeType } : {})
    mediaRecorderRef.current = recorder
    audioChunksRef.current = []

    recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data) }
    recorder.onstop = () => {
      const duration = Date.now() - (speechStartRef.current || 0)
      if (duration >= MIN_SPEECH_DURATION && audioChunksRef.current.length > 0) {
        const blob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' })
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          blob.arrayBuffer().then(buf => wsRef.current.send(buf))
        }
      }
      audioChunksRef.current = []
      isRecordingRef.current = false
    }

    recorder.start()
    setVoiceState('listening')
  }, [])

  // ── Stop recording current utterance ──────────────────────────────────────
  const stopRecording = useCallback(() => {
    if (!isRecordingRef.current) return
    clearTimeout(silenceTimerRef.current)
    mediaRecorderRef.current?.stop()
    setVoiceState('thinking')
  }, [])

  // ── Voice Activity Detection loop ─────────────────────────────────────────
  const startVAD = useCallback(() => {
    if (!analyserRef.current) return
    clearInterval(vadIntervalRef.current)

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    let isSpeaking = false

    vadIntervalRef.current = setInterval(() => {
      if (!isListeningModeRef.current) {
        clearInterval(vadIntervalRef.current)
        return
      }

      // Don't listen while AI is speaking or thinking
      if (isPlayingRef.current) return

      analyserRef.current.getByteFrequencyData(dataArray)
      const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length

      if (volume > SILENCE_THRESHOLD) {
        // Speech detected
        if (!isSpeaking) {
          isSpeaking = true
          clearTimeout(silenceTimerRef.current)
          if (!isRecordingRef.current) startRecording()
        } else {
          // Reset silence timer while speaking
          clearTimeout(silenceTimerRef.current)
        }
      } else {
        // Silence detected
        if (isSpeaking && isRecordingRef.current) {
          clearTimeout(silenceTimerRef.current)
          silenceTimerRef.current = setTimeout(() => {
            isSpeaking = false
            stopRecording()
          }, SILENCE_DURATION)
        }
      }
    }, 100)
  }, [startRecording, stopRecording])

  // ── Toggle continuous listening mode ──────────────────────────────────────
  const toggleContinuousMode = useCallback(async () => {
    if (isListeningMode) {
      // Turn OFF
      clearInterval(vadIntervalRef.current)
      clearTimeout(silenceTimerRef.current)
      if (isRecordingRef.current) {
        mediaRecorderRef.current?.stop()
        isRecordingRef.current = false
      }
      streamRef.current?.getTracks().forEach(t => t.stop())
      streamRef.current = null
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close()
      }
      audioContextRef.current = null
      analyserRef.current = null
      setIsListeningMode(false)
      setVoiceState('idle')
    } else {
      // Turn ON
      if (!isConnected) await connect()
      const ok = await setupMicrophone()
      if (!ok) return
      setIsListeningMode(true)
      setVoiceState('listening')
      startVAD()
    }
  }, [isListeningMode, isConnected, connect, setupMicrophone, startVAD])

  const disconnect = useCallback(() => {
    clearInterval(wsRef.current?._pingInterval)
    clearInterval(vadIntervalRef.current)
    clearTimeout(silenceTimerRef.current)
    wsRef.current?.close()
    streamRef.current?.getTracks().forEach(t => t.stop())
    if (audioContextRef.current?.state !== 'closed') audioContextRef.current?.close()
    audioContextRef.current = null
    analyserRef.current = null
    streamRef.current = null
    isRecordingRef.current = false
    isPlayingRef.current = false
    audioQueueRef.current = []
    setIsConnected(false)
    setIsListeningMode(false)
    setVoiceState('idle')
  }, [])

  useEffect(() => () => disconnect(), [])

  return {
    voiceState,
    isConnected,
    isListeningMode,
    error,
    wakeWordDetected,
    analyser: analyserRef.current,
    sessionId: sessionIdRef.current,
    connect,
    disconnect,
    toggleContinuousMode,
  }
}

import React, { useEffect, useRef } from 'react'

export default function WaveformVisualizer({ analyser, isActive, state = 'idle', barCount = 40 }) {
  const canvasRef = useRef()
  const animRef = useRef()
  const dataRef = useRef(new Uint8Array(128))

  const stateColors = {
    idle:      ['#bfdbfe', '#93c5fd'],
    listening: ['#2563eb', '#3b82f6'],
    thinking:  ['#7c3aed', '#a78bfa'],
    speaking:  ['#0ea5e9', '#38bdf8'],
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height

    const draw = () => {
      animRef.current = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, W, H)

      const [c1, c2] = stateColors[state] || stateColors.idle
      const grad = ctx.createLinearGradient(0, H, 0, 0)
      grad.addColorStop(0, c1)
      grad.addColorStop(1, c2)
      ctx.fillStyle = grad

      if (analyser && isActive) {
        analyser.getByteFrequencyData(dataRef.current)
      }

      const barW = W / barCount
      const gap = 3

      for (let i = 0; i < barCount; i++) {
        let amplitude
        if (analyser && isActive) {
          const idx = Math.floor((i / barCount) * (dataRef.current.length / 2))
          amplitude = dataRef.current[idx] / 255
        } else {
          // Idle gentle breathing wave
          const t = Date.now() / 1000
          amplitude = 0.08 + Math.sin(t * 1.2 + i * 0.35) * 0.06 + Math.sin(t * 0.7 + i * 0.6) * 0.04
        }

        const barH = Math.max(4, amplitude * H * 0.85)
        const x = i * barW + gap / 2
        const y = (H - barH) / 2

        const radius = Math.min(barW - gap, barH) / 2
        ctx.beginPath()
        ctx.roundRect(x, y, barW - gap, barH, radius)
        ctx.fill()
      }
    }

    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [analyser, isActive, state, barCount])

  return (
    <canvas
      ref={canvasRef}
      width={360}
      height={80}
      className="w-full max-w-sm"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}

import React from 'react'
import { motion } from 'framer-motion'

export default function FeatureCard({ icon, title, description, color = 'blue', delay = 0 }) {
  const colorMap = {
    blue:    { bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'hover:border-blue-200' },
    violet:  { bg: 'bg-violet-50',  text: 'text-violet-600',  border: 'hover:border-violet-200' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'hover:border-emerald-200' },
    orange:  { bg: 'bg-orange-50',  text: 'text-orange-600',  border: 'hover:border-orange-200' },
    sky:     { bg: 'bg-sky-50',     text: 'text-sky-600',     border: 'hover:border-sky-200' },
    rose:    { bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'hover:border-rose-200' },
  }
  const c = colorMap[color] || colorMap.blue

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className={`glass-card rounded-2xl p-6 border border-slate-100 ${c.border} transition-all duration-300 cursor-default`}
    >
      <div className={`w-11 h-11 rounded-xl ${c.bg} ${c.text} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="font-display font-700 text-navy text-base mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </motion.div>
  )
}

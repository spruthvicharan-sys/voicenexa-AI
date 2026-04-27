import React from 'react'
import { motion } from 'framer-motion'

export default function DashboardCard({ title, value, subtitle, icon, trend, color = 'blue' }) {
  const colorMap = {
    blue:    'text-blue-600 bg-blue-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    violet:  'text-violet-600 bg-violet-50',
    orange:  'text-orange-600 bg-orange-50',
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass-card rounded-2xl p-5 border border-slate-100 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color] || colorMap.blue}`}>
          {icon}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="text-2xl font-display font-700 text-navy">{value}</div>
      <div className="text-sm font-medium text-navy mt-0.5">{title}</div>
      {subtitle && <div className="text-xs text-slate-400 mt-1">{subtitle}</div>}
    </motion.div>
  )
}

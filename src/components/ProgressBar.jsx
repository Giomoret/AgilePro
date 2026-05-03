import React from 'react'

export default function ProgressBar({ value = 0, color = '#1D9E75', height = 6 }) {
  return (
    <div style={{ height, background: '#f1f0f9', borderRadius: 100, overflow: 'hidden' }}>
      <div
        style={{
          height: '100%',
          width: `${Math.min(100, Math.max(0, value))}%`,
          background: color,
          borderRadius: 100,
          transition: 'width 0.4s ease',
        }}
      />
    </div>
  )
}

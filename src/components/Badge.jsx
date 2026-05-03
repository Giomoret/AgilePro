import React from 'react'

const presets = {
  ativo:    { bg: '#E1F5EE', color: '#0F6E56' },
  planejamento: { bg: '#FAEEDA', color: '#854F0B' },
  concluido: { bg: '#EEEDFE', color: '#534AB7' },
  Backend:  { bg: '#E6F1FB', color: '#185FA5' },
  Frontend: { bg: '#FAEEDA', color: '#854F0B' },
  DevOps:   { bg: '#EAF3DE', color: '#3B6D11' },
  Design:   { bg: '#EEEDFE', color: '#534AB7' },
  QA:       { bg: '#FAECE7', color: '#993C1D' },
}

export default function Badge({ label, style: customStyle }) {
  const preset = presets[label] || { bg: '#F1F0F9', color: '#6b6b80' }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: '11px',
        fontWeight: 500,
        padding: '2px 9px',
        borderRadius: '100px',
        background: preset.bg,
        color: preset.color,
        ...customStyle,
      }}
    >
      {label}
    </span>
  )
}

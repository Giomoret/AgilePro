import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import styles from './Modal.module.css'

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.close} onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}

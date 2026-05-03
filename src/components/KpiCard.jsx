import React from 'react'
import styles from './KpiCard.module.css'

export default function KpiCard({ label, value, icon, badge, badgeColor = '#1D9E75', iconBg = '#EEEDFE' }) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.iconWrap} style={{ background: iconBg }}>
          {icon}
        </div>
        {badge && (
          <span className={styles.badge} style={{ color: badgeColor }}>
            {badge}
          </span>
        )}
      </div>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
    </div>
  )
}

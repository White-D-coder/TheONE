'use client';

import React from 'react';
import { Bell, Search, Zap, Command } from 'lucide-react';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.modeIndicator}>
          <div className={styles.pulse} />
          <span>ACTIVE MODE: ENGINEER</span>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.worthBadge}>
          <span className={styles.worthLabel}>Monthly Worth</span>
          <span className={styles.worthValue}>$4,250</span>
        </div>

        <div className={styles.iconButton}>
          <Search size={18} />
        </div>

        <div className={styles.iconButton}>
          <Bell size={18} />
        </div>

        <div className={styles.iconButton} style={{ borderColor: 'var(--accent-amber)', color: 'var(--accent-amber)' }}>
          <Zap size={18} fill="currentColor" />
        </div>
      </div>
    </header>
  );
}

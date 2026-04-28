'use client';

import React from 'react';
import { Bell, Search, Zap } from 'lucide-react';
import styles from './Header.module.css';
import { getOSState } from '@/lib/actions';

export function Header() {
  const [state, setState] = React.useState<any>(null);

  React.useEffect(() => {
    async function load() {
      const osState = await getOSState();
      setState(osState);
    }
    load();
  }, []);

  const latestWorth = state?.user?.worthHistory?.[0]?.score || 0;
  const displayWorth = (latestWorth * 50).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.modeIndicator}>
          <div className={styles.pulse} />
          <span>ACTIVE MODE: {state?.currentMode || 'INITIALIZING'}</span>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.worthBadge}>
          <span className={styles.worthLabel}>Monthly Worth</span>
          <span className={styles.worthValue}>{displayWorth}</span>
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

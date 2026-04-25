'use client';

import React from 'react';
import { 
  TrendingUp, 
  ArrowUp, 
  ShieldCheck, 
  FileCode2, 
  Zap, 
  Mic2, 
  Briefcase,
  AlertCircle
} from 'lucide-react';
import styles from './worth.module.css';

const BREAKDOWN = [
  { name: 'Technical Output', weight: '30%', value: 88, desc: 'Volume & complexity of shipped code', icon: FileCode2, status: 'EXCELLENT' },
  { name: 'Skill Growth', weight: '20%', value: 74, desc: 'Delta in technical & speaking scores', icon: TrendingUp, status: 'GOOD' },
  { name: 'Public Proof', weight: '20%', value: 42, desc: 'Engagement & visibility of artifacts', icon: ShieldCheck, status: 'WARNING' },
  { name: 'Consistency', weight: '20%', value: 92, desc: 'Adherence to non-negotiable habits', icon: Zap, status: 'EXCELLENT' },
  { name: 'Opportunity Flow', weight: '10%', value: 15, desc: 'Interview invites & offer quality', icon: Briefcase, status: 'WARNING' },
];

export default function WorthPage() {
  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <div className={styles.worthHeader}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letter-spacing: '0.1em' }}>
          APRIL 2026 Performance Review
        </span>
        <div className={`text-gradient ${styles.mainScore}`}>842</div>
        <div className={styles.worthTrend}>
          <ArrowUp size={20} />
          <span>+12.4% FROM LAST MONTH</span>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={`glass-card ${styles.breakdownCard}`}>
          <h3 style={{ fontSize: '1rem', marginBottom: '24px' }}>Weighted Score Breakdown</h3>
          <div className={styles.breakdownList}>
            {BREAKDOWN.map((item) => (
              <div key={item.name} className={styles.breakdownItem}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ padding: '10px', borderRadius: '12px', background: 'var(--bg-surface-hover)' }}>
                    <item.icon size={20} color="var(--text-secondary)" />
                  </div>
                  <div className={styles.itemLabel}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemDesc}>{item.desc}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className={styles.itemValue}>{item.value}</div>
                  <span className={`${styles.badge} ${item.status === 'EXCELLENT' ? styles.badgeExcellent : item.status === 'GOOD' ? styles.badgeGood : styles.badgeWarning}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Market Trajectory</h3>
            <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', gap: '12px', paddingBottom: '20px' }}>
              {[30, 45, 40, 55, 70, 85].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 5 ? 'var(--grad-primary)' : 'var(--bg-surface-hover)', borderRadius: '4px' }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
              <span>NOV</span>
              <span>DEC</span>
              <span>JAN</span>
              <span>FEB</span>
              <span>MAR</span>
              <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>APR</span>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--accent-blue)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={16} color="var(--accent-blue)" fill="var(--accent-blue)" />
              Strategic Shift
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Your technical execution is in the top 5%, but your **Public Proof** is lagging. 
              Next month, the OS will shift **15%** of your routine gravity from Builder to Communicator to balance your market value.
            </p>
          </div>
        </div>
      </div>

      <div className={`glass-card ${styles.summarySection}`}>
        <h2 className={styles.summaryTitle}>
          <AlertCircle size={24} color="var(--accent-blue)" />
          Executive Summary
        </h2>
        <div className={styles.summaryText}>
          "April has been a high-leverage month for technical mastery. You have successfully completed 
          the **Adaptive Scheduler API**, which significantly boosted your System Design score. 
          However, your 'Ghost Presence' (zero public commits/posts for 12 days) is capping your 
          Opportunity Flow. You are currently **Interview Ready** for Mid-level Backend roles, 
          but lack the visible proof required for Senior/Lead positions. Recommended focus for May: 
          Convert Vault evidence into 3 high-signal technical articles."
        </div>
      </div>
    </div>
  );
}

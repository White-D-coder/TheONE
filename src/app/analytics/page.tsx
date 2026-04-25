'use client';

import React from 'react';
import { 
  TrendingUp, 
  BrainCircuit, 
  Calendar, 
  BarChart3, 
  Zap, 
  AlertTriangle,
  History,
  Target
} from 'lucide-react';
import styles from './analytics.module.css';

const WEEKLY_DATA = [45, 62, 58, 75, 82, 68, 91]; // Focus scores
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export default function AnalyticsPage() {
  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
          AI Review & <span className="text-gradient">Advanced Analytics</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          System-wide performance auditing. The "Strict Mentor" logic is active.
        </p>
      </header>

      <div className={styles.reviewGrid}>
        <div className={`glass-card ${styles.reportCard}`}>
          <div className={styles.reportHeader}>
            <h3 className={styles.reportTitle}>
              <BrainCircuit size={20} color="var(--accent-blue)" />
              Weekly Performance Audit
            </h3>
            <span className={styles.toneBadge}>TONE: SHARP / DIRECT</span>
          </div>
          
          <div className={styles.reportContent}>
            "Your technical output is up 18%, but your 'Drift Detection' logs are at an all-time high. 
            You are successfully tackling harder System Design problems, but your focus is fragmented. 
            Recommendation: Increase 'Power Block' isolation and disable all non-essential pings for the first 3 hours."
          </div>

          <div className={styles.metricGrid}>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Efficiency</span>
              <span className={styles.metricValue}>84%</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Deep Work</span>
              <span className={styles.metricValue}>32h</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Leaks</span>
              <span className={styles.metricValue} style={{ color: 'var(--accent-rose)' }}>High</span>
            </div>
          </div>
        </div>

        <div className={`glass-card ${styles.reportCard}`}>
          <h3 className={styles.reportTitle}>
            <BarChart3 size={20} color="var(--accent-emerald)" />
            Focus Score Trend
          </h3>
          <div className={styles.chartContainer}>
            {WEEKLY_DATA.map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div 
                  className={`${styles.bar} ${i === 6 ? styles.barActive : ''}`} 
                  style={{ height: `${val}%` }} 
                />
                <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{DAYS[i]}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '16px' }}>
            Daily average focus score: **72.5 / 100**
          </p>
        </div>
      </div>

      <div className={styles.insightSection}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
          <div className={`glass-card ${styles.insightCard}`}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="var(--accent-blue)" fill="var(--accent-blue)" />
              Strategic Optimization
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ padding: '8px', background: 'var(--bg-surface-hover)', borderRadius: '8px' }}>
                  <Target size={18} color="var(--accent-blue)" />
                </div>
                <div>
                  <h5 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Role Calibration</h5>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Your **Builder** weight is too high for your current **Interview** goal. 
                    Shift 15% gravity to **Candidate** mode to increase LeetCode volume.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ padding: '8px', background: 'var(--bg-surface-hover)', borderRadius: '8px' }}>
                  <History size={18} color="var(--accent-amber)" />
                </div>
                <div>
                  <h5 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Skill Decay Alert</h5>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    **PostgreSQL** retention is dropping. Schedule a 30m refresher drill in tomorrow's Routine.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="var(--accent-amber)" />
              System Bottlenecks
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '12px' }}>
                <span style={{ color: 'var(--accent-rose)' }}>●</span> Late-night drift detected (11 PM - 1 AM).
              </li>
              <li style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '12px' }}>
                <span style={{ color: 'var(--accent-rose)' }}>●</span> Task switching during 'Power Block'.
              </li>
              <li style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '12px' }}>
                <span style={{ color: 'var(--accent-rose)' }}>●</span> Under-reporting of distraction incidents.
              </li>
            </ul>
            <button className="glass-card" style={{ width: '100%', padding: '10px', marginTop: '24px', fontSize: '0.85rem', color: 'var(--accent-rose)', border: '1px solid var(--accent-rose)' }}>
              Enable Hard Reset Mode
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '64px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Calendar size={20} color="var(--accent-blue)" />
          Long-term Trajectory
        </h3>
        <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
          <TrendingUp size={48} color="var(--accent-blue)" style={{ marginBottom: '16px' }} />
          <h4 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Senior Engineer Readiness: <span className="text-gradient">74%</span></h4>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Based on your current volume of "Elite" evidence and System Design scores, 
            the system projects you will be ready for Staff-level interviews in **9 months**.
          </p>
        </div>
      </div>
    </div>
  );
}

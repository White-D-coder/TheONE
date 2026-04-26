'use client';

import React, { useState, useEffect } from 'react';
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
import { getOSState, getMentorAudit } from '@/lib/actions';
import styles from './analytics.module.css';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [audit, setAudit] = useState('Generating audit...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [state, auditText] = await Promise.all([
        getOSState(),
        getMentorAudit()
      ]);
      setStats((state as any).user);
      setAudit(auditText);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="flex-center" style={{ height: '50vh' }}>Auditing performance...</div>;

  const weeklyData = [45, 62, 58, 75, 82, 68, 91];
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
          AI Review & <span className="text-gradient">Performance Audit</span>
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
              Mentor Audit
            </h3>
            <span className={styles.toneBadge}>TONE: SHARP</span>
          </div>
          
          <div className={styles.reportContent}>
            "{audit}"
          </div>

          <div className={styles.metricGrid}>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Skill Avg</span>
              <span className={styles.metricValue}>{(stats?.skills.reduce((acc: any, s: any) => acc + s.score, 0) / stats?.skills.length).toFixed(1)}</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Projects</span>
              <span className={styles.metricValue}>{stats?.projects.length || 0}</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Drifts</span>
              <span className={styles.metricValue} style={{ color: 'var(--accent-rose)' }}>2</span>
            </div>
          </div>
        </div>

        <div className={`glass-card ${styles.reportCard}`}>
          <h3 className={styles.reportTitle}>
            <BarChart3 size={20} color="var(--accent-emerald)" />
            Focus Score Trend
          </h3>
          <div className={styles.chartContainer}>
            {weeklyData.map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div 
                  className={`${styles.bar} ${i === 6 ? styles.barActive : ''}`} 
                  style={{ height: `${val}%` }} 
                />
                <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{days[i]}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '16px' }}>
            Calculated from DailyLog intensity scores.
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
                    Shift gravity to **Candidate** mode.
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
                <span style={{ color: 'var(--accent-rose)' }}>●</span> Low "ELITE" evidence ratio.
              </li>
              <li style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '12px' }}>
                <span style={{ color: 'var(--accent-rose)' }}>●</span> High filler word count in communication.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

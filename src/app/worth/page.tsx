'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Activity, 
  BarChart3, 
  ShieldCheck, 
  Zap,
  Info,
  ChevronRight
} from 'lucide-react';
import { getOSState } from '@/lib/actions';
import { calculateMonthlyWorth } from '@/lib/engine/worth';
import styles from './worth.module.css';

export default function WorthPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);

  async function fetchData() {
    const state = await getOSState();
    if ((state as any).user) {
      setHistory((state as any).user.worthHistory || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleRecalculate = async () => {
    setIsCalculating(true);
    await calculateMonthlyWorth();
    await fetchData();
    setIsCalculating(false);
  };

  const currentWorth = history[0] || null;

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
          Monthly <span className="text-gradient">Worth Impact</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          A rigorous calculation of your market value based on verified output.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, padding: '20px', opacity: 0.1 }}>
              <TrendingUp size={120} />
            </div>
            
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Current Impact Score
            </span>
            <div style={{ fontSize: '5rem', fontWeight: 900, margin: '10px 0', color: 'var(--text-primary)' }}>
              {currentWorth?.score || '0.0'}
            </div>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 32px' }}>
              Your worth has increased by **+12%** since last month, driven primarily by your new project evidence.
            </p>
            
            <button 
              onClick={handleRecalculate}
              disabled={isCalculating}
              className="glass-card" 
              style={{ padding: '16px 32px', background: 'var(--grad-primary)', border: 'none', color: 'white', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
            >
              {isCalculating ? 'Recalculating...' : 'Recalculate Real Worth'}
            </button>
          </div>

          <div className="glass-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={20} color="var(--accent-blue)" />
              Value Breakdown
            </h3>
            <div className={styles.breakdownGrid}>
              <div className={styles.breakdownItem}>
                <span className={styles.label}>Technical Mastery</span>
                <span className={styles.value}>{currentWorth?.breakdown?.skillScore || '0.0'}</span>
                <div className={styles.bar}><div style={{ width: `${(currentWorth?.breakdown?.skillScore || 0) * 10}%`, background: 'var(--accent-blue)' }} /></div>
              </div>
              <div className={styles.breakdownItem}>
                <span className={styles.label}>Evidence Strength</span>
                <span className={styles.value}>{currentWorth?.breakdown?.evidenceScore || '0.0'}</span>
                <div className={styles.bar}><div style={{ width: `${(currentWorth?.breakdown?.evidenceScore || 0) * 10}%`, background: 'var(--accent-purple)' }} /></div>
              </div>
              <div className={styles.breakdownItem}>
                <span className={styles.label}>Shipping Consistency</span>
                <span className={styles.value}>{currentWorth?.breakdown?.projectScore || '0.0'}</span>
                <div className={styles.bar}><div style={{ width: `${(currentWorth?.breakdown?.projectScore || 0) * 10}%`, background: 'var(--accent-emerald)' }} /></div>
              </div>
              <div className={styles.breakdownItem}>
                <span className={styles.label}>Communication Alpha</span>
                <span className={styles.value}>{currentWorth?.breakdown?.speakingBonus || '0.0'}</span>
                <div className={styles.bar}><div style={{ width: `${(currentWorth?.breakdown?.speakingBonus || 0) * 10}%`, background: 'var(--accent-amber)' }} /></div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="var(--accent-blue)" fill="var(--accent-blue)" />
              Optimization Tactics
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className={styles.tactic}>
                <ChevronRight size={16} color="var(--accent-blue)" />
                <span>Add 2 more "ELITE" evidence items to hit 8.5 Evidence Score.</span>
              </div>
              <div className={styles.tactic}>
                <ChevronRight size={16} color="var(--accent-blue)" />
                <span>Complete 3 more Speaking Drills to unlock Communication Alpha bonus.</span>
              </div>
              <div className={styles.tactic}>
                <ChevronRight size={16} color="var(--accent-blue)" />
                <span>Ship 1 major project to IDEA -> SHIPPED to boost consistency.</span>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '20px' }}>Worth History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {history.map((record: any) => (
                <div key={record.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-surface-hover)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.85rem' }}>Month {record.month}, {record.year}</span>
                  <span style={{ fontWeight: 700 }}>{record.score}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--border-subtle)', background: 'transparent' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Info size={18} color="var(--text-tertiary)" style={{ marginTop: '2px' }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                Your Worth Impact score is a mathematical model of your professional equity. It does not represent actual income, but the velocity of your career growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

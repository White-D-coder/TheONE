'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  AlertOctagon, 
  ChevronRight,
  Brain,
  Timer,
  Zap
} from 'lucide-react';
import styles from './tracker.module.css';

export default function TrackerPage() {
  const [timeLeft, setTimeLeft] = useState(10800); // 3 hours
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (!isActive && timeLeft !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <div className={styles.focusHeader}>
        <div className={styles.taskTag}>DEEP WORK SESSION</div>
        <div className={`text-gradient ${styles.timerDisplay}`}>
          {formatTime(timeLeft)}
        </div>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
          Distraction suppression active. System monitoring focus levels.
        </p>
      </div>

      <div className={styles.currentTask}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-blue)', fontSize: '0.8rem', fontWeight: 600 }}>
          <Brain size={16} /> CURRENT OBJECTIVE
        </div>
        <h2 className={styles.taskTitle}>System Design: Distributed Caching</h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '400px' }}>
          Implement LRU eviction policy and handle consistency across nodes.
        </p>
        
        <div className={styles.controls}>
          <button className={styles.controlBtn + ' ' + styles.stopBtn}>
            <Square size={24} />
          </button>
          <button 
            className={styles.controlBtn + ' ' + styles.playBtn}
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" />}
          </button>
          <button className={styles.controlBtn}>
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Timer size={20} color="var(--accent-blue)" />
            <span style={{ fontWeight: 600 }}>Session Metrics</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Focus Score</span>
              <span style={{ color: 'var(--accent-emerald)' }}>9.8 / 10</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Key Strokes</span>
              <span>12.4k</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Switches</span>
              <span style={{ color: 'var(--accent-rose)' }}>2 Detected</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Zap size={20} color="var(--accent-amber)" />
            <span style={{ fontWeight: 600 }}>Active Routine</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ padding: '8px 12px', background: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Power Block</span>
              <span style={{ color: 'var(--accent-blue)' }}>ACTIVE</span>
            </div>
            <div style={{ padding: '8px 12px', opacity: 0.5, fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Lunch Break</span>
              <span>IN 45m</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.driftSection}>
        <div className={`glass-card ${styles.driftCard}`}>
          <div className={styles.driftInfo}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertOctagon size={18} />
              LOG DISTRACTION INCIDENT
            </h3>
            <p>Immediate reporting reduces penalty on Monthly Worth score.</p>
          </div>
          <button className={styles.driftBtn}>I GOT DISTRACTED</button>
        </div>
      </div>
    </div>
  );
}

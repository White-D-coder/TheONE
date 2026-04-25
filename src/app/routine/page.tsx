'use client';

import React from 'react';
import { 
  Play, 
  Clock, 
  Calendar, 
  MoreVertical, 
  CheckCircle2,
  Lock,
  Zap,
  Coffee,
  BrainCircuit
} from 'lucide-react';
import styles from './routine.module.css';

const SCHEDULE = [
  { 
    time: '06:00', 
    label: 'Deep Sleep Baseline', 
    duration: '7h (Complete)', 
    type: 'REST', 
    color: 'var(--text-tertiary)',
    status: 'DONE'
  },
  { 
    time: '07:30', 
    label: 'Physical Prime', 
    duration: '45m', 
    type: 'BODY', 
    color: 'var(--accent-emerald)',
    status: 'DONE'
  },
  { 
    time: '09:00', 
    label: 'Power Block: System Design', 
    duration: '180m', 
    type: 'ENGINEER', 
    color: 'var(--accent-blue)',
    status: 'ACTIVE',
    tag: 'HIGH GRAVITY'
  },
  { 
    time: '12:00', 
    label: 'Maintenance & Nutrition', 
    duration: '60m', 
    type: 'REST', 
    color: 'var(--text-tertiary)',
    status: 'PENDING'
  },
  { 
    time: '13:00', 
    label: 'Execution: Feature Implementation', 
    duration: '120m', 
    type: 'BUILDER', 
    color: 'var(--accent-purple)',
    status: 'PENDING'
  },
  { 
    time: '15:30', 
    label: 'Speaking Lab: Pitch Drills', 
    duration: '30m', 
    type: 'COMMUNICATOR', 
    color: 'var(--accent-amber)',
    status: 'PENDING'
  },
  { 
    time: '16:00', 
    label: 'Opportunity Hunt', 
    duration: '45m', 
    type: 'CANDIDATE', 
    color: 'var(--accent-rose)',
    status: 'PENDING'
  },
  { 
    time: '17:00', 
    label: 'Daily Review & Strategy', 
    duration: '20m', 
    type: 'AI_REVIEW', 
    color: 'var(--text-primary)',
    status: 'LOCKED'
  }
];

export default function RoutinePage() {
  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
            Adaptive <span className="text-gradient">Routine Engine</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Schedule optimized for **Engineer (60%)** and **Builder (40%)** role weights.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="glass-card" style={{ padding: '10px 20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} /> Weekly Plan
          </button>
          <button className="glass-card" style={{ padding: '10px 20px', fontSize: '0.9rem', background: 'var(--grad-primary)', border: 'none', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={16} /> Force Sync
          </button>
        </div>
      </header>

      <div className="glass-card" style={{ padding: '24px', marginBottom: '48px', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '24px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Efficiency</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>94%</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Deep Work</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>5.2h</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Focus Score</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>A+</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <BrainCircuit size={18} color="var(--accent-blue)" />
            AI Optimized Schedule
          </div>
        </div>
      </div>

      <div className={styles.timeline}>
        {SCHEDULE.map((block, i) => (
          <div key={i} className={styles.block}>
            <div className={styles.time}>{block.time}</div>
            <div className={styles.dot + ' ' + (block.status === 'ACTIVE' ? styles.activeDot : '')} />
            <div className={`glass-card ${styles.content} ${block.status === 'ACTIVE' ? styles.active : ''}`}>
              <div className={styles.blockInfo}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={styles.label}>{block.label}</span>
                  {block.tag && (
                    <span className={styles.tag} style={{ background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-blue)' }}>
                      {block.tag}
                    </span>
                  )}
                </div>
                <div className={styles.meta}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} /> {block.duration}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: block.color }} />
                    {block.type}
                  </div>
                </div>
              </div>

              <div className={styles.actions}>
                {block.status === 'DONE' && <CheckCircle2 size={20} color="var(--accent-emerald)" />}
                {block.status === 'LOCKED' && <Lock size={20} color="var(--text-tertiary)" />}
                {block.status === 'PENDING' && (
                  <>
                    <button className={styles.actionBtn}><Play size={16} /></button>
                    <button className={styles.actionBtn}><MoreVertical size={16} /></button>
                  </>
                )}
                {block.status === 'ACTIVE' && (
                  <button style={{ 
                    padding: '8px 16px', 
                    background: 'var(--accent-blue)', 
                    border: 'none', 
                    borderRadius: 'var(--radius-sm)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Play size={14} fill="white" /> Resume Session
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

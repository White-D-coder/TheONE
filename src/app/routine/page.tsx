'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Clock, 
  Calendar, 
  MoreVertical, 
  CheckCircle2,
  Lock,
  Zap,
  Coffee,
  BrainCircuit,
  RefreshCw
} from 'lucide-react';
import { generateRoutine, getOSState, completeRoutineBlock, logDrift } from '@/lib/actions';
import styles from './routine.module.css';

export default function RoutinePage() {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [state, setState] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState<string | null>(null);
  const [activeTimer, setActiveTimer] = useState<{ label: string; seconds: number } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const [routineData, osState] = await Promise.all([
      generateRoutine(),
      getOSState()
    ]);
    setSchedule(routineData);
    setState(osState);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let interval: any;
    if (activeTimer) {
      interval = setInterval(() => {
        setActiveTimer(prev => prev ? { ...prev, seconds: prev.seconds + 1 } : null);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCompleteBlock = async (block: any) => {
    setIsCompleting(block.label);
    await completeRoutineBlock(block.label, typeof block.duration === 'string' ? parseInt(block.duration) : block.duration);
    await fetchData();
    setIsCompleting(null);
  };

  if (loading) {
    return (
      <div className={styles.container} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <RefreshCw className="animate-spin" size={48} color="var(--accent-blue)" />
      </div>
    );
  }

  const primaryRole = state ? Object.entries(state.roles)
    .sort(([, a]: any, [, b]: any) => b - a)[0][0] : 'Engineer';

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
            Adaptive <span className="text-gradient">Routine Engine</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Schedule optimized for **{primaryRole.toUpperCase()}** priorities in **{state.currentMode}** mode.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="glass-card" style={{ padding: '10px 20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} /> Weekly Plan
          </button>
          <button 
            onClick={fetchData}
            className="glass-card" 
            style={{ padding: '10px 20px', fontSize: '0.9rem', background: 'var(--grad-primary)', border: 'none', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
          >
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
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{schedule.filter(b => b.status === 'DONE').length * 1.5}h</div>
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
        {schedule.map((block, i) => (
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
                    <Clock size={14} /> {block.duration}m
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: block.color }} />
                    {block.type}
                  </div>
                </div>
                {block.target && (
                  <div style={{ marginTop: '12px', padding: '12px 16px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', fontSize: '0.85rem', border: '1px dashed rgba(59, 130, 246, 0.3)', color: 'white', fontWeight: 500 }}>
                    <span style={{ fontWeight: 800, color: 'var(--accent-blue)', marginRight: '8px', fontSize: '0.7rem', letterSpacing: '0.05em' }}>AI TARGET:</span>
                    {block.target}
                  </div>
                )}
              </div>

              <div className={styles.actions}>
                {block.status === 'DONE' ? (
                  <CheckCircle2 size={20} color="var(--accent-emerald)" />
                ) : block.status === 'LOCKED' ? (
                  <Lock size={20} color="var(--text-tertiary)" />
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleCompleteBlock(block)}
                      disabled={isCompleting === block.label}
                      className={styles.actionBtn} 
                      style={{ color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)' }}
                    >
                      {isCompleting === block.label ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                    </button>
                    <button 
                      onClick={() => setActiveTimer({ label: block.label, seconds: 0 })}
                      className={styles.actionBtn}
                      style={{ background: activeTimer?.label === block.label ? 'var(--accent-blue)' : 'transparent', color: activeTimer?.label === block.label ? 'white' : 'inherit' }}
                    >
                      {activeTimer?.label === block.label ? formatTime(activeTimer.seconds) : <Play size={16} />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

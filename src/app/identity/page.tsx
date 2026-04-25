'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Rocket, 
  GraduationCap, 
  Briefcase, 
  Zap,
  Coffee,
  AlertTriangle
} from 'lucide-react';
import styles from './identity.module.css';

const MODES = [
  { id: 'NORMAL', name: 'Normal', icon: Zap, desc: 'Balanced growth & steady execution' },
  { id: 'EXAM', name: 'Exam Mode', icon: GraduationCap, desc: 'Academics prioritized, habits minimized' },
  { id: 'SPRINT', name: 'Sprint Mode', icon: Rocket, desc: 'Max output, 12h blocks, high intensity' },
  { id: 'MAINTENANCE', name: 'Recovery', icon: Coffee, desc: 'Minimum Viable Progress only' },
];

const INITIAL_ROLES = [
  { id: 'engineer', name: 'Engineer', weight: 60, desc: 'Technical mastery & problem solving' },
  { id: 'builder', name: 'Builder', weight: 40, desc: 'Shipping products & user feedback' },
  { id: 'communicator', name: 'Communicator', weight: 20, desc: 'Speaking, writing & public proof' },
  { id: 'candidate', name: 'Candidate', weight: 10, desc: 'Interview prep & job discovery' },
];

export default function IdentityPage() {
  const [currentMode, setCurrentMode] = useState('NORMAL');
  const [roles, setRoles] = useState(INITIAL_ROLES);

  const handleWeightChange = (id: string, weight: number) => {
    setRoles(roles.map(r => r.id === id ? { ...r, weight } : r));
  };

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <header className={styles.header}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
          Identity & <span className="text-gradient">Mode Engine</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Configure your professional weightings to override the Routine Engine.
        </p>
      </header>

      <section style={{ marginBottom: '64px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={20} className="text-gradient" />
          Active Operating Mode
        </h2>
        <div className={styles.modeGrid}>
          {MODES.map((mode) => (
            <div 
              key={mode.id} 
              className={`glass-card ${styles.modeCard} ${currentMode === mode.id ? styles.activeMode : ''}`}
              onClick={() => setCurrentMode(mode.id)}
            >
              <div className={styles.modeIcon}>
                <mode.icon size={24} color={currentMode === mode.id ? 'var(--accent-blue)' : 'var(--text-tertiary)'} />
              </div>
              <span className={styles.modeName}>{mode.name}</span>
              <p className={styles.modeDesc}>{mode.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.roleSection}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} className="text-gradient" />
          Role Weight Distribution
        </h2>
        <p style={{ color: 'var(--text-tertiary)', marginBottom: '32px', fontSize: '0.9rem' }}>
          Weights determine the "gravity" of tasks in your daily routine. Higher weight = earlier blocks.
        </p>

        {roles.map((role) => (
          <div key={role.id} className={styles.roleRow}>
            <div className={styles.roleInfo}>
              <span className={styles.roleName}>{role.name}</span>
              <span className={styles.roleWeight}>{role.desc}</span>
            </div>
            
            <div className={styles.sliderContainer}>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={role.weight} 
                className={styles.slider}
                onChange={(e) => handleWeightChange(role.id, parseInt(e.target.value))}
              />
            </div>

            <div className={styles.roleImpact}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {role.weight}
              </span>
              <span style={{ fontSize: '0.75rem', marginLeft: '4px' }}>% Gravity</span>
            </div>
          </div>
        ))}
      </section>

      <div className="glass-card" style={{ marginTop: '48px', padding: '24px', border: '1px solid var(--accent-amber)', background: 'rgba(245, 158, 11, 0.05)' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <AlertTriangle color="var(--accent-amber)" />
          <div>
            <h4 style={{ color: 'var(--accent-amber)', marginBottom: '4px' }}>Routine Recalculation Required</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Changing weights will reorder your deep work blocks for tomorrow. The AI Mentor suggests 
              prioritizing **Engineer** mastery as your DSA score has plateaued.
            </p>
            <button style={{ 
              marginTop: '16px', 
              padding: '8px 16px', 
              background: 'var(--accent-amber)', 
              border: 'none', 
              borderRadius: 'var(--radius-sm)',
              color: 'black',
              fontWeight: 600,
              fontSize: '0.8rem'
            }}>
              Confirm & Rebalance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

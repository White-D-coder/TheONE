'use client';

import React from 'react';
import { 
  TrendingUp, 
  AlertCircle, 
  Zap, 
  Search, 
  Filter,
  BrainCircuit,
  History,
  Target
} from 'lucide-react';
import styles from './skills.module.css';

const TECHNICAL_SKILLS = [
  { name: 'System Design', score: 78, confidence: 85, consistency: 90, decay: false },
  { name: 'React / Next.js', score: 92, confidence: 95, consistency: 98, decay: false },
  { name: 'PostgreSQL', score: 65, confidence: 70, consistency: 60, decay: true, decayMsg: 'No activity for 14 days. Retention dropping.' },
  { name: 'Data Structures', score: 84, confidence: 80, consistency: 85, decay: false },
];

const SOFT_SKILLS = [
  { name: 'Technical Explanation', score: 55, confidence: 60, consistency: 40, decay: false },
  { name: 'Writing / Blogging', score: 40, confidence: 50, consistency: 30, decay: false },
];

export default function SkillsPage() {
  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
            Skill <span className="text-gradient">Progress Engine</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Evidence-based mastery mapping. Scores are derived from **Project Vault** artifacts.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
            <Search size={16} /> Search Skills...
          </div>
          <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
            <Filter size={16} /> Filter
          </div>
        </div>
      </header>

      <div className={styles.grid}>
        <div className={`glass-card ${styles.radarSection}`}>
          <h2 style={{ fontSize: '1rem', marginBottom: '32px', color: 'var(--text-secondary)' }}>Mastery Radar</h2>
          <svg width="300" height="300" viewBox="0 0 300 300" style={{ filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))' }}>
            {/* Radar Background Grids */}
            <circle cx="150" cy="150" r="120" fill="none" stroke="var(--border-subtle)" strokeWidth="1" />
            <circle cx="150" cy="150" r="90" fill="none" stroke="var(--border-subtle)" strokeWidth="1" />
            <circle cx="150" cy="150" r="60" fill="none" stroke="var(--border-subtle)" strokeWidth="1" />
            <circle cx="150" cy="150" r="30" fill="none" stroke="var(--border-subtle)" strokeWidth="1" />
            
            {/* Axis Lines */}
            <line x1="150" y1="30" x2="150" y2="270" stroke="var(--border-subtle)" />
            <line x1="30" y1="150" x2="270" y2="150" stroke="var(--border-subtle)" />
            
            {/* Radar Shape (Mock Data) */}
            <polygon 
              points="150,50 240,150 150,230 80,150" 
              fill="rgba(59, 130, 246, 0.2)" 
              stroke="var(--accent-blue)" 
              strokeWidth="2" 
            />
            
            {/* Labels */}
            <text x="150" y="20" textAnchor="middle" fill="var(--text-tertiary)" fontSize="10">TECHNICAL</text>
            <text x="280" y="150" textAnchor="start" fill="var(--text-tertiary)" fontSize="10">SOFT</text>
            <text x="150" y="290" textAnchor="middle" fill="var(--text-tertiary)" fontSize="10">CAREER</text>
            <text x="20" y="150" textAnchor="end" fill="var(--text-tertiary)" fontSize="10">SYSTEMS</text>
          </svg>
          
          <div style={{ marginTop: '40px', width: '100%' }}>
            <div className="glass-card" style={{ padding: '20px', border: '1px solid var(--accent-blue)', background: 'rgba(59, 130, 246, 0.03)' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <BrainCircuit size={20} color="var(--accent-blue)" />
                <div>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '4px' }}>AI Growth Prediction</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    At your current velocity, you will reach **Elite (90+)** in System Design by June 12th. 
                    Target: Multi-node replication evidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.skillList}>
          <span className={styles.categoryTitle}>Technical Core</span>
          {TECHNICAL_SKILLS.map((skill) => (
            <div key={skill.name} className={`glass-card ${styles.skillCard}`}>
              <div className={styles.skillHeader}>
                <span className={styles.skillName}>{skill.name}</span>
                <span className={styles.skillScore}>{skill.score}</span>
              </div>
              <div className={styles.progressBarContainer}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${skill.score}%` }} />
                </div>
                <div className={styles.skillMeta}>
                  <span className={styles.metaItem}><Zap size={12} /> Confidence: {skill.confidence}%</span>
                  <span className={styles.metaItem}><History size={12} /> Consistency: {skill.consistency}%</span>
                </div>
              </div>
              {skill.decay && (
                <div className={styles.decayWarning}>
                  <AlertCircle size={14} style={{ marginRight: '8px' }} />
                  {skill.decayMsg}
                </div>
              )}
            </div>
          ))}

          <span className={styles.categoryTitle} style={{ marginTop: '24px' }}>Communication & soft</span>
          {SOFT_SKILLS.map((skill) => (
            <div key={skill.name} className={`glass-card ${styles.skillCard}`}>
              <div className={styles.skillHeader}>
                <span className={styles.skillName}>{skill.name}</span>
                <span className={styles.skillScore} style={{ color: 'var(--accent-purple)' }}>{skill.score}</span>
              </div>
              <div className={styles.progressBarContainer}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${skill.score}%`, background: 'var(--accent-purple)' }} />
                </div>
                <div className={styles.skillMeta}>
                  <span className={styles.metaItem}><Zap size={12} /> Confidence: {skill.confidence}%</span>
                  <span className={styles.metaItem}><Target size={12} /> Focus Area</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

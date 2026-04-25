'use client';

import React from 'react';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  ChevronRight, 
  Star,
  Target,
  Zap,
  Briefcase
} from 'lucide-react';
import styles from './opportunities.module.css';

const OPPORTUNITIES = [
  {
    id: 1,
    company: 'Vercel',
    role: 'Backend Engineer (Product)',
    location: 'Remote',
    salary: '$140k - $190k',
    fit: 94,
    matchReason: 'Expert Next.js & System Design score matches 100% of core requirements.',
    logo: 'V'
  },
  {
    id: 2,
    company: 'Linear',
    role: 'Infrastructure Engineer',
    location: 'Remote',
    salary: '$150k - $210k',
    fit: 88,
    matchReason: 'Your Distributed Cache Viz evidence is highly relevant to their current stack.',
    logo: 'L'
  },
  {
    id: 3,
    company: 'Supabase',
    role: 'Database Engineer Intern',
    location: 'Remote',
    salary: 'Competitive',
    fit: 91,
    matchReason: 'PostgreSQL mastery & Open Source contribution history aligns perfectly.',
    logo: 'S'
  },
  {
    id: 4,
    company: 'Anthropic',
    role: 'AI Infrastructure Intern',
    location: 'San Francisco',
    salary: 'Top Tier',
    fit: 72,
    matchReason: 'High potential, but requires more Python/ML evidence in your Vault.',
    logo: 'A'
  }
];

export default function OpportunitiesPage() {
  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
          Opportunity <span className="text-gradient">Discovery</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Ranked by **Skill Fit**, **Monthly Worth Impact**, and **Evidence Strength**.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px' }}>
        <div className={styles.opportunityGrid}>
          {OPPORTUNITIES.map((opp) => (
            <div key={opp.id} className={`glass-card ${styles.oppCard}`}>
              <div className={styles.logo}>{opp.logo}</div>
              
              <div className={styles.info}>
                <span className={styles.company}>{opp.company}</span>
                <h3 className={styles.title}>{opp.role}</h3>
                <div className={styles.meta}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} /> {opp.location}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <DollarSign size={14} /> {opp.salary}
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', borderLeft: '2px solid var(--border-subtle)', paddingLeft: '12px', fontStyle: 'italic' }}>
                  "{opp.matchReason}"
                </p>
              </div>

              <div className={styles.ranking}>
                <div>
                  <span className={styles.fitLabel}>Match Score</span>
                  <div className={styles.fitScore}>{opp.fit}%</div>
                </div>
                <button className={styles.actionBtn}>
                  Apply with Vault
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.sidebar}>
          <div className={`glass-card ${styles.filterCard}`}>
            <h3 style={{ fontSize: '1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={18} color="var(--accent-blue)" />
              Match Criteria
            </h3>
            <div className={styles.filterItem}>
              <span>Min Salary</span>
              <span style={{ fontWeight: 600 }}>$120k</span>
            </div>
            <div className={styles.filterItem}>
              <span>Role Focus</span>
              <span style={{ fontWeight: 600 }}>Backend</span>
            </div>
            <div className={styles.filterItem}>
              <span>Min Match</span>
              <span style={{ fontWeight: 600 }}>75%</span>
            </div>
            <button className="glass-card" style={{ width: '100%', padding: '8px', fontSize: '0.8rem', marginTop: '12px' }}>
              Update Preferences
            </button>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={18} color="var(--accent-amber)" fill="var(--accent-amber)" />
              Top fit of the week
            </h3>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--bg-surface-hover)', borderRadius: '8px', display: 'flex', alignItems: 'center', justify-content: 'center', fontWeight: 800 }}>V</div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Backend @ Vercel</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>94% Match Score</div>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '16px' }}>
              This role prioritizes Next.js mastery. Your 92% React score and "Adaptive Scheduler" project make you a primary candidate.
            </p>
            <button style={{ width: '100%', padding: '10px', background: 'var(--accent-blue)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '0.8rem' }}>
              Instant Prep
            </button>
          </div>

          <div className="glass-card" style={{ padding: '24px', background: 'rgba(59, 130, 246, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Zap size={18} color="var(--accent-blue)" fill="var(--accent-blue)" />
              <span style={{ fontWeight: 600 }}>Application Pulse</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>3</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Active applications in pipeline</span>
          </div>
        </div>
      </div>
    </div>
  );
}

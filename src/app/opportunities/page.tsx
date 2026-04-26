'use client';

import React, { useState, useEffect } from 'react';
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
import { getOSState } from '@/lib/actions';
import styles from './opportunities.module.css';

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const state = await getOSState();
      if ((state as any).user) {
        setOpportunities((state as any).user.opportunities || []);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex-center" style={{ height: '50vh' }}>Scanning the market...</div>;
  }

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
          Opportunity <span className="text-gradient">Discovery</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Real opportunities ranked by **Skill Fit** and **Evidence Strength**.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px' }}>
        <div className={styles.opportunityGrid}>
          {opportunities.length > 0 ? opportunities.map((opp) => (
            <div key={opp.id} className={`glass-card ${styles.oppCard}`}>
              <div className={styles.logo}>{opp.company[0]}</div>
              
              <div className={styles.info}>
                <span className={styles.company}>{opp.company}</span>
                <h3 className={styles.title}>{opp.title}</h3>
                <div className={styles.meta}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} /> {opp.location || 'Remote'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <DollarSign size={14} /> {opp.salary || 'Competitive'}
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', borderLeft: '2px solid var(--border-subtle)', paddingLeft: '12px', fontStyle: 'italic' }}>
                  "{opp.reason || 'Matches your core skill profile.'}"
                </p>
              </div>

              <div className={styles.ranking}>
                <div>
                  <span className={styles.fitLabel}>Match Score</span>
                  <div className={styles.fitScore}>{opp.fitScore}%</div>
                </div>
                <a href={opp.url} target="_blank" rel="noopener noreferrer">
                  <button className={styles.actionBtn}>
                    Apply with Vault
                  </button>
                </a>
              </div>
            </div>
          )) : (
            <div className="glass-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <Briefcase size={40} style={{ marginBottom: '20px', opacity: 0.5 }} />
              <h3>No opportunities discovered yet.</h3>
              <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Connect more skills or evidence to increase your market visibility.</p>
            </div>
          )}
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
            {opportunities.length > 0 ? (
              <>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--bg-surface-hover)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{opportunities[0].company[0]}</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{opportunities[0].title} @ {opportunities[0].company}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>{opportunities[0].fitScore}% Match Score</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '16px' }}>
                  This role prioritizes your top skills. Use your "ELITE" evidence items to stand out.
                </p>
                <button style={{ width: '100%', padding: '10px', background: 'var(--accent-blue)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '0.8rem' }}>
                  Instant Prep
                </button>
              </>
            ) : (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Waiting for market data...</p>
            )}
          </div>

          <div className="glass-card" style={{ padding: '24px', background: 'rgba(59, 130, 246, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Zap size={18} color="var(--accent-blue)" fill="var(--accent-blue)" />
              <span style={{ fontWeight: 600 }}>Application Pulse</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>
              {opportunities.filter(o => o.status !== 'DISCOVERED').length}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Active applications in pipeline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
